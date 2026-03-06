import { Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contactInfo } from "@/lib/data/contact";
import { submitContactForm } from "@/lib/services/contact";
import {
  validateContactForm,
  hasValidationErrors,
  type ContactFormErrors,
} from "@/lib/validators/contact";
import type { ContactFormData } from "@/types/contact";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);
    const formErrors = validateContactForm(formData);
    if (hasValidationErrors(formErrors)) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const result = await submitContactForm(formData);
    setIsSubmitting(false);
    setSubmitMessage(result.message);
    if (result.success) setFormData(initialFormData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
    <div className="min-h-screen py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-20 space-y-4"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary tracking-wide">تواصل معنا</span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            نحن هنا
            <span className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent"> لأجلك</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            نحن هنا للإجابة على استفساراتك ومساعدتك في العثور على أفضل المنتجات العالمية. لا تتردد في التواصل معنا.
          </motion.p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          {contactInfo.map((info) => (
            <motion.div key={info.title} variants={itemVariants}>
              <Card
                className="border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-500 -z-10" />
                <CardContent className="p-8 text-center relative z-10">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 mx-auto mb-6 group-hover:scale-110 transition-transform group-hover:shadow-xl group-hover:shadow-primary/20">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{info.title}</h3>
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-sm font-medium text-foreground"
                        dir={info.icon === Phone ? "ltr" : "rtl"}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {info.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form & Map */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-border/50 rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl">
              <CardContent className="p-10 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">أرسل لنا رسالة</h2>
                </div>

                <form noValidate onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {submitMessage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-2xl text-sm font-bold border ${submitMessage.includes("خطأ")
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-primary/10 text-primary border-primary/20"
                          }`}
                      >
                        {submitMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">الاسم الكامل</Label>
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="أدخل اسمك الكامل"
                        className={`h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all ${errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      {errors.name && (
                        <p className="text-xs font-bold text-destructive mr-2 mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        dir="ltr"
                        className={`h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-xs font-bold text-destructive mr-2 mt-1 text-right">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">رقم الهاتف</Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+964 780 ..."
                        dir="ltr"
                        className={`h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all ${errors.phone ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">الموضوع</Label>
                      <Input
                        id="subject"
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="بماذا يمكننا مساعدتك؟"
                        className={`h-14 rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all ${errors.subject ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                      />
                      {errors.subject && (
                        <p className="text-xs font-bold text-destructive mr-2 mt-1">{errors.subject}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">الرسالة</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="اكتب رسالتك بالتفصيل هنا..."
                      className={`rounded-2xl border-border/50 bg-background/50 focus:ring-primary/20 transition-all resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                    />
                    {errors.message && (
                      <p className="text-xs font-bold text-destructive mr-2 mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white py-8 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 group"
                  >
                    <Send className={`w-5 h-5 ml-2 transition-transform ${isSubmitting ? "animate-pulse" : "group-hover:translate-x-1"}`} />
                    {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map & Meta Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-10"
          >
            <Card className="border-border/50 overflow-hidden rounded-[2.5rem] shadow-xl flex-1 group">
              <div className="h-full min-h-[400px] bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 relative group-hover:scale-105 transition-transform duration-1000">
                <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto shadow-inner">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-black tracking-tight">تفضل بزيارتنا</p>
                      <p className="text-lg text-muted-foreground font-medium">
                        بغداد، حي المنصور، العراق
                      </p>
                    </div>
                    <Button variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
                      افتح بخرائط جوجل
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 rounded-[2.5rem] p-10 shadow-lg">
              <CardContent className="p-0 space-y-8">
                <div className="space-y-4 text-right">
                  <h3 className="text-2xl font-black">ساعات العمل</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg italic">
                    فريقنا متواجد دائماً لخدمتكم وضمان حصولكم على أفضل تجربة تسوق ممكنة.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-white/20">
                    <span className="font-bold">السبت - الخميس</span>
                    <span className="text-primary font-black">9:00 ص - 9:00 م</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-background/20 border border-white/10 opacity-60">
                    <span className="font-bold">الجمعة</span>
                    <span className="text-muted-foreground font-black">إجازة أسبوعية</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all">
                    <Phone className="w-5 h-5 ml-2 text-primary" />
                    <span dir="ltr">+964 780 123 4567</span>
                  </Button>
                  <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all">
                    <Mail className="w-5 h-5 ml-2 text-primary" />
                    info@shakastore.iq
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

