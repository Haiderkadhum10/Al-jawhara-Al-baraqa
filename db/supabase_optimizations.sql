-- Supabase performance optimizations
-- شغّل هذه الأوامر في SQL Editor داخل مشروع Supabase الخاص بك

-- =========================
-- Products indexes
-- =========================
create index if not exists idx_products_status_created_at
  on products (status, created_at desc);

create index if not exists idx_products_category_status
  on products (category, status);

-- لتحسين البحث بالاسم (اختياري، يحتاج pg_trgm)
create extension if not exists pg_trgm;

create index if not exists idx_products_name_trgm
  on products using gin (name gin_trgm_ops);

-- =========================
-- Orders & order_items indexes
-- =========================
create index if not exists idx_orders_customer_created_at
  on orders (customer_id, created_at desc);

create index if not exists idx_orders_status_created_at
  on orders (status, created_at desc);

create index if not exists idx_order_items_order_id
  on order_items (order_id);

-- =========================
-- Customers indexes
-- =========================
create unique index if not exists customers_email_key on customers(email);

create index if not exists idx_customers_phone on customers(phone);

-- =========================
-- Aggregated customer stats view
-- =========================
create or replace view customer_stats as
select
  c.id,
  c.full_name,
  c.email,
  c.phone,
  count(o.id) as orders_count,
  coalesce(sum(o.total_amount), 0) as total_spent
from customers c
left join orders o on o.customer_id = c.id
group by c.id, c.full_name, c.email, c.phone;

