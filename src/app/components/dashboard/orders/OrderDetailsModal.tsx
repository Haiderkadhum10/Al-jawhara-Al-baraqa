import { AnimatePresence, motion } from "framer-motion";
import { Clock, Phone, MapPin, Banknote, CreditCard, Package, Printer, Trash2, X } from "lucide-react";
import { Button } from "../../ui/button";
import { formatPrice } from "@/lib/utils";
import type { DashboardOrder, OrderStatus } from "@/lib/services/ordersService";
import { StatusDropdown } from "./StatusDropdown";

interface OrderDetailsModalProps {
  selectedOrder: DashboardOrder | null;
  deletingId: string | null;
  statusMap: Record<OrderStatus, { label: string; icon: typeof Clock; color: string }>;
  onClose: () => void;
  onDeleteRequest: (orderId: string) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
}

export function OrderDetailsModal({
  selectedOrder,
  deletingId,
  statusMap,
  onClose,
  onDeleteRequest,
  onStatusUpdate,
}: OrderDetailsModalProps) {
  return (
    <AnimatePresence>
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            id="print-section"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="bg-background rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-h-none print:max-w-none print:rounded-none"
          >
            <style media="print">
              {`
                @page { size: auto; margin: 15mm; }
                body * { visibility: hidden; }
                #print-section, #print-section * { visibility: visible; }
                #print-section { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
                .print-hide { display: none !important; }
                * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              `}
            </style>

            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2 print-hide">
                <button
                  onClick={() => window.print()}
                  className="w-10 h-10 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center transition-colors shadow-sm"
                  title="طباعة / تنزيل PDF"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-black">تفاصيل الطلب</h3>
                <p className="text-xs text-muted-foreground font-mono">#{selectedOrder.id.slice(0, 12)}</p>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-5 print:overflow-visible">
              <div className="flex items-center justify-between">
                <StatusDropdown 
                  status={selectedOrder.status}
                  statusMap={statusMap}
                  onStatusChange={(status) => onStatusUpdate(selectedOrder.id, status)}
                />
                <span className="text-xs text-muted-foreground mr-auto">
                  {new Date(selectedOrder.createdAt).toLocaleString("ar-IQ")}
                </span>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-sm text-right">بيانات العميل</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">الاسم الكامل</p>
                      <p className="font-bold text-sm">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                      <p className="font-bold text-sm" dir="ltr">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">المحافظة / المدينة</p>
                      <p className="font-bold text-sm">{selectedOrder.customerCity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">العنوان التفصيلي</p>
                      <p className="font-bold text-sm">{selectedOrder.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                <h4 className="font-black text-sm text-right">طريقة الدفع</h4>
                <div className="flex items-center gap-2 flex-row-reverse">
                  {selectedOrder.paymentMethod === "cash" ? (
                    <><Banknote className="w-4 h-4 text-primary" /><span className="font-bold text-sm">كاش عند الاستلام</span></>
                  ) : (
                    <><CreditCard className="w-4 h-4 text-primary" /><span className="font-bold text-sm">محفظة إلكترونية</span></>
                  )}
                </div>
                {selectedOrder.notes && (
                  <p className="text-sm text-muted-foreground italic text-right border-t border-border/50 pt-2 mt-2">
                    📝 {selectedOrder.notes}
                  </p>
                )}
              </div>

              {selectedOrder.items.length > 0 && (
                <div className="bg-muted/30 rounded-2xl p-4 space-y-3">
                  <h4 className="font-black text-sm text-right flex items-center gap-1.5 flex-row-reverse">
                    <Package className="w-4 h-4 text-primary" />
                    المنتجات المطلوبة
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">{formatPrice(item.unit_price * item.quantity)} د.ع</span>
                        <div className="text-right">
                          <span className="text-sm font-bold">{item.product_name}</span>
                          <span className="text-xs text-muted-foreground mr-2">× {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border/50 bg-primary/5 space-y-3">
              {(() => {
                const itemsTotal = selectedOrder.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
                const deliveryCost = selectedOrder.total - itemsTotal;
                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground font-bold px-2">
                      <span>{formatPrice(itemsTotal)} د.ع</span>
                      <span>مجموع المواد</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground font-bold px-2 pb-3 border-b border-border/50 border-dashed">
                      <span>{deliveryCost > 0 ? `${formatPrice(deliveryCost)} د.ع` : "مجاناً"}</span>
                      <span>كلفة التوصيل</span>
                    </div>
                  </div>
                );
              })()}

              <div className="flex items-center justify-between pt-1">
                <span className="text-2xl font-black text-primary">{formatPrice(selectedOrder.total)} د.ع</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-foreground">الإجمالي القياسي</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === selectedOrder.id}
                    className="text-destructive hover:bg-destructive/10 rounded-xl print-hide"
                    onClick={() => onDeleteRequest(selectedOrder.id)}
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    حذف الطلب
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
