import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    User,
    Phone,
    MapPin,
    MessageSquare,
    CreditCard,
    Banknote,
    CheckCircle2,
    ShoppingBag,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { parsePrice, formatPrice } from "@/lib/utils";
import type { CartItem } from "../context/CartContext";
import { submitCheckoutOrder } from "@/lib/services/checkoutService";
import { fetchStoreSettings } from "@/lib/services/storeSettingsService";
import { logger } from "@/lib/logger";

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: CartItem[];
    totalPrice: number;
    onSuccess: () => void;
}

type PaymentMethod = "cash" | "wallet";

const CITIES = [
    "بغداد", "البصرة", "الموصل", "أربيل", "كركوك", "النجف", "كربلاء",
    "الحلة", "ديالى", "الرمادي", "تكريت", "الناصرية", "العمارة", "الكوت",
    "السليمانية", "دهوك", "سامراء", "بعقوبة", "الفلوجة", "الكوفة"
];

export function CheckoutDialog({ open, onOpenChange, items, totalPrice, onSuccess }: CheckoutDialogProps) {
    const [step, setStep] = useState<"form" | "success">("form");
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [customCity, setCustomCity] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
    const [notes, setNotes] = useState("");
    const [shippingCost, setShippingCost] = useState(5000);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await fetchStoreSettings();
            setShippingCost(settings.deliveryPrice);
        };
        void loadSettings();
    }, []);

    const finalCity = city === "other" ? customCity : city;

    const finalTotal = totalPrice + shippingCost;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) {
            newErrors.fullName = "الاسم حقل مطلوب.";
        } else if (fullName.trim().split(/\s+/).length < 2) {
            newErrors.fullName = "يرجى كتابة الاسم الثنائي على الأقل.";
        }

        const phoneRegex = /^07\d{9}$/;
        const cleanPhone = phone.trim().replace(/[\s-]/g, '');
        if (!phone.trim()) {
            newErrors.phone = "رقم الهاتف حقل مطلوب.";
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.phone = "رقم الهاتف غير صحيح. تأكد أنه يتكون من 11 رقم ويبدأ بـ 07.";
        }

        if (!finalCity.trim()) {
            newErrors.city = "المحافظة حقل مطلوب.";
        }

        if (!address.trim()) {
            newErrors.address = "العنوان حقل مطلوب.";
        } else if (address.trim().length < 10) {
            newErrors.address = "يرجى كتابة عنوان تفصيلي واضح (10 أحرف على الأقل).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setGeneralError("");
        setLoading(true);

        const cleanPhone = phone.trim().replace(/[\s-]/g, '');

        try {
            await submitCheckoutOrder({
                fullName,
                phone: cleanPhone,
                address,
                city: finalCity,
                paymentMethod,
                notes,
                items,
            });

            setStep("success");
            setTimeout(() => {
                onSuccess();
                onOpenChange(false);
                setStep("form");
                resetForm();
            }, 2500);

        } catch (err: any) {
            logger.error("Checkout error", err, { feature: "checkout", action: "submit" });
            const msg = err?.message ?? err?.error_description ?? JSON.stringify(err);
            if (typeof msg === 'string' && msg.startsWith("NAME_MISMATCH")) {
                setGeneralError(`رقم الهاتف هذا مسجل مسبقاً لدينا. يرجى كتابة الاسم المطابق له بدقة، أو استخدام رقم هاتف آخر.`);
            } else {
                setGeneralError(`خطأ: ${msg}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFullName(""); setPhone(""); setCity(""); setCustomCity("");
        setAddress(""); setPaymentMethod("cash"); setNotes(""); setGeneralError(""); setErrors({});
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!loading) { onOpenChange(v); } }}>
            <DialogContent className="sm:max-w-[560px] rounded-[2rem] p-0 overflow-hidden max-h-[92vh] flex flex-col">
                <AnimatePresence mode="wait">
                    {step === "success" ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-6 p-8 md:p-16 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black">تم استلام طلبك! 🎉</h2>
                                <p className="text-muted-foreground">سنتواصل معك على رقم الهاتف لتأكيد الطلب وترتيب التوصيل.</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="p-4 sm:p-6 pb-0">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black text-right flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-primary" />
                                        تفاصيل الطلب والتوصيل
                                    </DialogTitle>
                                    <p className="text-sm text-muted-foreground text-right">أدخل بياناتك لنتمكن من إيصال طلبك</p>
                                </DialogHeader>
                            </div>

                            {/* Scrollable form */}
                            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4">
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                                    {/* Full name */}
                                    <div className="space-y-1.5 text-right">
                                        <Label className={`font-bold text-sm flex items-center gap-1.5 flex-row-reverse ${errors.fullName ? "text-destructive" : ""}`}>
                                            <span>الاسم الكامل</span>
                                            <User className={`w-4 h-4 ${errors.fullName ? "text-destructive" : "text-primary"}`} />
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            required
                                            placeholder="مثال: أحمد محمد علي"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                if (errors.fullName) setErrors({ ...errors, fullName: "" });
                                            }}
                                            className={`rounded-xl h-12 sm:h-14 px-4 bg-muted/50 text-right ${errors.fullName ? "border-destructive focus-visible:ring-destructive/20" : "border-border/50"}`}
                                            dir="rtl"
                                        />
                                        {errors.fullName && <p className="text-xs text-destructive font-bold pr-1">{errors.fullName}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-1.5 text-right">
                                        <Label className={`font-bold text-sm flex items-center gap-1.5 flex-row-reverse ${errors.phone ? "text-destructive" : ""}`}>
                                            <span>رقم الهاتف</span>
                                            <Phone className={`w-4 h-4 ${errors.phone ? "text-destructive" : "text-primary"}`} />
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            required
                                            type="tel"
                                            placeholder="07XXXXXXXXX"
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (errors.phone) setErrors({ ...errors, phone: "" });
                                            }}
                                            className={`rounded-xl h-12 sm:h-14 px-4 bg-muted/50 text-right ${errors.phone ? "border-destructive focus-visible:ring-destructive/20" : "border-border/50"}`}
                                            dir="rtl"
                                        />
                                        {errors.phone && <p className="text-xs text-destructive font-bold pr-1">{errors.phone}</p>}
                                    </div>

                                    {/* City */}
                                    <div className="space-y-1.5 text-right">
                                        <Label className={`font-bold text-sm flex items-center gap-1.5 flex-row-reverse ${errors.city ? "text-destructive" : ""}`}>
                                            <span>المحافظة / المدينة</span>
                                            <MapPin className={`w-4 h-4 ${errors.city ? "text-destructive" : "text-primary"}`} />
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="flex flex-wrap gap-2 text-right justify-end" dir="rtl">
                                            {CITIES.slice(0, 10).map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => {
                                                        setCity(c);
                                                        if (errors.city) setErrors({ ...errors, city: "" });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c
                                                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                                        : errors.city ? "bg-destructive/5 border-destructive text-destructive" : "bg-muted/50 border-border/50 hover:border-primary/40"
                                                        }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setCity("other");
                                                    if (errors.city) setErrors({ ...errors, city: "" });
                                                }}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === "other"
                                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                                    : errors.city ? "bg-destructive/5 border-destructive text-destructive" : "bg-muted/50 border-border/50 hover:border-primary/40"
                                                    }`}
                                            >
                                                أخرى...
                                            </button>
                                        </div>
                                        {city === "other" && (
                                            <div className="mt-2 text-right">
                                                <Input
                                                    required
                                                    placeholder="اكتب اسم المدينة"
                                                    value={customCity}
                                                    onChange={(e) => {
                                                        setCustomCity(e.target.value);
                                                        if (errors.city) setErrors({ ...errors, city: "" });
                                                    }}
                                                    className={`rounded-xl h-12 sm:h-14 px-4 bg-muted/50 text-right ${errors.city ? "border-destructive focus-visible:ring-destructive/20" : "border-border/50"}`}
                                                    dir="rtl"
                                                />
                                            </div>
                                        )}
                                        {errors.city && <p className="text-xs text-destructive font-bold pr-1">{errors.city}</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1.5 text-right">
                                        <Label className={`font-bold text-sm flex items-center gap-1.5 flex-row-reverse ${errors.address ? "text-destructive" : ""}`}>
                                            <span>العنوان التفصيلي</span>
                                            <MapPin className={`w-4 h-4 ${errors.address ? "text-destructive" : "text-primary"}`} />
                                            <span className="text-destructive">*</span>
                                        </Label>
                                        <textarea
                                            required
                                            rows={2}
                                            placeholder="مثال: جميلة، شارع 14، بجانب..."
                                            value={address}
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                                if (errors.address) setErrors({ ...errors, address: "" });
                                            }}
                                            className={`w-full rounded-xl p-3 sm:p-4 bg-muted/50 border resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-right text-sm ${errors.address ? "border-destructive focus:ring-destructive/20" : "border-border/50"}`}
                                            dir="rtl"
                                        />
                                        {errors.address && <p className="text-xs text-destructive font-bold pr-1">{errors.address}</p>}
                                    </div>

                                    {/* Payment Method */}
                                    <div className="space-y-2 text-right">
                                        <Label className="font-bold text-sm flex items-center gap-1.5 flex-row-reverse">
                                            <span>طريقة الدفع</span>
                                            <CreditCard className="w-4 h-4 text-primary" />
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod("cash")}
                                                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all ${paymentMethod === "cash"
                                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                                    : "border-border/50 bg-muted/30 hover:border-primary/30"
                                                    }`}
                                            >
                                                <Banknote className={`w-6 h-6 ${paymentMethod === "cash" ? "text-primary" : "text-muted-foreground"}`} />
                                                <span className={`text-xs font-bold ${paymentMethod === "cash" ? "text-primary" : "text-muted-foreground"}`}>
                                                    كاش عند الاستلام
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod("wallet")}
                                                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all ${paymentMethod === "wallet"
                                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                                    : "border-border/50 bg-muted/30 hover:border-primary/30"
                                                    }`}
                                            >
                                                <CreditCard className={`w-6 h-6 ${paymentMethod === "wallet" ? "text-primary" : "text-muted-foreground"}`} />
                                                <span className={`text-xs font-bold ${paymentMethod === "wallet" ? "text-primary" : "text-muted-foreground"}`}>
                                                    محفظة إلكترونية
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1.5 text-right">
                                        <Label className="font-bold text-sm flex items-center gap-1.5 flex-row-reverse">
                                            <span>ملاحظات إضافية (اختياري)</span>
                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                        </Label>
                                        <textarea
                                            rows={2}
                                            placeholder="أي تعليمات خاصة للتوصيل..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full rounded-xl p-3 sm:p-4 bg-muted/50 border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-right text-sm"
                                            dir="rtl"
                                        />
                                    </div>

                                    {generalError && (
                                        <p className="text-sm text-destructive font-bold text-right bg-destructive/10 px-4 py-3 rounded-xl border border-destructive/20">
                                            {generalError}
                                        </p>
                                    )}
                                </form>
                            </div>

                            {/* Sticky footer with breakdown */}
                            <div className="p-4 sm:p-6 border-t border-border/50 bg-background/80 backdrop-blur space-y-4">
                                <div className="space-y-3 px-2">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground font-bold">
                                        <span>المجموع (المواد)</span>
                                        <span>{formatPrice(totalPrice)} د.ع</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground font-bold">
                                        <span>كلفة التوصيل بغداد والمحافظات</span>
                                        <span>{formatPrice(shippingCost)} د.ع</span>
                                    </div>
                                    <div className="border-t border-dashed border-border/60 pt-3 flex items-center justify-between">
                                        <span className="text-xl font-black text-foreground">الإجمالي القياسي</span>
                                        <div className="text-left">
                                            <span className="text-2xl font-black text-primary">{formatPrice(finalTotal)} د.ع</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <Button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white py-4 sm:py-7 rounded-2xl text-base font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري إرسال الطلب...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" />
                                            تأكيد وإرسال الطلب
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
