import type { LucideIcon } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  description?: string;
  image: string;
  rating: number;
  category: string;
  featured?: boolean;
  created_at?: string;
  stock?: number;
  status?: "active" | "archived" | "deleted";
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}
