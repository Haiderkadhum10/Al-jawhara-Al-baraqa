-- DEPRECATED (Archived root SQL)
-- This file contains an old RPC name (`create_secure_order`) and legacy policy model.
-- Canonical source is:
-- db/migrations/20260321_phase1_security_up.sql
-- with RPC: public.create_order_secure
--
-- Keep this file only as historical reference; do not execute from repository root.
-- ==============================================================================

-- 1. إعادة تفعيل RLS على جميع الجداول
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 2. إزالة أي سياسات قديمة (لتنظيف السجل)
DO $$ DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ==============================================================================
-- 🛡️ سياسات الوصول الآمن (Row Level Security Policies)
-- ==============================================================================

-- سياسات جدول المنتجات: السماح بقراءة المنتجات للجميع
CREATE POLICY "Allow public read access to products" ON public.products
  FOR SELECT USING (true);

-- سياسات للمدير (Authenticated) للوصول الكامل
CREATE POLICY "Allow admin full access to products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to customers" ON public.customers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to orders" ON public.orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access to order_items" ON public.order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ملاحظة: لم نعطِ صلاحية الإدخال (INSERT) للزوار العاديين على الجداول السابقة!
-- الزوار سيستخدمون وظيفة (RPC) أدناه والتي تعمل بصلاحيات عالية لتنفيذ الطلب بأمان.


-- ==============================================================================
-- ⚡ دالة الطلب الآمنة (Secure RPC Checkout)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.create_secure_order(
  p_phone text,
  p_full_name text,
  p_address text,
  p_city text,
  p_payment_method text,
  p_notes text,
  p_shipping_cost numeric,
  p_items jsonb -- مدخلات المشتريات: [{"id": "uuid", "quantity": int}]
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- هذه التعليمة تجعل الدالة تتجاوز RLS وتعمل بصلاحيات منشئها
SET search_path = public
AS $$
DECLARE
  v_customer_id uuid;
  v_stored_name text;
  v_order_id uuid;
  v_total_amount numeric(12,2) := 0;
  
  v_item record;
  v_product record;
  v_item_total numeric(12,2);
BEGIN
  -- 1️⃣ التحقق من العميل (موجود مسبقاً أم جديد)
  SELECT id, full_name INTO v_customer_id, v_stored_name
  FROM customers
  WHERE phone = p_phone
  LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
    -- الحماية: التدقيق في الهوية لمنع تغيير طلبات سابقة
    IF trim(v_stored_name) != trim(p_full_name) THEN
      RAISE EXCEPTION 'NAME_MISMATCH';
    END IF;
    
    -- تحديث العنوان الحالي
    UPDATE customers 
    SET address = trim(p_address), city = trim(p_city)
    WHERE id = v_customer_id;
  ELSE
    -- إنشاء سجل لعميل جديد
    INSERT INTO customers (full_name, phone, address, city)
    VALUES (trim(p_full_name), p_phone, trim(p_address), trim(p_city))
    RETURNING id INTO v_customer_id;
  END IF;

  -- 2️⃣ حساب التكلفة وتسعير المنتجات (آلياً من الداتابيس لمنع التلاعب)
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(id uuid, quantity int)
  LOOP
    SELECT name, price INTO v_product
    FROM products
    WHERE id = v_item.id;

    IF v_product.name IS NULL THEN
      RAISE EXCEPTION 'PRODUCT_NOT_FOUND: %', v_item.id;
    END IF;

    v_item_total := v_product.price * v_item.quantity;
    v_total_amount := v_total_amount + v_item_total;
  END LOOP;

  -- جمع تكلفة التوصيل
  v_total_amount := v_total_amount + p_shipping_cost;

  -- 3️⃣ إنشاء الطلب الرئيسي
  INSERT INTO orders (customer_id, total_amount, payment_method, notes)
  VALUES (v_customer_id, v_total_amount, p_payment_method, p_notes)
  RETURNING id INTO v_order_id;

  -- 4️⃣ إدراج المنتجات المشترة داخل الطلب
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(id uuid, quantity int)
  LOOP
    SELECT name, price INTO v_product FROM products WHERE id = v_item.id;
    
    INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
    VALUES (v_order_id, v_item.id, v_product.name, v_item.quantity, v_product.price);
  END LOOP;

  -- إرجاع رقم الطلب للإشارة بنجاح العملية
  RETURN v_order_id;
END;
$$;
