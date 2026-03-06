import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Sparkles, ArrowUp } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import { Button } from "./ui/button";

const quickLinks = [
  { label: "الرئيسية", path: "/" },
  { label: "منتجاتنا", path: "/products" },
  { label: "من نحن", path: "/about" },
  { label: "تواصل معنا", path: "/contact" },
];

const socialLinks = [
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-muted/30 border-t border-border/50 pt-16 md:pt-24 pb-8 md:pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(201,168,92,0.05),transparent_50%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 md:mb-20">
          <div className="space-y-6 md:space-y-8 text-center sm:text-right">
            <Link to="/" className="flex items-center justify-center sm:justify-start gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              وجهتكم الأولى في العراق لأرقى المنتجات الغذائية العالمية المستوردة. نحرص على جلب الجودة والنكهات الأصيلة من قلب أوروبا وآسيا إلى مائدتكم.
            </p>
            <div className="flex justify-center sm:justify-start gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center sm:text-right">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center justify-center sm:justify-start gap-3">
              <span className="w-8 h-1 bg-primary rounded-full hidden sm:block" />
              روابط سريعة
            </h3>
            <ul className="space-y-3 md:space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center sm:justify-start gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-right">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center justify-center sm:justify-start gap-3">
              <span className="w-8 h-1 bg-primary rounded-full hidden sm:block" />
              معلومات التواصل
            </h3>
            <ul className="space-y-4 md:space-y-6">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm md:text-base">بغداد، حي المنصور، العراق</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span dir="ltr" className="text-sm md:text-base">+964 780 123 4567</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-3 md:gap-4 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm md:text-base">info@shakastore.iq</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6 md:space-y-8 text-center sm:text-right">
            <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center justify-center sm:justify-start gap-3">
              <span className="w-8 h-1 bg-primary rounded-full hidden sm:block" />
              النشرة البريدية
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              اشترك للحصول على آخر العروض والمنتجات الجديدة.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="w-full h-11 md:h-12 px-4 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right text-sm md:text-base"
              />
              <Button className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white rounded-xl shadow-lg shadow-primary/20 h-11 md:h-12">
                اشتراك
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-12 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <p className="text-xs md:text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} {APP_NAME}. جميع الحقوق محفوظة.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-xs md:text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            العودة للأعلى
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border/50 flex items-center justify-center group-hover:border-primary/30 group-hover:shadow-lg transition-all">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}

