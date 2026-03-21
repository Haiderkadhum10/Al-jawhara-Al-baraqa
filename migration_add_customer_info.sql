-- Migration script to add missing columns to an existing database
-- Run this in the Supabase SQL Editor

-- 1. Add missing columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_phone text;

-- 2. Add missing RLS policy for order_items (to fix "Products 0" issue)
DROP POLICY IF EXISTS order_items_admin_all ON public.order_items;
CREATE POLICY order_items_admin_all ON public.order_items 
FOR ALL TO authenticated 
USING (public.is_admin(auth.uid()));

-- 3. Populate existing orders with customer data (optional but helpful)
UPDATE public.orders o
SET 
  customer_name = c.full_name,
  customer_phone = c.phone
FROM public.customers c
WHERE o.customer_id = c.id
AND (o.customer_name IS NULL OR o.customer_phone IS NULL);

-- 4. Grant access to everyone for the products (public read)
-- This ensures the checkout RPC can find products
DROP POLICY IF EXISTS products_public_read_active ON public.products;
CREATE POLICY products_public_read_active 
ON public.products 
FOR SELECT 
TO anon, authenticated 
USING (status = 'active' OR public.is_admin(auth.uid()));

-- 5. Ensure existing products have stock
UPDATE public.products SET stock = 10 WHERE stock IS NULL OR stock = 0;
