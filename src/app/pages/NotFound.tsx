import { motion } from "framer-motion";
import { Link } from "react-router";
import { Home, ArrowRight, SearchX } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-lg space-y-8"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#c9a85c]/10 to-[#9d7e3a]/10 flex items-center justify-center mx-auto"
                >
                    <SearchX className="w-14 h-14 text-primary" />
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-7xl md:text-9xl font-black bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] bg-clip-text text-transparent">
                        404
                    </h1>
                    <h2 className="text-2xl md:text-3xl font-bold">الصفحة غير موجودة</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة للصفحة الرئيسية.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/">
                        <Button className="bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white px-10 py-7 text-lg rounded-2xl shadow-xl shadow-primary/20 group transition-all">
                            <Home className="w-5 h-5 ml-2" />
                            العودة للرئيسية
                        </Button>
                    </Link>
                    <Link to="/products">
                        <Button variant="outline" className="border-primary/20 hover:bg-primary/5 px-10 py-7 text-lg rounded-2xl">
                            تصفح المنتجات
                            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
