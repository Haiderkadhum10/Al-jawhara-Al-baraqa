import { motion } from "framer-motion";
import { Clock, CheckCircle2, Truck, Eye, Trash2, ArrowLeft, ArrowRight, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { DashboardOrder, OrderStatus } from "@/lib/services/ordersService";
import { Button } from "../../ui/button";

interface OrderKanbanProps {
  orders: DashboardOrder[];
  statusMap: any;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: DashboardOrder) => void;
  onDeleteRequest: (orderId: string) => void;
}

const COLUMNS: { id: OrderStatus; label: string; icon: any; color: string }[] = [
  { id: "pending", label: "قيد الانتظار", icon: Clock, color: "bg-amber-500" },
  { id: "delivering", label: "قيد التوصيل", icon: Truck, color: "bg-indigo-500" },
  { id: "delivered", label: "تم الاستلام", icon: CheckCircle2, color: "bg-emerald-500" },
  { id: "cancelled", label: "ملغي", icon: XCircle, color: "bg-rose-500" },
];

export function OrderKanban({ orders, statusMap, onStatusChange, onViewDetails, onDeleteRequest }: OrderKanbanProps) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[600px]">
      {COLUMNS.map((col) => {
        const colOrders = orders.filter(o => o.status === col.id);
        return (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="font-black text-sm">{col.label}</h3>
              </div>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full">
                {colOrders.length}
              </span>
            </div>

            <div className="flex-1 bg-muted/20 rounded-[2rem] p-3 border border-border/30 space-y-3 min-h-[150px]">
              {colOrders.map((order) => {
                return (
                  <motion.div
                    layoutId={order.id}
                    key={order.id}
                    className="bg-card p-6 rounded-[2.5rem] border border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group flex flex-col gap-5 relative overflow-hidden"
                  >
                    {/* Subtle glow effect */}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-[10px] font-black tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => onViewDetails(order)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteRequest(order.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50/50 hover:bg-rose-100 text-rose-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                      <h4 className="font-black text-lg text-foreground tracking-tight">{order.customerName}</h4>
                      <p className="text-xs font-bold text-muted-foreground/80 tracking-widest dir-ltr">
                        {order.customerPhone}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-border/30 space-y-4 relative z-10">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black text-muted-foreground uppercase opacity-60">الإجمالي</span>
                        <span className="font-black text-lg text-primary">
                          {formatPrice(order.total)} <span className="text-xs opacity-60 mr-0.5">IQD</span>
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => onStatusChange(order.id, 'delivering')}
                            className="w-full h-11 bg-primary hover:bg-primary-dark text-white rounded-[1.25rem] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
                          >
                            <span>الموافقة وبدء التوصيل</span>
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                        
                        {order.status === 'delivering' && (
                          <button
                            onClick={() => onStatusChange(order.id, 'delivered')}
                            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.25rem] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>تم الاستلام</span>
                          </button>
                        )}

                        <div className="flex items-center gap-2">
                          {(order.status === 'delivering' || order.status === 'delivered') && (
                            <button
                              onClick={() => onStatusChange(order.id, 'pending')}
                              className="flex-1 h-10 flex items-center justify-center rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground text-xs font-bold gap-1.5 transition-all"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                              إعادة للانتظار
                            </button>
                          )}
                          {order.status !== 'cancelled' && order.status !== 'delivered' && (
                            <button
                              onClick={() => onStatusChange(order.id, 'cancelled')}
                              className="flex-1 h-10 flex items-center justify-center rounded-xl bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-bold gap-1.5 transition-all border border-rose-100/50 hover:border-rose-200"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              إلغاء الطلب
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badge for time or count */}
                    <div className="absolute left-0 bottom-0 w-1 h-12 bg-primary/20 rounded-r-full group-hover:bg-primary group-hover:h-full transition-all duration-500" />
                  </motion.div>
                );
              })}
              {colOrders.length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-border/30 rounded-2xl">
                   <p className="text-[10px] text-muted-foreground font-bold">لا يوجد طلبات</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
