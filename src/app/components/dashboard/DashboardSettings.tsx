import { User, Bell, Shield, Palette, Globe, Save } from "lucide-react";
import { Button } from "../ui/button";


export function DashboardSettings() {
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
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${item.id === "profile"
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

                        <div className="pt-6 flex justify-end">
                            <Button className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] text-white px-8 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
                                <Save className="w-4 h-4" />
                                حفظ التغييرات
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
