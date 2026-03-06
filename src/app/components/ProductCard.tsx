import { Star, ShoppingCart } from "lucide-react";
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
}: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, nameEn, price, image, rating, category }, 1);
    toast.success(`${name} تمت إضافته للسلة بنجاح`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 rounded-2xl bg-card/50 backdrop-blur-sm">
        <Link to={`/products/${id}`}>
          <div className="relative overflow-hidden aspect-[4/5]">
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-4 right-4 z-10">
              <div className="bg-background/90 backdrop-blur-md text-foreground border border-border/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm">
                {category}
              </div>
            </div>
          </div>
        </Link>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Link to={`/products/${id}`}>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase opacity-70">
                  {nameEn}
                </p>
              </div>
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rating
                        ? "fill-[#c9a85c] text-[#c9a85c]"
                        : "text-muted/30"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground mr-1 font-bold">
                  {rating}.0
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-xl bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                  {price}
                </span>
                <span className="text-xs font-bold text-muted-foreground/60">
                  د.ع
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#d4b97a] hover:to-[#b08e48] transition-all duration-300 shadow-lg shadow-[#c9a85c]/20 group/btn"
            >
              <ShoppingCart className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
              <span>أضف إلى السلة</span>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


