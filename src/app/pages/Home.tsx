import { ArrowLeft, Sparkles, Play, ShieldCheck, Star, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import { homeFeatures } from "@/lib/data/features";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

export function Home() {
  const { products, loading } = useProducts();
  const featuredProducts = products.filter(p => p.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,92,0.15),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(157,126,58,0.1),transparent_50% desert)]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="space-y-6 md:space-y-8 text-center lg:text-right"
            >
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold text-primary tracking-wider uppercase">
                  منتجات غذائية فاخرة مستوردة
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-foreground"
              >
                نكهات العالم
                <span className="block mt-2 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                  بين يديك
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:ml-0 lg:mr-0"
              >
                اكتشف روعة المذاق مع مجموعتنا المختارة من أفضل المنتجات الأوروبية والآسيوية. من النودلز الكوري الأصلي إلى العصائر الطبيعية الفاخرة، نأتيك بالجودة العالمية حتى باب منزلك.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link to="/products" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary/20 group transition-all">
                    تصفح المنتجات
                    <ArrowLeft className="w-5 h-5 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 px-10 py-7 text-lg rounded-2xl backdrop-blur-sm">
                    من نحن
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-8 border-t border-border/50"
              >
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                    +2k
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-center lg:justify-start items-center gap-1 text-[#c9a85c]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-muted-foreground font-medium">عملاء يثقون بنا</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative lg:ml-10 order-first lg:order-last mb-12 lg:mb-0"
            >
              <div className="absolute -inset-10 bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] rounded-full opacity-10 blur-[100px] animate-pulse" />
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group max-w-lg mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1680342627018-1cfc75d0597a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmb29kJTIwcHJvZHVjdHN8ZW58MXx8fHwxNzcMTMxNjU3OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="منتجات فاخرة"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="absolute bottom-4 sm:bottom-8 left-4 right-4 sm:left-8 sm:right-8 p-4 sm:p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-lg shadow-black/20 flex-shrink-0">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base">شاهد منتجاتنا</p>
                      <p className="text-white/70 text-[10px] sm:text-xs">فيديو ترويجي قصير</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black"
            >
              لماذا تختار
              <span className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent"> {APP_NAME}</span>؟
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
            >
              نحن نلتزم بالتميز في كل تفاصيل تجربة التسوق الخاصة بك
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {homeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-500 -z-10" />
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 mb-6 group-hover:scale-110 transition-transform group-hover:shadow-lg group-hover:shadow-primary/20">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
            <div className="space-y-4 max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-black"
              >
                منتجاتنا
                <span className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent"> المميزة</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-base md:text-lg"
              >
                مجموعة حصرية من أرقى النكهات العالمية المختارة بعناية لأصحاب الذوق الرفيع.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Link to="/products">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-primary/20 hover:bg-primary/5 px-8 py-6 font-bold group"
                >
                  عرض جميع المنتجات
                  <ArrowLeft className="w-5 h-5 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-bold">جاري تحميل المنتجات...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a85c]/10 via-background to-[#9d7e3a]/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-card border border-border/50 shadow-2xl"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-16 space-y-6 md:space-y-8 flex flex-col justify-center text-center lg:text-right">
                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                  انضم إلى عالمنا
                  <br />
                  <span className="text-primary tracking-tight">واحصل على عروض حصرية</span>
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  كن أول من يعرف عن منتجاتنا الجديدة وخصوماتنا الحصرية التي تصل إلى 30% للمشتركين فقط.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="flex-1 px-6 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-right"
                  />
                  <Button className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white px-10 py-4 h-auto rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">
                    اشترك الآن
                  </Button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  بياناتك آمنة معنا بنسبة 100%
                </div>
              </div>
              <div className="relative hidden lg:block overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm9jZXJ5JTIwZGVsaXZlcnl8ZW58MXx8fHwxNzcMTMxNjU3OHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="التوصيل"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

