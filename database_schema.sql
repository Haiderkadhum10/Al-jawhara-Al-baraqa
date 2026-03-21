-- ==============================================================================
-- 🚀 مخطط قاعدة البيانات الموحد والنهائي (Unified Database Schema)
-- ==============================================================================

-- 1. جدول المنتجات (Products)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "nameEn" text,
  price numeric(12,2) NOT NULL,
  description text,
  image text,
  rating int DEFAULT 0,
  category text NOT NULL,
  featured boolean DEFAULT false,
  status text DEFAULT 'active',
  stock int DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

-- 2. جدول العملاء (Customers)
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text,
  phone text,
  address text,
  city text,
  created_at timestamptz DEFAULT now()
);

-- 3. جدول الطلبات (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name text,
  customer_phone text,
  status text DEFAULT 'pending',
  total_amount numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text DEFAULT 'cash',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- 4. جدول عناصر الطلب (Order Items)
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name text,
  quantity int NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 5. جدول الرتب (User Roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

-- 6. جدول إعدادات المتجر (Store Settings)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  delivery_price numeric(12,2) NOT NULL DEFAULT 5000,
  updated_at timestamptz DEFAULT now()
);

-- ==============================================================================
-- 🛠️ الوظائف والقيود الفنية (Functions & Constraints)
-- ==============================================================================

-- وظيفة التحقق من المسؤول
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

-- إضافة قيود الأمان (بشكل آمن لتجنب أخطاء التكرار)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_customer_phone') THEN
    ALTER TABLE public.customers ADD CONSTRAINT unique_customer_phone UNIQUE (phone);
  END IF;
END $$;

-- ==============================================================================
-- 🔐 إعدادات الحماية (RLS)
-- ==============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- تنظيف السياسات السابقة
DROP POLICY IF EXISTS products_public_read_active ON public.products;
DROP POLICY IF EXISTS products_admin_all ON public.products;
DROP POLICY IF EXISTS customers_admin_all ON public.customers;
DROP POLICY IF EXISTS orders_admin_all ON public.orders;
DROP POLICY IF EXISTS store_settings_public_read ON public.store_settings;
DROP POLICY IF EXISTS store_settings_admin_write ON public.store_settings;
DROP POLICY IF EXISTS user_roles_admin_all ON public.user_roles;

-- إنشاء السياسات
CREATE POLICY products_public_read_active ON public.products FOR SELECT TO anon, authenticated USING (status = 'active' OR public.is_admin(auth.uid()));
CREATE POLICY products_admin_all ON public.products FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY customers_admin_all ON public.customers FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY orders_admin_all ON public.orders FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY order_items_admin_all ON public.order_items FOR ALL TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY store_settings_public_read ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY store_settings_admin_write ON public.store_settings FOR UPDATE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY user_roles_admin_all ON public.user_roles FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- ==============================================================================
-- 📦 وظيفة إنشاء الطلب (Secure Order Function)
-- ==============================================================================
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
  -- جلب سعر التوصيل
  SELECT delivery_price INTO v_delivery_price FROM public.store_settings WHERE id = 1;
  IF v_delivery_price IS NULL THEN v_delivery_price := 5000; END IF;

  -- العميل
  SELECT id INTO v_customer_id FROM public.customers WHERE phone = p_phone LIMIT 1;
  IF v_customer_id IS NULL THEN
    INSERT INTO public.customers (user_id, full_name, phone, address, city)
    VALUES (auth.uid(), btrim(p_full_name), btrim(p_phone), btrim(p_address), btrim(p_city))
    RETURNING id INTO v_customer_id;
  ELSE
    UPDATE public.customers SET full_name = btrim(p_full_name), address = btrim(p_address), city = btrim(p_city)
    WHERE id = v_customer_id;
  END IF;

  -- حساب المجموع
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := COALESCE((v_item ->> 'quantity')::int, 0);
    SELECT * INTO v_product FROM public.products WHERE id = (v_item ->> 'id')::uuid AND status = 'active';
    IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND'; END IF;
    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  END LOOP;

  -- إنشاء الطلب (مع حفظ الاسم والهاتف للتوثيق التاريخي)
  INSERT INTO public.orders (customer_id, customer_name, customer_phone, status, total_amount, payment_method, notes)
  VALUES (v_customer_id, btrim(p_full_name), btrim(p_phone), 'pending', v_subtotal + v_delivery_price, COALESCE(NULLIF(btrim(p_payment_method), ''), 'cash'), NULLIF(btrim(COALESCE(p_notes, '')), ''))
  RETURNING id INTO v_order_id;

  -- العناصر
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_quantity := (v_item ->> 'quantity')::int;
    SELECT * INTO v_product FROM public.products WHERE id = (v_item ->> 'id')::uuid;
    INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_product.id, v_product.name, v_quantity, v_product.price);
    IF v_product.stock IS NOT NULL THEN
      UPDATE public.products SET stock = GREATEST(0, stock - v_quantity) WHERE id = v_product.id;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_order_id, v_subtotal + v_delivery_price;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order_secure(text, text, text, text, text, text, jsonb) TO anon, authenticated;

-- ==============================================================================
-- 📊 بيانات أولية (Initial Data)
-- ==============================================================================
INSERT INTO public.store_settings (id, delivery_price) VALUES (1, 5000) ON CONFLICT (id) DO NOTHING;

-- تعيين الادمن
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users WHERE email = 'haider@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- تهيئة المخزون للمنتجات التي ليس لديها مخزون
UPDATE public.products SET stock = 10 WHERE stock IS NULL OR stock = 0;
