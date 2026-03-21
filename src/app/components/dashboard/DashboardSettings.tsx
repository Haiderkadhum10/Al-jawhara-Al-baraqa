import { useState, useEffect, useRef } from "react";
import { User, Bell, Shield, Palette, Globe, Save, Upload, ImageIcon, Trash2, Video } from "lucide-react";
import { Button } from "../ui/button";
import { fetchStoreSettings, updateDeliveryPrice } from "@/lib/services/storeSettingsService";
import { saveMediaBlob, loadMediaBlob, deleteMediaBlob } from "@/lib/mediaStorage";

export function DashboardSettings() {
    const [activeTab, setActiveTab] = useState("profile");
    const [deliveryPrice, setDeliveryPrice] = useState("5000");
    const [savedNotice, setSavedNotice] = useState(false);
    const [heroImage, setHeroImage] = useState<string | null>(null);
    const [heroImageName, setHeroImageName] = useState<string>("");
    const [ctaImage, setCtaImage] = useState<string | null>(null);
    const [ctaImageName, setCtaImageName] = useState<string>("");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [heroVideoUrl, setHeroVideoUrl] = useState("");
    const [videoFileName, setVideoFileName] = useState("");
    const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null);
    const [videoMode, setVideoMode] = useState<"url" | "file">("url");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ctaFileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await fetchStoreSettings();
            setDeliveryPrice(String(settings.deliveryPrice));
        };
        void loadSettings();

        // Load media asynchronously
        loadMediaBlob("heroImage").then(blob => {
            if (blob) setHeroImage(URL.createObjectURL(blob));
            else {
                const s = localStorage.getItem("heroImage");
                if (s && !s.startsWith("blob:")) setHeroImage(s);
            }
        });

        loadMediaBlob("ctaImage").then(blob => {
            if (blob) setCtaImage(URL.createObjectURL(blob));
            else {
                const s = localStorage.getItem("ctaImage");
                if (s && !s.startsWith("blob:")) setCtaImage(s);
            }
        });

        const savedVideo = localStorage.getItem("heroVideoUrl");
        if (savedVideo && !savedVideo.startsWith("blob:")) { setHeroVideoUrl(savedVideo); setVideoMode("url"); }
        
        loadMediaBlob("heroVideo").then((blob) => {
            if (blob) {
                setVideoObjectUrl(URL.createObjectURL(blob));
                if (localStorage.getItem("heroVideoName")) setVideoMode("file");
            }
        });

        const savedName = localStorage.getItem("heroImageName");
        if (savedName) setHeroImageName(savedName);
        const savedCtaName = localStorage.getItem("ctaImageName");
        if (savedCtaName) setCtaImageName(savedCtaName);
        const savedVideoName = localStorage.getItem("heroVideoName");
        if (savedVideoName) setVideoFileName(savedVideoName);
    }, []);

    const handleSave = async () => {
        try {
            await updateDeliveryPrice(Number(deliveryPrice));
            if (videoMode === "url") {
                if (heroVideoUrl.trim()) {
                    localStorage.setItem("heroVideoUrl", heroVideoUrl.trim());
                } else {
                    localStorage.removeItem("heroVideoUrl");
                }
            }
            setSavedNotice(true);
            setTimeout(() => setSavedNotice(false), 3000);
        } catch {
            setSavedNotice(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        if (!file.type.startsWith("image/")) {
            setUploadError("الملف المحدد ليس صورة. الرجاء اختيار صورة.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("حجم الصورة كبير جداً. الحد الأقصى 5 ميغابايت.");
            return;
        }
        
        try {
            await saveMediaBlob("heroImage", file);
            setHeroImageName(file.name);
            localStorage.setItem("heroImageName", file.name);
            const blob = await loadMediaBlob("heroImage");
            if (blob) {
                if (heroImage && heroImage.startsWith("blob:")) URL.revokeObjectURL(heroImage);
                setHeroImage(URL.createObjectURL(blob));
            }
        } catch (err) {
            setUploadError("حدث خطأ أثناء حفظ الصورة. ربما تم تجاوز سعة التخزين.");
        }
    };

    const handleRemoveImage = () => {
        if (heroImage && heroImage.startsWith("blob:")) URL.revokeObjectURL(heroImage);
        setHeroImage(null);
        setHeroImageName("");
        localStorage.removeItem("heroImage");
        localStorage.removeItem("heroImageName");
        void deleteMediaBlob("heroImage");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCtaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        if (!file.type.startsWith("image/")) {
            setUploadError("الملف المحدد ليس صورة. الرجاء اختيار صورة.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("حجم الصورة كبير جداً. الحد الأقصى 5 ميغابايت.");
            return;
        }
        
        try {
            await saveMediaBlob("ctaImage", file);
            setCtaImageName(file.name);
            localStorage.setItem("ctaImageName", file.name);
            const blob = await loadMediaBlob("ctaImage");
            if (blob) {
                if (ctaImage && ctaImage.startsWith("blob:")) URL.revokeObjectURL(ctaImage);
                setCtaImage(URL.createObjectURL(blob));
            }
        } catch (err) {
            setUploadError("حدث خطأ أثناء حفظ الصورة. ربما تم تجاوز سعة التخزين.");
        }
    };

    const handleRemoveCtaImage = () => {
        if (ctaImage && ctaImage.startsWith("blob:")) URL.revokeObjectURL(ctaImage);
        setCtaImage(null);
        setCtaImageName("");
        localStorage.removeItem("ctaImage");
        localStorage.removeItem("ctaImageName");
        void deleteMediaBlob("ctaImage");
        if (ctaFileInputRef.current) ctaFileInputRef.current.value = "";
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            setUploadError("الملف المحدد ليس فيديو.");
            return;
        }
        setUploadError(null);
        if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
        setVideoFileName(file.name);
        setVideoMode("file");
        localStorage.setItem("heroVideoName", file.name);
        
        await saveMediaBlob("heroVideo", file);
        const blob = await loadMediaBlob("heroVideo");
        if (blob) {
            const freshUrl = URL.createObjectURL(blob);
            setVideoObjectUrl(freshUrl);
        }
    };

    const handleRemoveVideo = async () => {
        if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl);
        setVideoObjectUrl(null);
        setVideoFileName("");
        setHeroVideoUrl("");
        localStorage.removeItem("heroVideoUrl");
        localStorage.removeItem("heroVideoName");
        await deleteMediaBlob("heroVideo");
        if (videoInputRef.current) videoInputRef.current.value = "";
    };
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black">الإعدادات</h2>
                <p className="text-muted-foreground text-sm">تخصيص وإدارة حسابك وإعدادات المتجر</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { id: "profile", label: "الملف الشخصي", icon: User },
                        { id: "notifications", label: "التنبيهات", icon: Bell },
                        { id: "security", label: "الأمان", icon: Shield },
                        { id: "appearance", label: "المظهر", icon: Palette },
                        { id: "general", label: "إعدادات المتجر", icon: Globe },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${item.id === activeTab
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                                : "text-muted-foreground hover:bg-muted"
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-card p-6 md:p-8 rounded-[2rem] border border-border/50 shadow-sm space-y-8">
                        {activeTab === "profile" && (
                            <>
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] flex items-center justify-center text-white text-3xl font-black">
                                        AD
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">المسؤول الرئيسي</h3>
                                        <p className="text-sm text-muted-foreground">admin@shakastore.com</p>
                                        <div className="flex gap-2 mt-3">
                                            <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 text-xs font-bold border-primary/20">تغيير الصورة</Button>
                                            <Button variant="ghost" size="sm" className="rounded-lg h-9 px-4 text-xs font-bold text-destructive hover:bg-destructive/5">حذف</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            defaultValue="أدمن المتجر"
                                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            defaultValue="admin@shakastore.com"
                                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">رقم الهاتف</label>
                                        <input
                                            type="tel"
                                            defaultValue="07701234567"
                                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">اللغة الافتراضية</label>
                                        <select className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium appearance-none">
                                            <option>العربية</option>
                                            <option>English</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "general" && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold">إعدادات المتجر</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary uppercase tracking-wider">سعر التوصيل (د.ع)</label>
                                        <input
                                            type="number"
                                            value={deliveryPrice}
                                            onChange={(e) => setDeliveryPrice(e.target.value)}
                                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Hero Video */}
                                <div className="space-y-4 pt-6 border-t border-border/50">
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-wider">فيديو الصفحة الرئيسية</label>
                                        <p className="text-xs text-muted-foreground mt-1">يُفعّل زر التشغيل ℔︎ في الصفحة الرئيسية</p>
                                    </div>
                                    {/* Mode Tabs */}
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setVideoMode("file")}
                                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold border transition-all ${
                                                videoMode === "file"
                                                    ? "bg-primary text-primary-foreground border-primary shadow"
                                                    : "border-border/50 text-muted-foreground hover:bg-muted"
                                            }`}>
                                            رفع من الجهاز
                                        </button>
                                        <button type="button" onClick={() => setVideoMode("url")}
                                            className={`flex-1 py-2 px-4 rounded-xl text-sm font-bold border transition-all ${
                                                videoMode === "url"
                                                    ? "bg-primary text-primary-foreground border-primary shadow"
                                                    : "border-border/50 text-muted-foreground hover:bg-muted"
                                            }`}>
                                            رابط YouTube
                                        </button>
                                    </div>

                                    {videoMode === "file" ? (
                                        videoObjectUrl ? (
                                            <div className="space-y-3">
                                                <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 shadow bg-black">
                                                    <video src={videoObjectUrl} controls className="w-full max-h-48 object-contain" />
                                                    <div className="absolute bottom-2 left-2 right-2">
                                                        <p className="text-white text-xs font-bold truncate bg-black/50 rounded-lg px-2 py-1">{videoFileName}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Button type="button" variant="outline" size="sm"
                                                        onClick={() => videoInputRef.current?.click()}
                                                        className="rounded-xl border-primary/20 hover:bg-primary/5 gap-2 font-bold">
                                                        <Upload className="w-4 h-4" />تغيير
                                                    </Button>
                                                    <Button type="button" variant="ghost" size="sm"
                                                        onClick={() => void handleRemoveVideo()}
                                                        className="rounded-xl text-destructive hover:bg-destructive/5 gap-2 font-bold">
                                                        <Trash2 className="w-4 h-4" />حذف
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button type="button" onClick={() => videoInputRef.current?.click()}
                                                className="w-full py-10 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                    <Video className="w-7 h-7 text-primary" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-bold text-sm">اضغط لرفع فيديو</p>
                                                    <p className="text-xs text-muted-foreground">MP4, MOV, WEBM</p>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white px-6 py-2 rounded-xl text-sm font-bold shadow">
                                                    <Upload className="w-4 h-4" />اختر فيديو
                                                </div>
                                            </button>
                                        )
                                    ) : (
                                        <div className="flex gap-3">
                                            <input type="url" value={heroVideoUrl}
                                                onChange={(e) => setHeroVideoUrl(e.target.value)}
                                                placeholder="https://youtube.com/watch?v=..."
                                                dir="ltr"
                                                className="flex-1 bg-muted/30 border border-border/50 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-left"
                                            />
                                            {heroVideoUrl && (
                                                <button type="button" onClick={() => setHeroVideoUrl("")}
                                                    className="px-4 rounded-xl text-destructive border border-destructive/20 hover:bg-destructive/5 font-bold text-sm">
                                                    حذف
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <input ref={videoInputRef} type="file" accept="video/*"
                                        onChange={(e) => void handleVideoUpload(e)}
                                        className="hidden" />
                                </div>

                                {/* Hero Image Upload */}
                                <div className="space-y-4 pt-6 border-t border-border/50">
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-wider">صورة الصفحة الرئيسية</label>
                                        <p className="text-xs text-muted-foreground mt-1">ارفع صورة تظهر في القسم الرئيسي للموقع. (الحد الأقصى 5MB)</p>
                                    </div>

                                    {heroImage ? (
                                        <div className="space-y-3">
                                            <div className="relative w-full max-w-xs aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg">
                                                <img
                                                    src={heroImage}
                                                    alt="معاينة الصورة الرئيسية"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <p className="text-white text-xs font-bold truncate bg-black/30 rounded-lg px-2 py-1">{heroImageName}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="rounded-xl border-primary/20 hover:bg-primary/5 gap-2 font-bold"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    تغيير الصورة
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemoveImage}
                                                    className="rounded-xl text-destructive hover:bg-destructive/5 gap-2 font-bold"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    حذف الصورة
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full max-w-xs aspect-[4/5] border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <ImageIcon className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="text-center px-4">
                                                <p className="font-bold text-sm">اضغط لرفع صورة</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                                                <Upload className="w-4 h-4" />
                                                اختر صورة
                                            </div>
                                        </button>
                                    )}

                                    {uploadError && (
                                        <p className="text-sm font-bold text-destructive bg-destructive/10 px-4 py-3 rounded-xl">{uploadError}</p>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </div>

                                {/* CTA Image Upload */}
                                <div className="space-y-4 pt-6 border-t border-border/50">
                                    <div>
                                        <label className="text-xs font-bold text-primary uppercase tracking-wider">صورة قسم الدعوة (CTA)</label>
                                        <p className="text-xs text-muted-foreground mt-1">ارفع صورة تظهر في قسم "دعوة العمل" أسفل الصفحة. (الحد الأقصى 5MB)</p>
                                    </div>

                                    {ctaImage ? (
                                        <div className="space-y-3">
                                            <div className="relative w-full max-w-xs aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg bg-muted">
                                                <img
                                                    src={ctaImage}
                                                    alt="معاينة صورة CTA"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <p className="text-white text-xs font-bold truncate bg-black/30 rounded-lg px-2 py-1">{ctaImageName}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => ctaFileInputRef.current?.click()}
                                                    className="rounded-xl border-primary/20 hover:bg-primary/5 gap-2 font-bold"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    تغيير الصورة
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRemoveCtaImage}
                                                    className="rounded-xl text-destructive hover:bg-destructive/5 gap-2 font-bold"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    حذف الصورة
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => ctaFileInputRef.current?.click()}
                                            className="w-full max-w-xs aspect-video border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all cursor-pointer group"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <ImageIcon className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="text-center px-4">
                                                <p className="font-bold text-sm">اضغط لرفع صورة</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                                                <Upload className="w-4 h-4" />
                                                اختر صورة
                                            </div>
                                        </button>
                                    )}

                                    <input
                                        ref={ctaFileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCtaImageUpload}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}

                        {(activeTab === "notifications" || activeTab === "security" || activeTab === "appearance") && (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Shield className="w-12 h-12 mb-4 opacity-50" />
                                <h3 className="text-lg font-bold">هذا القسم قيد التطوير</h3>
                                <p className="text-sm">ستكون هذه الإعدادات متاحة قريباً.</p>
                            </div>
                        )}

                        {(activeTab === "profile" || activeTab === "general") && (
                            <div className="pt-6 flex justify-end items-center gap-4">
                                {savedNotice && (
                                    <span className="text-sm font-bold text-emerald-500">تم حفظ الإعدادات بنجاح! ✓</span>
                                )}
                                <Button 
                                    onClick={handleSave}
                                    className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white px-8 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Save className="w-4 h-4" />
                                    حفظ التغييرات
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
