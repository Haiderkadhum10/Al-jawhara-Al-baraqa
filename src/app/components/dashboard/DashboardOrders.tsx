import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Eye, CheckCircle2, Clock, Truck, XCircle, Trash2, LayoutGrid, List } from "lucide-react";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { fetchOrders, deleteOrderAndItems, updateOrderStatus, DashboardOrder, OrderStatus } from "@/lib/services/ordersService";
import { OrderDetailsModal } from "./orders/OrderDetailsModal";
import { DeleteOrderDialog } from "./orders/DeleteOrderDialog";
import { StatusDropdown } from "./orders/StatusDropdown";
import { OrderKanban } from "./orders/OrderKanban";
import { useProducts } from "../../context/ProductContext";

const statusMap: Record<
  OrderStatus,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: { label: "قيد الانتظار", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
  approved: { label: "تمت الموافقة", icon: CheckCircle2, color: "text-blue-600 bg-blue-50 border-blue-100" },
  delivering: { label: "قيد التوصيل", icon: Truck, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  delivered: { label: "تم التوصيل", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
  cancelled: { label: "ملغي", icon: XCircle, color: "text-rose-600 bg-rose-50 border-rose-100" },
};

export function DashboardOrders() {
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const PAGE_SIZE = 12;

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const mappedOrders = await fetchOrders(100);
        setOrders(mappedOrders);
      } catch (err) {
        logger.error("Unexpected error loading orders", err, { feature: "dashboard", action: "loadOrders" });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const deleteOrder = async (orderId: string) => {
    setConfirmOrderId(orderId);
  };

  const confirmDeleteOrder = async () => {
    if (!confirmOrderId) return;
    const orderId = confirmOrderId;
    setConfirmOrderId(null);
    setDeletingId(orderId);
    try {
      const success = await deleteOrderAndItems(orderId);
      if (success) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        if (selectedOrder?.id === orderId) setSelectedOrder(null);
      }
    } finally {
      setDeletingId(null);
    }
  };
  
  const { refreshProducts } = useProducts();

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      // Refresh products to update stock quantities in the UI
      void refreshProducts();
    }
  };

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      o.customerName.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q) ||
      o.customerPhone.includes(q)
    );
  }, [orders, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage, PAGE_SIZE]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">إدارة الطلبات</h2>
          <p className="text-muted-foreground text-sm">تتبع وحالات طلبات العملاء من Supabase</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/30">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
              القائمة
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "kanban" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
              المراحل
            </button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث باسم العميل أو رقم الطلب أو الهاتف..."
              className="w-full bg-card border border-border/50 rounded-xl py-2 pr-10 pl-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {viewMode === "kanban" ? (
        <OrderKanban 
          orders={filteredOrders}
          statusMap={statusMap}
          onStatusChange={handleStatusChange}
          onViewDetails={setSelectedOrder}
          onDeleteRequest={deleteOrder}
        />
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-right border-separate border-spacing-y-3 min-w-[800px]">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">العميل</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">الهاتف</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">التاريخ</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">المنتجات</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">الإجمالي</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">الحالة</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground bg-card rounded-[2rem] border border-border/50">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      <span className="font-bold">جاري تحميل الطلبات...</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground bg-card rounded-[2rem] border border-border/50">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingBag className="w-12 h-12 opacity-20" />
                      <span className="font-bold text-lg">لا توجد طلبات حتى الآن.</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                paginatedOrders.map((order) => {
                  const date = new Date(order.createdAt).toLocaleDateString("ar-IQ");
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-card hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 relative z-10"
                    >
                      <td className="px-6 py-5 first:rounded-r-[1.5rem] last:rounded-l-[1.5rem] border-y border-r border-border/30 first:border-r group-hover:border-primary/20">
                        <span className="font-black text-primary bg-primary/5 px-2 py-1 rounded-lg text-xs">
                          #{order.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-5 border-y border-border/30 group-hover:border-primary/20">
                        <p className="font-black text-foreground text-sm">{order.customerName}</p>
                      </td>
                      <td className="px-6 py-5 border-y border-border/30 group-hover:border-primary/20">
                         <span className="text-xs font-bold text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg dir-ltr">
                           {order.customerPhone}
                         </span>
                      </td>
                      <td className="px-6 py-5 border-y border-border/30 group-hover:border-primary/20">
                        <p className="text-xs font-bold text-muted-foreground">{date}</p>
                      </td>
                      <td className="px-6 py-5 border-y border-border/30 group-hover:border-primary/20 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted font-black text-xs">
                          {order.items.length}
                        </span>
                      </td>
                      <td className="px-6 py-5 border-y border-border/30 group-hover:border-primary/20">
                        <p className="font-black text-sm text-foreground">
                          {formatPrice(order.total)} <span className="text-[10px] text-muted-foreground mr-1">د.ع</span>
                        </p>
                      </td>
                      <td className="px-6 py-5 border-y border-border/30 group-hover:border-primary/20">
                        <StatusDropdown 
                          status={order.status}
                          statusMap={statusMap}
                          onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                        />
                      </td>
                      <td className="px-6 py-5 border-y border-l border-border/30 first:border-r last:rounded-l-[1.5rem] group-hover:border-primary/20">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={deletingId === order.id}
                            className="h-9 w-9 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                            onClick={() => deleteOrder(order.id)}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            الصفحة السابقة
          </button>
          <span className="text-sm text-muted-foreground font-bold">
            صفحة {currentPage} من {totalPages}
          </span>
          <button
            className="px-4 py-2 rounded-xl border border-border/50 bg-card text-sm font-bold disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            الصفحة التالية
          </button>
        </div>
      )}

      <OrderDetailsModal
        selectedOrder={selectedOrder}
        deletingId={deletingId}
        statusMap={statusMap}
        onClose={() => setSelectedOrder(null)}
        onDeleteRequest={deleteOrder}
        onStatusUpdate={handleStatusChange}
      />

      <DeleteOrderDialog
        confirmOrderId={confirmOrderId}
        onClose={() => setConfirmOrderId(null)}
        onConfirm={confirmDeleteOrder}
      />
    </div>
  );
}
