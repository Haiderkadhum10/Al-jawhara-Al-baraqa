import { Link } from "react-router";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface NavLinkItem {
  path: string;
  label: string;
}

interface MobileMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: NavLinkItem[];
  isActive: (path: string) => boolean;
}

export function MobileMenuSheet({
  open,
  onOpenChange,
  navLinks,
  isActive,
}: MobileMenuSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-primary/10"
          aria-label="القائمة"
        >
          <Menu className="h-5 w-5 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0 overflow-hidden">
        <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/30">
          <SheetHeader className="p-6 border-b border-border/50">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a85c] to-[#9d7e3a] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold">الجوهرة البراقة</span>
                <span className="text-[10px] text-muted-foreground">القائمة الرئيسية</span>
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4 mt-4">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={link.path}
                  onClick={() => onOpenChange(false)}
                  className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${
                    isActive(link.path)
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-foreground/80 hover:bg-background hover:shadow-sm"
                  }`}
                >
                  <span className="font-medium">{link.label}</span>
                  {isActive(link.path) && <Sparkles className="w-4 h-4 opacity-50" />}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="mt-auto p-6 border-t border-border/50 bg-background/50">
            <Button
              asChild
              className="w-full bg-gradient-to-l from-[#c9a85c] to-[#9d7e3a] hover:from-[#9d7e3a] hover:to-[#c9a85c] text-white py-6 rounded-2xl"
            >
              <Link to="/login" onClick={() => onOpenChange(false)}>
                تسجيل الدخول
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
