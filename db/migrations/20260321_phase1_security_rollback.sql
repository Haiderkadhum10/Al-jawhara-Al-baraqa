-- Phase 1 Security Rollback
-- Use only if you must revert quickly.

BEGIN;

-- Drop RPC
DROP FUNCTION IF EXISTS public.create_order_secure(text, text, text, text, text, text, jsonb);

-- Drop policies
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

-- Optional: disable RLS (not recommended, but provided for emergency rollback)
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.store_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_roles DISABLE ROW LEVEL SECURITY;

-- Optional cleanup: keep commented unless required
-- DROP TABLE IF EXISTS public.store_settings;
-- DROP TABLE IF EXISTS public.user_roles;
-- DROP FUNCTION IF EXISTS public.is_admin(uuid);

COMMIT;
