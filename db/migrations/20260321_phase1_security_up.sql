-- Phase 1 Security Up Migration
-- Apply in Supabase SQL editor (or your migration runner) in a transaction when possible.

BEGIN;

-- 1) Enable RLS on sensitive tables
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;

-- 2) Roles table and admin helper
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = uid
      AND ur.role = 'admin'
  );
$$;

-- 3) Store settings (server-trusted delivery price)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  delivery_price numeric(12,2) NOT NULL DEFAULT 5000,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO public.store_settings (id, delivery_price)
VALUES (1, 5000)
ON CONFLICT (id) DO NOTHING;

-- 4) Data constraints
ALTER TABLE public.customers
  ALTER COLUMN phone SET NOT NULL;

DO $$
BEGIN
  ALTER TABLE public.customers
    ADD CONSTRAINT unique_customer_phone UNIQUE (phone);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER TABLE public.products
    ADD CONSTRAINT products_status_check CHECK (status IN ('active', 'archived', 'deleted'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER TABLE public.orders
    ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER TABLE public.orders
    ADD CONSTRAINT orders_total_amount_check CHECK (total_amount >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_quantity_check CHECK (quantity > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_unit_price_check CHECK (unit_price >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- 5) Replace policies
DROP POLICY IF EXISTS products_public_read_active ON public.products;
DROP POLICY IF EXISTS products_admin_all ON public.products;
DROP POLICY IF EXISTS customers_admin_all ON public.customers;
DROP POLICY IF EXISTS orders_admin_all ON public.orders;
DROP POLICY IF EXISTS orders_owner_read ON public.orders;
DROP POLICY IF EXISTS order_items_admin_all ON public.order_items;
DROP POLICY IF EXISTS order_items_owner_read ON public.order_items;
DROP POLICY IF EXISTS store_settings_public_read ON public.store_settings;
DROP POLICY IF EXISTS store_settings_admin_write ON public.store_settings;
DROP POLICY IF EXISTS user_roles_admin_all ON public.user_roles;

CREATE POLICY products_public_read_active
ON public.products
FOR SELECT
TO anon, authenticated
USING (status = 'active' OR public.is_admin(auth.uid()));

CREATE POLICY products_admin_all
ON public.products
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY customers_admin_all
ON public.customers
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY orders_admin_all
ON public.orders
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY orders_owner_read
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.customers c
    WHERE c.id = customer_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY order_items_admin_all
ON public.order_items
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY order_items_owner_read
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE o.id = order_id
      AND c.user_id = auth.uid()
  )
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY store_settings_public_read
ON public.store_settings
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY store_settings_admin_write
ON public.store_settings
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_roles_admin_all
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 6) Secure checkout RPC (server-side pricing and stock checks)
CREATE OR REPLACE FUNCTION public.create_order_secure(
  p_full_name text,
  p_phone text,
  p_address text,
  p_city text,
  p_payment_method text,
  p_notes text,
  p_items jsonb
)
RETURNS TABLE(order_id uuid, final_total numeric)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
  v_order_id uuid;
  v_delivery_price numeric(12,2);
  v_subtotal numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%ROWTYPE;
  v_quantity int;
BEGIN
  IF p_full_name IS NULL OR btrim(p_full_name) = '' THEN RAISE EXCEPTION 'FULL_NAME_REQUIRED'; END IF;
  IF p_phone IS NULL OR btrim(p_phone) = '' THEN RAISE EXCEPTION 'PHONE_REQUIRED'; END IF;
  IF p_address IS NULL OR btrim(p_address) = '' THEN RAISE EXCEPTION 'ADDRESS_REQUIRED'; END IF;
  IF p_city IS NULL OR btrim(p_city) = '' THEN RAISE EXCEPTION 'CITY_REQUIRED'; END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'ITEMS_REQUIRED';
  END IF;

  SELECT delivery_price INTO v_delivery_price FROM public.store_settings WHERE id = 1;
  IF v_delivery_price IS NULL THEN v_delivery_price := 5000; END IF;

  SELECT id INTO v_customer_id FROM public.customers WHERE phone = p_phone LIMIT 1;

  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (user_id, full_name, phone, address, city)
    VALUES (auth.uid(), btrim(p_full_name), btrim(p_phone), btrim(p_address), btrim(p_city))
    RETURNING id INTO v_customer_id;
  ELSE
    UPDATE public.customers
    SET full_name = btrim(p_full_name),
        address = btrim(p_address),
        city = btrim(p_city)
    WHERE id = v_customer_id;
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := COALESCE((v_item ->> 'quantity')::int, 0);
    IF v_quantity <= 0 THEN RAISE EXCEPTION 'INVALID_QUANTITY'; END IF;

    SELECT * INTO v_product
    FROM public.products
    WHERE id = (v_item ->> 'id')::uuid
      AND status = 'active';

    IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND'; END IF;
    IF v_product.stock IS NOT NULL AND v_product.stock < v_quantity THEN RAISE EXCEPTION 'INSUFFICIENT_STOCK'; END IF;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  END LOOP;

  INSERT INTO public.orders (customer_id, status, total_amount, payment_method, notes)
  VALUES (
    v_customer_id,
    'pending',
    v_subtotal + v_delivery_price,
    COALESCE(NULLIF(btrim(p_payment_method), ''), 'cash'),
    NULLIF(btrim(COALESCE(p_notes, '')), '')
  )
  RETURNING id INTO v_order_id;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item ->> 'quantity')::int;
    SELECT * INTO v_product FROM public.products WHERE id = (v_item ->> 'id')::uuid AND status = 'active';

    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_product.id, v_product.name, v_quantity, v_product.price);

    IF v_product.stock IS NOT NULL THEN
      UPDATE public.products
      SET stock = GREATEST(0, stock - v_quantity)
      WHERE id = v_product.id;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_order_id, v_subtotal + v_delivery_price;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_secure(text, text, text, text, text, text, jsonb)
TO anon, authenticated;

COMMIT;
