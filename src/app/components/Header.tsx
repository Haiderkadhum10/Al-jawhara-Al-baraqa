import { Link, useLocation } from "react-router";
import { Menu, ShoppingCart, Sparkles, Search, User, Trash2, Plus, Minus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useCart } from "../context/CartContext";
import { formatPrice } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "الرئيسية" },
    { path: "/products", label: "المنتجات" },
    { path: "/about", label: "من نحن" },
    { path: "/contact", label: "تواصل معنا" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
        ? "border-b bg-background/80 backdrop-blur-md py-2"
        : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] shadow-lg shadow-primary/20"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent tracking-tight">
                الجوهرة البراقة
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/80 font-medium">
                للـمـنـتـجـات الـغـذائـيـة
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-full border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all ${isActive(link.path)
                  ? "text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground hover:bg-background/50"
                  }`}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="بحث"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="حسابي"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu - يجب أن يكون أول زر في الهيدر على الشاشات الصغيرة ليتوافق مع الاختبارات */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10"
                  aria-label="القائمة"
                >
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0 overflow-hidden">
                <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/30">
                  <SheetHeader className="p-6 border-b border-border/50">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="font-bold">الجوهرة البراقة</span>
                        <span className="text-[10px] text-muted-foreground">القائمة الرئيسية</span>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-1 p-4 mt-4">
                    {navLinks.map((link, idx) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${isActive(link.path)
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-foreground/80 hover:bg-background hover:shadow-sm"
                            }`}
                        >
                          <span className="font-medium">{link.label}</span>
                          {isActive(link.path) && <Sparkles className="w-4 h-4 opacity-50" />}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  <div className="mt-auto p-6 border-t border-border/50 bg-background/50">
                    <Button className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white py-6 rounded-2xl">
                      تسجيل الدخول
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Cart Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all group"
                  aria-label="سلة التسوق"
                >
                  <ShoppingCart className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white font-bold ring-2 ring-background"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md md:max-w-lg p-0 overflow-hidden">
                <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/30">
                  <SheetHeader className="p-8 border-b border-border/50">
                    <SheetTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] flex items-center justify-center shadow-lg shadow-primary/20">
                          <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-xl font-black">سلة التسوق</span>
                          <span className="text-xs text-muted-foreground font-medium">لديك {totalItems} منتجات في السلة</span>
                        </div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
                    {items.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold">سلتك فارغة</h3>
                          <p className="text-muted-foreground">ابدأ بإضافة بعض المنتجات الرائعة إلى سلتك!</p>
                        </div>
                        <Button
                          className="bg-primary text-white px-8 py-6 rounded-2xl font-bold"
                          asChild
                        >
                          <Link to="/products">تصفح المنتجات</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex gap-4 p-4 rounded-[1.5rem] bg-background border border-border/50 shadow-sm"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                              <p className="text-[10px] text-muted-foreground uppercase font-medium">{item.category}</p>
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-md"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-md"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                                <span className="text-sm font-black text-primary">{item.price} د.ع</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-8 border-t border-border/50 bg-background/50 space-y-6">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>الإجمالي</span>
                      <span className="text-2xl text-primary">{formatPrice(totalPrice)} د.ع</span>
                    </div>
                    <Button disabled={items.length === 0} className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white py-8 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                      إتمام الطلب
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">
                      شحن مجاني للطلبات فوق ٥٠,٠٠٠ د.ع
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

