import { Star, ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Card, CardContent } from "./ui/card";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export interface ProductCardProps extends Product { }

export function ProductCard({
  id,
  name,
  nameEn,
  price,
  image,
  rating,
  category,
  stock,
}: ProductCardProps) {
  const { addToCart, items } = useCart();
  const [isJustAdded, setIsJustAdded] = useState(false);

  const cartItem = items.find(i => i.id === id);
  const isInCart = !!cartItem;
  const isOutOfStock = stock === 0;
  const isMaxStockReached = stock !== undefined && (cartItem?.quantity || 0) >= stock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isMaxStockReached) return;

    addToCart({ id, name, nameEn, price, image, rating, category, stock }, 1);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 2000);

    toast("تمت الإضافة للسلة!", {
      description: `${name} في سلتك الآن`,
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 rounded-[1.2rem] md:rounded-[1.5rem] bg-card/40 backdrop-blur-md">
        <Link to={`/products/${id}`}>
          <div className="relative overflow-hidden aspect-square">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
              {isOutOfStock && (
                <div className="bg-destructive/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm">
                  نفد
                </div>
              )}
              <div className="bg-white/90 backdrop-blur-md text-foreground px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase shadow-sm w-fit border border-border/10">
                {category}
              </div>
            </div>
          </div>
        </Link>
        <CardContent className="p-2.5 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <Link to={`/products/${id}`}>
              <div className="space-y-0.5">
                <h3 className="font-black text-xs sm:text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="hidden sm:block text-[10px] text-muted-foreground font-bold tracking-wider uppercase opacity-60">
                  {nameEn}
                </p>
              </div>
            </Link>

            <div className="flex items-center justify-between pt-0.5 sm:pt-1">
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-2 h-2 sm:w-3 sm:h-3 ${i < rating
                        ? "fill-[#c9a85c] text-[#c9a85c]"
                        : "text-muted/20"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground font-black">
                  {rating}.0
                </span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-white text-sm sm:text-lg text-primary">
                  {price}
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-muted-foreground/40">
                  د.ع
                </span>
              </div>
            </div>

            <motion.button
              disabled={isOutOfStock || isMaxStockReached}
              onClick={handleAddToCart}
              whileTap={!(isOutOfStock || isMaxStockReached) ? { scale: 0.97 } : {}}
              className={`w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs text-white bg-gradient-to-l transition-all duration-500 shadow-lg group/btn disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:shadow-none disabled:cursor-not-allowed ${
                isJustAdded 
                  ? "from-emerald-500 to-emerald-600 shadow-emerald-500/20" 
                  : "from-[#c9a85c] to-[#9d7e3a] shadow-[#c9a85c]/20"
              }`}
            >
              {isJustAdded ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:scale-110" />
              )}
              <span>
                {isOutOfStock 
                  ? 'نفد' 
                  : isMaxStockReached 
                    ? 'الحد' 
                    : isJustAdded 
                      ? 'تمت' 
                      : 'أضف'}
              </span>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


