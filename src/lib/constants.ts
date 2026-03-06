/** اسم التطبيق / العلامة التجارية */
export const APP_NAME = "الجوهرة البراقة";

/** فئات المنتجات المعتمدة في التطبيق */
export const PRODUCT_CATEGORIES = [
  "الكل",
  "عصائر",
  "نودلز",
  "كوري",
  "أوروبي",
  "وجبات سريعة",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
