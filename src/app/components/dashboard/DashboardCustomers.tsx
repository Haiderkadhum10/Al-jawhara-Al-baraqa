import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Search, UserPlus, Mail, Phone, ShoppingBag, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

interface DashboardCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  spent: number;
}

export function DashboardCustomers() {
  const [customers, setCustomers] = useState<DashboardCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try {
        // استخدام view مجمّع من قاعدة البيانات لتحسين الأداء
        const { data, error } = await supabase
          .from("customer_stats")
          .select("id, full_name, email, phone, orders_count, total_spent")
          .limit(200);

        if (error || !data) {
          // eslint-disable-next-line no-console
          console.error("Error fetching customers from Supabase", error);
          setCustomers([]);
          setLoading(false);
          return;
        }

        const mapped: DashboardCustomer[] = data.map((row: any) => ({
          id: row.id,
          name: row.full_name ?? "عميل بدون اسم",
          email: row.email ?? "",
          phone: row.phone ?? "",
          ordersCount: Number(row.orders_count ?? 0),
          spent: Number(row.total_spent ?? 0),
        }));

        setCustomers(mapped);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Unexpected error loading customers", err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCustomers.slice(start, start + PAGE_SIZE);
  }, [filteredCustomers, currentPage, PAGE_SIZE]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">إدارة العملاء</h2>
          <p className="text-muted-foreground text-sm">
            قائمة العملاء وإحصائيات شرائهم من Supabase
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد..."
              className="w-full bg-card border border-border/50 rounded-xl py-2 pr-10 pl-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-primary text-white rounded-xl gap-2 font-bold px-4" disabled>
            <UserPlus className="w-4 h-4" />
            إضافة عميل (قريباً)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            جاري تحميل العملاء...
          </div>
        )}
        {!loading && filteredCustomers.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-10">
            لا يوجد عملاء حتى الآن.
          </div>
        )}

        {!loading &&
          paginatedCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm relative group"
            >
              <button className="absolute top-4 left-4 p-2 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                  <span className="font-black text-primary text-lg">
                    {customer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-lg">{customer.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">
                    ID: #{customer.id.slice(0, 6)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary/50" />
                  <span className="truncate">
                    {customer.email || "بدون بريد إلكتروني"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary/50" />
                  <span>{customer.phone || "بدون رقم هاتف"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">
                    الطلبات
                  </p>
                  <div className="flex items-center justify-center gap-1.5 font-black text-primary">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {customer.ordersCount}
                  </div>
                </div>
                <div className="text-center border-r border-border/50">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">
                    الإنفاق
                  </p>
                  <p className="font-black">
                    {customer.spent > 0 ? `${formatPrice(customer.spent)} د.ع` : "-"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
      </div>

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
    </div>
  );
}
