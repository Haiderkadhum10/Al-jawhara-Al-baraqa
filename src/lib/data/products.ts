import type { Product } from "@/types/product";

/**
 * مصدر واحد لحقيقة المنتجات - يُستخدم في الصفحة الرئيسية وصفحة المنتجات
 */
export const products: Product[] = [
  {
    id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    name: "توبوكي كوري أصلي",
    nameEn: "Korean Tteokbokki",
    price: "12,500",
    description: "تذوق الطعم الكوري الأصيل مع وجبة التوبوكي الحارة والمميزة. كعكات الأرز الطرية والمضغية مغطاة بصلصة غوشوجانغ الغنية والحلوة والحارة في آن واحد. تجربة كورية لا تُنسى في منزلك.",
    image:
      "https://images.unsplash.com/photo-1679581083578-94eae6e8d7a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0dGVva2Jva2tpJTIwZm9vZHxlbnwxfHx8fDE3NzEyMjY3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "كوري",
    stock: 10,
  },
  {
    id: "b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e",
    name: "عصائر طبيعية فاخرة",
    nameEn: "Premium Fresh Juice",
    price: "8,750",
    description: "مجموعة من العصائر الطبيعية المعتصرة من أفضل الفواكه المختارة بعناية. خالٍ من المواد الحافظة والسكر المضاف، ليوفر لك الانتعاش والصحة في كل رشفة.",
    image:
      "https://images.unsplash.com/photo-1734773557735-8fc50f94b473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGp1aWNlJTIwYm90dGxlc3xlbnwxfHx8fDE3NzEzMTY1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "عصائر",
    stock: 5,
  },
  {
    id: "c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f",
    name: "نودلز رامن ياباني",
    nameEn: "Japanese Ramen Noodles",
    price: "10,000",
    description: "رامن ياباني تقليدي بجودة المطاعم. تتميز بملمسها المثالي ومرقها الغني بالنكهات، سهلة التحضير ومثالية لوجبة سريعة ولذيذة في أي وقت.",
    image:
      "https://images.unsplash.com/photo-1628919311414-1ee37e9ed8ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YW50JTIwbm9vZGxlcyUyMHJhbWVufGVufDF8fHx8MTc3MTI2NTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "نودلز",
    stock: 0,
  },
  {
    id: "d4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a",
    name: "منتجات أوروبية فاخرة",
    nameEn: "European Gourmet",
    price: "15,250",
    description: "تشكيلة مختارة من أرقى المنتجات الأوروبية الفاخرة، المختارة بعناية لتناسب أصحاب الذوق الغورميه. جودة عالمية وتجربة طعام استثنائية من قلب أوروبا.",
    image:
      "https://images.unsplash.com/photo-1641141211388-8e1780a27a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGdvdXJtZXQlMjBmb29kfGVufDF8fHx8MTc3MTMxNjU3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "أوروبي",
    stock: 15,
  },
  {
    id: "e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b",
    name: "عصير برتقال طازج",
    nameEn: "Fresh Orange Juice",
    price: "6,500",
    description: "عصير برتقال طبيعي 100% غني بفيتامين سي. معتصر من برتقال ناضج وحلو المذاق، ليكون خيارك المثالي لوجبة الإفطار أو كمنعش في نهار مشمس.",
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZXxlbnwxfHx8fDE3NzEzMTY1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4,
    category: "عصائر",
    stock: 8,
  },
  {
    id: "f6a7b8c9-d0e1-4fa0-3b4c-5d6e7f8a9b0c",
    name: "نودلز حار كوري",
    nameEn: "Spicy Korean Noodles",
    price: "11,500",
    description: "النودلز الكوري الحار المشهور. تحدى نفسك مع هذه الوجبة المليئة بالنكهات القوية والحرارة التي لا تُقاوم. الخيار المفضل لمحبي التوابل والحرارة.",
    image:
      "https://images.unsplash.com/photo-1552611052-33e04de081de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljeSUyMG5vb2RsZXN8ZW58MXx8fHwxNzcMTI2NTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "كوري",
    stock: 20,
  },
  {
    id: "a7b8c9d0-e1f2-40b1-4c5d-6e7f8a9b0c1d",
    name: "وجبات أوروبية جاهزة",
    nameEn: "Ready European Meals",
    price: "18,000",
    description: "حلول طعام سريعة وفاخرة مستوحاة من المطبخ الأوروبي. وجبات متوازنة وجاهزة في دقائق، توفر عليك الوقت دون المساومة على الجودة أو الطعم الرائع.",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZHxlbnwxfHx8fDE3NzEzMTY1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "أوروبي",
    stock: 3,
  },
  {
    id: "b8c9d0e1-f2a3-41c2-5d6e-7f8a9b0c1d2e",
    name: "توبوكي بالجبن",
    nameEn: "Cheese Tteokbokki",
    price: "14,250",
    description: "النسخة الكريمية والمفضلة لدى الكثيرين من التوبوكي. تمتزج حرارة التوبوكي مع غنى الجبن المذاب ليقدم توازناً مثالياً من النكهات المريحة واللذيذة.",
    image:
      "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NzEyMjY3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5,
    category: "كوري",
    stock: 12,
  },
  {
    id: "c9d0e1f2-a3b4-42d3-6e7f-8a9b0c1d2e3f",
    name: "وجبات سريعة عالمية",
    nameEn: "Global Fast Food Selection",
    price: "13,750",
    description:
      "تشكيلة متنوعة من أفضل الوجبات السريعة المستوردة من أشهر المطاعم والعلامات التجارية العالمية، جاهزة للتقديم في دقائق.",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 4,
    category: "وجبات سريعة",
    stock: 1,
  },
];

/** عدد المنتجات المميزة في الصفحة الرئيسية */
export const FEATURED_PRODUCTS_COUNT = 4;

export function getFeaturedProducts(): Product[] {
  return products.slice(0, FEATURED_PRODUCTS_COUNT);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "الكل") return [...products];
  return products.filter((p) => p.category === category);
}
