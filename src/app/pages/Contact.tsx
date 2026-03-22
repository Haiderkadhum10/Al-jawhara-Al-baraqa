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
    <div className="min-h-screen py-10 md:py-20 overflow-hidden">
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
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight"
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
                <CardContent className="p-6 lg:p-8 text-center relative z-10">
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

        {/* Map & Meta Info */}
        <div className="max-w-4xl mx-auto mt-20">
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
                        شركة الجوهرة البراقة
                      </p>
                    </div>
                    <Button asChild variant="outline" className="rounded-full px-8 border-primary/20 hover:bg-primary/5">
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=9CCJ%2B7WX+Baghdad"
                        target="_blank"
                        rel="noreferrer"
                      >
                        افتح بخرائط جوجل
                      </a>
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
                    <span className="text-primary font-black">7:00 ص - 3:00 م</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-background/20 border border-white/10 opacity-60">
                    <span className="font-bold">الجمعة</span>
                    <span className="text-muted-foreground font-black">إجازة أسبوعية</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all">
                    <Phone className="w-5 h-5 ml-2 text-primary" />
                    <span dir="ltr">07882000260 - 07882000250</span>
                  </Button>
                  <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold text-xs sm:text-sm bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all">
                    <Mail className="w-5 h-5 ml-2 text-primary" />
                    aljawharaalbaraqa41@gmail.com
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

