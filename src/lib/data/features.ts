import { Package, CheckCircle, TruckIcon, Star } from "lucide-react";
import type { FeatureItem } from "@/types/product";

/** ميزات الصفحة الرئيسية */
export const homeFeatures: FeatureItem[] = [
  {
    icon: Package,
    title: "منتجات مستوردة",
    description: "نختار أفضل المنتجات من أوروبا وآسيا",
  },
  {
    icon: CheckCircle,
    title: "جودة عالية",
    description: "جميع منتجاتنا معتمدة وذات جودة فائقة",
  },
  {
    icon: TruckIcon,
    title: "توصيل سريع",
    description: "نوصل طلباتك بسرعة وأمان",
  },
  {
    icon: Star,
    title: "أسعار تنافسية",
    description: "أفضل الأسعار مع خدمة متميزة",
  },
];
