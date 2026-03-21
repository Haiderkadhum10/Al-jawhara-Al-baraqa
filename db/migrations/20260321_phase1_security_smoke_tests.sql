-- Phase 1 Security Smoke Tests
-- Run these after:
-- 1) 20260321_phase1_security_up.sql
-- 2) assigning at least one admin in public.user_roles

-- ============================================================
-- A) Basic schema/security checks
-- ============================================================

-- A1) RLS enabled on critical tables
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('products', 'customers', 'orders', 'order_items', 'store_settings', 'user_roles')
ORDER BY relname;

-- A2) Required function exists
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'create_order_secure';

-- A3) Policies installed
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('products', 'customers', 'orders', 'order_items', 'store_settings', 'user_roles')
ORDER BY tablename, policyname;

-- ============================================================
-- B) Data sanity checks
-- ============================================================

-- B1) No duplicate phone numbers
SELECT phone, COUNT(*) AS duplicates
FROM public.customers
GROUP BY phone
HAVING COUNT(*) > 1;

-- B2) Invalid order totals
SELECT id, total_amount
FROM public.orders
WHERE total_amount < 0;

-- B3) Invalid order items
SELECT id, quantity, unit_price
FROM public.order_items
WHERE quantity <= 0 OR unit_price < 0;

-- ============================================================
-- C) Secure checkout RPC functional test (service role / admin)
-- ============================================================
-- NOTE:
-- - This validates RPC logic and stock checks.
-- - Prefer running on staging data.

-- Replace with real product IDs from your DB.
-- Example:
-- SELECT id, name, price, stock FROM public.products WHERE status='active' LIMIT 3;

-- Example invocation:
-- SELECT *
-- FROM public.create_order_secure(
--   p_full_name := 'عميل اختبار',
--   p_phone := '07900000000',
--   p_address := 'عنوان اختبار',
--   p_city := 'بغداد',
--   p_payment_method := 'cash',
--   p_notes := 'طلب اختبار',
--   p_items := '[{"id":"<PRODUCT_UUID_1>","quantity":1},{"id":"<PRODUCT_UUID_2>","quantity":2}]'::jsonb
-- );

-- Check resulting order and items:
-- SELECT * FROM public.orders ORDER BY created_at DESC LIMIT 1;
-- SELECT * FROM public.order_items WHERE order_id = '<ORDER_ID_FROM_RPC>';
