import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchDashboardOverviewStats } from "@/lib/services/ordersService";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, Package, Wallet, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { useProducts } from "../../context/ProductContext";

const dummyData = [
  { name: "يناير", sales: 4000, orders: 240 },
  { name: "فبراير", sales: 3000, orders: 198 },
  { name: "مارس", sales: 2000, orders: 150 },
  { name: "أبريل", sales: 2780, orders: 190 },
  { name: "مايو", sales: 1890, orders: 130 },
  { name: "يونيو", sales: 2390, orders: 170 },
  { name: "يوليو", sales: 3490, orders: 210 },
];

const COLORS = ["#c9a85c", "#9d7e3a", "#45B39D", "#5499C7", "#9B59B6", "#E67E22"];

export function DashboardOverview() {
  const { products } = useProducts();
  
  const [stats, setStats] = useState({
    totalSales: 0,
    newOrders: 0,
    activeCustomers: 0,
    totalProducts: 0,
  });
  const [chartData, setChartData] = useState<any[]>(dummyData);

  useEffect(() => {
    const fetchStats = async () => {
      const dbStats = await fetchDashboardOverviewStats();
      if (dbStats) {
        const { orders: completedOrders, totalSales, newOrders, customersCount } = dbStats;

        // Group sales by month for chart (last 7 months)
        const monthsInArabic = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        const monthlyData = new Map();
        
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            monthlyData.set(key, { name: monthsInArabic[d.getMonth()], sales: 0, orders: 0, year: d.getFullYear(), month: d.getMonth() });
        }

        completedOrders.forEach((o: any) => {
            const d = new Date(o.created_at);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (monthlyData.has(key)) {
                const item = monthlyData.get(key);
                item.sales += Number(o.total_amount || 0);
                item.orders += 1;
            }
        });

        const sortedChartData = Array.from(monthlyData.values()).sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
        });

        setChartData(sortedChartData);
        setStats({
          totalSales,
          newOrders,
          activeCustomers: customersCount,
          totalProducts: products.length
        });
      }
    };

    fetchStats();
  }, [products]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p: any) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const total = products.length || 1;
    return Object.entries(counts).map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      color: COLORS[index % COLORS.length]
    }));
  }, [products]);
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="إجمالي المبيعات" value={`${formatPrice(stats.totalSales)} د.ع`} change="+١٢.٥٪" icon={Wallet} trend="up" />
        <StatCard title="الطلبات قيد الانتظار" value={stats.newOrders.toString()} change="+٣ طلبات" icon={ShoppingCart} trend="up" />
        <StatCard title="إجمالي العملاء" value={stats.activeCustomers.toString()} change="+١٠٠٪" icon={Users} trend="up" />
        <StatCard title="إجمالي المنتجات" value={stats.totalProducts.toString()} change="نشط" icon={Package} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card p-4 md:p-8 rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-center sm:text-right">
            <div>
              <h3 className="text-xl font-bold">تحليل المبيعات</h3>
              <p className="text-sm text-muted-foreground">أداء المبيعات للأشهر السبعة الماضية</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-xs w-fit">
              سنوي ٢٠٢٦
            </div>
          </div>
          <div className="h-64 md:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a85c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c9a85c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
                  dx={-10}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#fff',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#c9a85c" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-border/50 shadow-sm overflow-hidden">
          <h3 className="text-xl font-bold mb-8 text-center sm:text-right">توزيع الفئات</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 mt-4">
            {categoryStats.map((cat: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs md:text-sm font-medium">{cat.name}</span>
                </div>
                <span className="text-xs md:text-sm font-bold">{cat.value}٪</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, trend }: any) {
  return (
    <div className="bg-gradient-to-br from-card to-muted/20 p-5 md:p-6 rounded-[2rem] border border-border/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-border/50 group-hover:border-primary/30 transition-all duration-500 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] md:text-xs font-black px-2.5 py-1.5 rounded-xl ${
          trend === "up" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
        }`}>
          <TrendingUp className="w-3.5 h-3.5" />
          {change}
        </div>
      </div>
      <div className="text-right relative z-10">
        <p className="text-xs md:text-sm text-muted-foreground font-bold mb-1 opacity-80">{title}</p>
        <p className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
}
