import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useProducts } from "../context/ProductContext";
import { parsePrice } from "@/lib/utils";

export function Products() {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("latest"); // Added sortBy state

  const categories = useMemo(
    () => ["الكل", "عصائر", "نودلز", "كوري", "أوروبي", "وجبات سريعة"],
    []
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "الكل" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.nameEn || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === "price-asc") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "price-desc") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(); // Default to latest
    });
  }, [selectedCategory, searchQuery, products, sortBy]); // Added sortBy to dependencies

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-8 text-center lg:text-right">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs md:text-sm font-bold text-primary tracking-wide">متجرنا الفاخر</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight">
              اكتشف
              <span className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent"> منتجاتنا</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">
              تصفح مجموعتنا الواسعة من المنتجات العالمية المختارة بعناية لتناسب ذوقك الرفيع.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
          >
            <div className="relative group flex-1 sm:w-80 lg:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 h-14 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm focus:ring-primary/20 transition-all text-sm md:text-base"
              />
            </div>
          </motion.div>
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 md:mb-12 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-border/50 text-muted-foreground ml-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">الفئات</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-6 md:px-8 py-2.5 md:py-3 rounded-2xl text-sm md:text-base font-bold transition-all duration-300 border ${selectedCategory === category
                ? "bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white border-transparent shadow-lg shadow-primary/20 scale-105"
                : "bg-card/50 text-muted-foreground border-border/50 hover:border-primary/30 hover:bg-primary/5"
                } `}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 md:py-32">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-bold">جاري تحميل المنتجات...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              <motion.div
                layout
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 md:py-32 bg-muted/30 rounded-[2rem] md:rounded-[3rem] border border-dashed border-border/50 px-4"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl md:text-2xl font-black mb-2">لم نجد أي منتجات</h3>
                <p className="text-sm md:text-base text-muted-foreground">جرب البحث بكلمات أخرى أو تغيير الفئة المختارة.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedCategory("الكل");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-primary font-bold"
                >
                  إعادة ضبط المرشحات
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
