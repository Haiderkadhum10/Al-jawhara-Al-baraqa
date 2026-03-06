import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Sparkles, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

export function ProductDetail() {
    const { id } = useParams();
    const { products } = useProducts();
    const { addToCart } = useCart();
    const product = products.find((p) => p.id === id);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
                    <Link to="/products">
                        <Button>العودة للمنتجات</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const features = [
        { icon: ShieldCheck, text: "جودة مضمونة 100%" },
        { icon: Truck, text: "توصيل سريع وموثوق" },
        { icon: RefreshCcw, text: "سياسة استرجاع مرنة" },
    ];

    return (
        <div className="min-h-screen py-10 md:py-20 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 md:mb-12"
                >
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm md:text-base">العودة للمنتجات</span>
                    </Link>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 blur-2xl rounded-[3rem] -z-10" />
                        <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl max-w-lg mx-auto lg:mx-0">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                <Badge className="bg-white/90 backdrop-blur-md text-primary border-none px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold shadow-lg text-[10px] md:text-xs">
                                    {product.category}
                                </Badge>
                            </div>
                        </div>
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 md:space-y-10 text-right"
                    >
                        <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit ml-auto">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">منتج متميز</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">{product.name}</h1>
                            <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-widest">{product.nameEn}</p>

                            <div className="flex items-center justify-end gap-3 md:gap-4 py-2">
                                <span className="text-[10px] md:text-sm font-bold text-muted-foreground order-last lg:order-first">(4.9/5) بناءً على 120 تقييم</span>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 md:w-5 md:h-5 ${i < product.rating ? "fill-[#c9a85c] text-[#c9a85c]" : "text-muted/30"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-baseline justify-end gap-2">
                                <span className="text-lg md:text-xl font-bold text-muted-foreground/60">دينار عراقي</span>
                                <span className="text-4xl md:text-5xl font-black bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                                    {product.price}
                                </span>
                            </div>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl ml-auto">
                                {product.description || "هذا المنتج مختار بعناية من أجود المصادر العالمية لضمان أفضل تجربة مذاق لعملائنا."}
                            </p>
                        </div>

                        <div className="space-y-6 md:space-y-8 pt-6 md:pt-8 border-t border-border/50">
                            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                                <div className="flex items-center bg-muted/50 rounded-2xl p-1 border border-border/50 w-full sm:w-auto justify-between sm:justify-start">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 md:h-12 md:w-12 rounded-xl"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-bold text-lg md:text-xl">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 md:h-12 md:w-12 rounded-xl"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    className={`flex-1 w-full py-7 md:py-8 text-base md:text-lg font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] ${isAdded
                                        ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200"
                                        : "bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white shadow-primary/20"
                                        }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {isAdded ? (
                                            <motion.div
                                                key="added"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center"
                                            >
                                                <CheckCircle2 className="w-5 h-5 ml-3" />
                                                تمت الإضافة للسلة
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="add"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center"
                                            >
                                                <ShoppingCart className="w-5 h-5 ml-3" />
                                                أضف إلى السلة
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-2">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                        <feature.icon className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-[10px] md:text-xs font-bold leading-tight">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
