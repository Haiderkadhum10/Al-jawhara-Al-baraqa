import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { ContactInfoItem } from "@/types/contact";

interface ContactInfoEntry extends ContactInfoItem {
  icon: typeof Phone;
}

export const contactInfo: ContactInfoEntry[] = [
  {
    icon: Phone,
    title: "الهاتف",
    details: ["+964 780 123 4567", "+964 770 987 6543"],
    description: "من السبت إلى الخميس، 9 صباحاً - 9 مساءً",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    details: ["info@shakastore.iq", "support@shakastore.iq"],
    description: "نرد خلال 24 ساعة",
  },
  {
    icon: MapPin,
    title: "العنوان",
    details: ["بغداد، حي المنصور، العراق"],
    description: "شارع 14 رمضان، مقابل المركز التجاري",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    details: ["السبت - الخميس: 9 ص - 9 م", "الجمعة: مغلق"],
    description: "نرحب بزيارتكم في أي وقت",
  },
];
