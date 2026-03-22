import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { ContactInfoItem } from "@/types/contact";

interface ContactInfoEntry extends ContactInfoItem {
  icon: typeof Phone;
}

export const contactInfo: ContactInfoEntry[] = [
  {
    icon: Phone,
    title: "الهاتف",
    details: ["07882000260", "07882000250"],
    description: "من السبت إلى الخميس، 7 صباحاً - 3 عصراً",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: ["aljawharaalbaraqa41@gmail.com"],
    description: "نرد خلال 24 ساعة",
  },
  {
    icon: MapPin,
    title: "العنوان",
    details: ["شركة الجوهرة البراقة"],
    description: "بغداد - جميلة",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    details: ["السبت - الخميس: 7 ص - 3 م", "الجمعة: مغلق"],
    description: "نرحب بزيارتكم في أي وقت",
  },
];
