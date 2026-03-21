-- DEPRECATED (Archived root SQL)
-- Canonical source moved to:
-- db/migrations/20260321_deduplicate_customers_up.sql
--
-- Keep this file only as historical reference; do not execute from repository root.
-- ==============================================================================

-- أولاً: نقل الطلبات إلى الحساب الأقدم
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

-- ثانياً: حذف الحسابات المكررة بعد أن قمنا بتفريغها من الطلبات
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

-- ثالثاً: إضافة قيد يمنع تكرار رقم الهاتف مستقبلاً في قاعدة البيانات لضمان عدم حدوثها مجدداً
-- ملاحظة: إذا فشل هذا السطر، فهذا يعني أن هناك أرقام هواتف ما زالت مكررة بشكل ما أو هناك قيم NULL
ALTER TABLE public.customers ADD CONSTRAINT unique_customer_phone UNIQUE (phone);
