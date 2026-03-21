-- DEPRECATED (Archived root SQL)
-- Canonical source moved to:
-- db/migrations/20260321_legacy_indexes_up.sql
--
-- Keep this file only as historical reference; do not execute from repository root.
-- ==============================================================================
-- products indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- order_items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- customers indexes (if any specific searching is done frequently)
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
