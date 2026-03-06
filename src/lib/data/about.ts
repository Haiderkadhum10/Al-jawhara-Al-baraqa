import { ShieldCheck, Globe, Heart, Award, Users } from "lucide-react";
import type { FeatureItem } from "@/types/product";

export const aboutValues: FeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "الجودة والأمان",
    description:
      "نلتزم بأعلى معايير الجودة والسلامة في اختيار وتخزين منتجاتنا",
  },
  {
    icon: Globe,
    title: "التنوع العالمي",
    description: "نوفر منتجات مختارة من أفضل المصانع في أوروبا وآسيا",
  },
  {
    icon: Heart,
    title: "رضا العملاء",
    description: "سعادة عملائنا هي هدفنا الأول ونسعى دائماً لتجاوز توقعاتهم",
  },
  {
    icon: Award,
    title: "التميز والابتكار",
    description: "نبحث دائماً عن أحدث وأفضل المنتجات الغذائية في الأسواق",
  },
];

export const aboutStats: { number: string; label: string }[] = [
  { number: "500+", label: "منتج متنوع" },
  { number: "10000+", label: "عميل راضٍ" },
  { number: "50+", label: "علامة تجارية" },
  { number: "15+", label: "دولة منشأ" },
];

export const aboutMission = {
  vision:
    "أن نكون الخيار الأول للمستهلكين في العراق عند البحث عن منتجات غذائية مستوردة عالية الجودة ومتنوعة.",
  mission:
    "نسعى لإثراء تجربة تناول الطعام لعملائنا في العراق من خلال توفير أفضل المنتجات الغذائية المستوردة من مختلف أنحاء العالم، مع ضمان الجودة العالية والأسعار التنافسية وخدمة العملاء المتميزة.",
};

export { Users as AboutMissionIcon };
