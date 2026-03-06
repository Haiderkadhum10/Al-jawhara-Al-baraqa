import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Package,
  History,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
} from "../components/ui/sheet";
import { DashboardOverview } from "../components/dashboard/DashboardOverview";
import { DashboardProducts } from "../components/dashboard/DashboardProducts";
import { DashboardOrders } from "../components/dashboard/DashboardOrders";
import { DashboardCustomers } from "../components/dashboard/DashboardCustomers";
import { DashboardSettings } from "../components/dashboard/DashboardSettings";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "products", label: "إدارة المنتجات", icon: Package },
  { id: "orders", label: "الطلبات", icon: History },
  { id: "customers", label: "العملاء", icon: Users },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export function Dashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = ({ isMobile = false }) => (
    <div className={`h-full flex flex-col ${isMobile ? "bg-card" : ""}`}>
      <div className="p-6 flex items-center gap-4 border-b border-border/50 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary/20">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <AnimatePresence>
          {(isSidebarOpen || isMobile) && (
            <motion.div
              initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="whitespace-nowrap text-right"
            >
              <h1 className="font-black text-lg">لوحة الإدارة</h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Shaka Store Admin</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              if (isMobile) setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${activeTab === item.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            {(isSidebarOpen || isMobile) && <span className="font-bold">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-4 p-3 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          {(isSidebarOpen || isMobile) && <span className="font-bold">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex ${isSidebarOpen ? "w-72" : "w-20"} transition-all duration-300 bg-card border-e border-border/50 sticky top-0 h-screen flex-col z-40`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="p-0 w-72 border-l border-border/50">
          <SidebarContent isMobile />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-card/50 backdrop-blur-md sticky top-0 z-30 border-b border-border/50 h-20 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsMobileMenuOpen(true);
                } else {
                  setIsSidebarOpen(!isSidebarOpen);
                }
              }}
              className="rounded-xl"
            >
              {isSidebarOpen ? <X className="hidden lg:block" /> : <Menu className="hidden lg:block" />}
              <Menu className="lg:hidden" />
            </Button>
            <h2 className="text-lg md:text-xl font-bold truncate max-w-[150px] md:max-w-none">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {activeTab !== "products" && (
              <div className="relative hidden md:block w-48 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full bg-muted/50 border-border/50 rounded-xl py-2 pr-4 pl-10 focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium text-sm"
                />
              </div>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary flex-shrink-0 text-sm">
              AD
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && <DashboardOverview />}
              {activeTab === "products" && <DashboardProducts />}
              {activeTab === "orders" && <DashboardOrders />}
              {activeTab === "customers" && <DashboardCustomers />}
              {activeTab === "settings" && <DashboardSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
