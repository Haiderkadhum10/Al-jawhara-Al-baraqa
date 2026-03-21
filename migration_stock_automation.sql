-- ==============================================================================
-- 🔄 أتمتة إدارة المخزون (Automated Stock Management)
-- ==============================================================================

-- ١. وظيفة معالجة المخزون عند تغير حالة الطلب
CREATE OR REPLACE FUNCTION public.handle_stock_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_item RECORD;
BEGIN
  -- أ. إذا تحول الطلب إلى "ملغي" (Cancelled)، قم بإرجاع الكمية للمخزون
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id
    LOOP
      UPDATE public.products 
      SET stock = stock + v_item.quantity 
      WHERE id = v_item.product_id;
    END LOOP;
  END IF;

  -- ب. إذا تم التراجع عن الإلغاء (من ملغي إلى أي حالة أخرى)، قم بخصم الكمية مرة أخرى
  IF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
    FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = NEW.id
    LOOP
      UPDATE public.products 
      SET stock = GREATEST(0, stock - v_item.quantity)
      WHERE id = v_item.product_id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ٢. إنشاء التريغر (Trigger) على جدول الطلبات
DROP TRIGGER IF EXISTS trg_stock_on_status_change ON public.orders;
CREATE TRIGGER trg_stock_on_status_change
AFTER UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_stock_on_status_change();

-- ٣. تأكد من أن المخزون لا يحتوي على قيم NULL
UPDATE public.products SET stock = 0 WHERE stock IS NULL;
