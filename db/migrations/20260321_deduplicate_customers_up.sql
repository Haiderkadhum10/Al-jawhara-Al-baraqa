-- Legacy customer dedup migration (moved from root deduplicate_customers.sql)
-- Canonical SQL source is db/migrations/*

BEGIN;

WITH duplicates AS (
    SELECT phone
    FROM public.customers
    GROUP BY phone
    HAVING COUNT(*) > 1
),
primary_customers AS (
    SELECT DISTINCT ON (c.phone) c.id as primary_id, c.phone
    FROM public.customers c
    JOIN duplicates d ON c.phone = d.phone
    ORDER BY c.phone, c.created_at ASC
)
UPDATE public.orders o
SET customer_id = pc.primary_id
FROM primary_customers pc, public.customers c
WHERE o.customer_id = c.id
  AND c.phone = pc.phone
  AND c.id != pc.primary_id;

WITH duplicates AS (
    SELECT phone
    FROM public.customers
    GROUP BY phone
    HAVING COUNT(*) > 1
),
primary_customers AS (
    SELECT DISTINCT ON (c.phone) c.id as primary_id, c.phone
    FROM public.customers c
    JOIN duplicates d ON c.phone = d.phone
    ORDER BY c.phone, c.created_at ASC
)
DELETE FROM public.customers c
USING primary_customers pc
WHERE c.phone = pc.phone
  AND c.id != pc.primary_id;

DO $$
BEGIN
  ALTER TABLE public.customers
    ADD CONSTRAINT unique_customer_phone UNIQUE (phone);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

COMMIT;
