import { Star } from "lucide-react";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Card, CardContent } from "./ui/card";

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-4 right-4 z-10">
              <div className="bg-background/90 backdrop-blur-md text-foreground border border-border/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
                {category}
              </div>
            </div>
          </div>
        </Link>
        <CardContent className="p-5">
          <div className="space-y-3">
            <Link to={`/products/${id}`}>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                  {nameEn}
                </p>
              </div>
            </Link>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating
                      ? "fill-[#c9a85c] text-[#c9a85c]"
                      : "text-muted/50"
                      }`}
                  />
                ))}
                <span className="text-[10px] text-muted-foreground mr-1.5 font-bold">
                  {rating}.0
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-lg bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                  {price}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/60">
                  د.ع
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

