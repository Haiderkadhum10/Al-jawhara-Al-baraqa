import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { TrendingUp, Mail, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        const { error } = await login({ email, password });

        if (error) {
            setErrorMessage(error.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
            setIsLoading(false);
            return;
        }

        navigate("/dashboard");
        setIsLoading(false);
    };

    return (
        <div
            className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-8 relative overflow-hidden rtl"
            dir="rtl"
        >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,92,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(201,168,92,0.06),transparent_60%)]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[520px] relative z-10"
            >
                <div className="bg-[#6b6b6b]/30 backdrop-blur-2xl border border-white/10 rounded-[2.75rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
                    {/* Logo Header */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 mb-6"
                        >
                            <TrendingUp className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">تسجيل الدخول</h1>
                        <p className="text-white/35 font-medium text-center">
                            أدخل بياناتك للوصول إلى لوحة التحكم
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-bold">{errorMessage}</p>
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <Label className="text-white font-bold pr-1">البريد الإلكتروني</Label>
                            <div className="relative group">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white/50" />
                                </div>
                                <Input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@store.com"
                                    className="h-14 bg-white/10 border-white/15 rounded-2xl pr-14 pl-4 text-white placeholder:text-white/35 focus-visible:ring-primary/25 focus-visible:border-primary/40 transition-all text-right"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white font-bold pr-1">كلمة المرور</Label>
                            <div className="relative group">
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-white/50" />
                                </div>
                                <Input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="h-14 bg-white/10 border-white/15 rounded-2xl pr-14 pl-4 text-white placeholder:text-white/35 focus-visible:ring-primary/25 focus-visible:border-primary/40 transition-all text-right"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 font-black text-lg shadow-xl shadow-primary/25 transition-all active:scale-[0.98] mt-6 relative"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 ml-2 animate-spin" />
                                    جاري التحقق...
                                </>
                            ) : (
                                <>
                                    <ArrowLeft className="w-5 h-5 absolute left-6" />
                                    دخول لوحة التحكم
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer Decoration */}
                    <div className="mt-10 text-center">
                        <p className="text-white/10 text-sm font-bold uppercase tracking-[0.3em]">
                            Shaka Store Admin Gateway
                        </p>
                    </div>
                </div>

                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-transparent rounded-[2.75rem] blur opacity-35 -z-10" />
            </motion.div>
        </div>
    );
}
