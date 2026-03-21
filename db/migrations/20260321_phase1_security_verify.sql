-- Phase 1 Security Verification Queries
-- Run after applying 20260321_phase1_security_up.sql

-- 1) RLS status
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('products', 'customers', 'orders', 'order_items', 'store_settings', 'user_roles')
ORDER BY relname;

-- 2) Installed policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('products', 'customers', 'orders', 'order_items', 'store_settings', 'user_roles')
ORDER BY tablename, policyname;

-- 3) RPC exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'create_order_secure';

-- 4) Store settings singleton row
SELECT id, delivery_price, updated_at
FROM public.store_settings
WHERE id = 1;
