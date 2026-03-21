import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import type { CartItem } from "../../context/CartContext";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";

interface CartSheetProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  products: Product[];
  updateQuantity: (productId: string, quantity: number, maxStock?: number) => void;
  removeFromCart: (productId: string) => void;
  onCheckout: () => void;
}

export function CartSheet({
  items,
  totalItems,
  totalPrice,
  products,
  updateQuantity,
  removeFromCart,
  onCheckout,
}: CartSheetProps) {
  return (
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
                <Button className="bg-primary text-white px-8 py-6 rounded-2xl font-bold" asChild>
                  <Link to="/products">تصفح المنتجات</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => {
                  const liveProduct = products.find((p) => p.id === item.id);
                  const currentStock = liveProduct?.stock ?? item.stock ?? Infinity;

                  return (
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
                              onClick={() => updateQuantity(item.id, item.quantity - 1, currentStock)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-md"
                              disabled={item.quantity >= currentStock}
                              onClick={() => updateQuantity(item.id, item.quantity + 1, currentStock)}
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
                        onClick={() => {
                          removeFromCart(item.id);
                          toast("حذف من السلة", {
                            description: `تم إزالة ${item.name} بنجاح`,
                            icon: <Trash2 className="w-5 h-5 text-destructive" />,
                            className:
                              "border-r-4 border-r-destructive border-y-border/50 border-l-border/50 bg-background/95 backdrop-blur-md shadow-xl",
                          });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-8 border-t border-border/50 bg-background/50 space-y-6">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>الإجمالي</span>
              <span className="text-2xl text-primary">{formatPrice(totalPrice)} د.ع</span>
            </div>
            <Button
              disabled={items.length === 0}
              onClick={onCheckout}
              className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white py-8 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
            >
              إتمام الطلب
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-medium uppercase tracking-widest">
              شحن مجاني للطلبات فوق ٥٠,٠٠٠ د.ع
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
