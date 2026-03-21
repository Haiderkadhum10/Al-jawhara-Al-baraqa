import { Link, useLocation, useNavigate } from "react-router";
import { Sparkles, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { toast } from "sonner";
import { CheckoutDialog } from "./CheckoutDialog";
import { MobileMenuSheet } from "./header/MobileMenuSheet";
import { CartSheet } from "./header/CartSheet";
import { HeaderSearchDialog } from "./header/HeaderSearchDialog";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { products, updateStock } = useProducts();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
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
               <span className="hidden sm:block text-[10px] uppercase tracking-widest text-muted-foreground/80 font-medium">
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
                      key={link.path} // Using link.path as key, assuming it's unique for nav items
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute inset-0 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="بحث"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                aria-label="حسابي"
                onClick={() => navigate("/login")}
              >
                <User className="h-5 w-5" />
              </Button>
            </div>

            <CartSheet
              items={items}
              totalItems={totalItems}
              totalPrice={totalPrice}
              products={products}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              onCheckout={() => setIsCheckoutOpen(true)}
            />
            <MobileMenuSheet open={isOpen} onOpenChange={setIsOpen} navLinks={navLinks} isActive={isActive} />
          </div>
        </div>
      </div>

      <HeaderSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        products={products}
        navLinks={navLinks}
      />

      <CheckoutDialog
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        items={items}
        totalPrice={totalPrice}
        onSuccess={() => {
          updateStock(items);
          clearCart();
          toast("تم استلام طلبك! 🎉", {
            description: "سنتواصل معك قريباً لتأكيد التوصيل 🚚",
            className: "bg-gradient-to-l from-emerald-500 to-teal-400 text-white border-transparent shadow-xl shadow-emerald-500/30",
          });
        }}
      />
    </header>
  );
}

