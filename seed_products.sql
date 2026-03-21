-- Seed script for products
-- This script populates the products table with the data from src/lib/data/products.ts
-- to ensure that the checkout process can find the products in the database.

INSERT INTO public.products (id, name, "nameEn", price, description, image, rating, category, stock, status)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'توبوكي كوري أصلي', 'Korean Tteokbokki', 12500, 'تذوق الطعم الكوري الأصيل مع وجبة التوبوكي الحارة والمميزة. كعكات الأرز الطرية والمضغية مغطاة بصلصة غوشوجانغ الغنية والحلوة والحارة في آن واحد. تجربة كورية لا تُنسى في منزلك.', 'https://images.unsplash.com/photo-1679581083578-94eae6e8d7a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0dGVva2Jva2tpJTIwZm9vZHxlbnwxfHx8fDE3NzEyMjY3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080', 5, 'كوري', 10, 'active'),
  ('b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e', 'عصائر طبيعية فاخرة', 'Premium Fresh Juice', 8750, 'مجموعة من العصائر الطبيعية المعتصرة من أفضل الفواكه المختارة بعناية. خالٍ من المواد الحافظة والسكر المضاف، ليوفر لك الانتعاش والصحة في كل رشفة.', 'https://images.unsplash.com/photo-1734773557735-8fc50f94b473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGp1aWNlJTIwYm90dGxlc3xlbnwxfHx8fDE3NzEzMTY1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 5, 'عصائر', 5, 'active'),
  ('c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f', 'نودلز رامن ياباني', 'Japanese Ramen Noodles', 10000, 'رامن ياباني تقليدي بجودة المطاعم. تتميز بملمسها المثالي ومرقها الغني بالنكهات، سهلة التحضير ومثالية لوجبة سريعة ولذيذة في أي وقت.', 'https://images.unsplash.com/photo-1628919311414-1ee37e9ed8ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnN0YW50JTIwbm9vZGxlcyUyMHJhbWVufGVufDF8fHx8MTc3MTI2NTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080', 5, 'نودلز', 0, 'active'),
  ('d4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a', 'منتجات أوروبية فاخرة', 'European Gourmet', 15250, 'تشكيلة مختارة من أرقى المنتجات الأوروبية الفاخرة، المختارة بعناية لتناسب أصحاب الذوق الغورميه. جودة عالمية وتجربة طعام استثنائية من قلب أوروبا.', 'https://images.unsplash.com/photo-1641141211388-8e1780a27a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldXJvcGVhbiUyMGdvdXJtZXQlMjBmb29kfGVufDF8fHx8MTc3MTMxNjU3N3ww&ixlib=rb-4.1.0&q=80&w=1080', 5, 'أوروبي', 15, 'active'),
  ('e5f6a7b8-c9d0-4e9f-2a3b-4c5d6e7f8a9b', 'عصير برتقال طازج', 'Fresh Orange Juice', 6500, 'عصير برتقال طبيعي 100% غني بفيتامين سي. معتصر من برتقال ناضج وحلو المذاق، ليكون خيارك المثالي لوجبة الإفطار أو كمنعش في نهار مشمس.', 'https://images.unsplash.com/photo-1547514701-42782101795e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmFuZ2UlMjBqdWljZXxlbnwxfHx8fDE3NzEzMTY1NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080', 4, 'عصائر', 8, 'active'),
  ('f6a7b8c9-d0e1-4fa0-3b4c-5d6e7f8a9b0c', 'نودلز حار كوري', 'Spicy Korean Noodles', 11500, 'النودلز الكوري الحار المشهور. تحدى نفسك مع هذه الوجبة المليئة بالنكهات القوية والحرارة التي لا تُقاوم. الخيار المفضل لمحبي التوابل والحرارة.', 'https://images.unsplash.com/photo-1552611052-33e04de081de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljeSUyMG5vb2RsZXN8ZW58MXx8fHwxNzcMTI2NTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080', 5, 'كوري', 20, 'active'),
  ('a7b8c9d0-e1f2-40b1-4c5d-6e7f8a9b0c1d', 'وجبات أوروبية جاهزة', 'Ready European Meals', 18000, 'حلول طعام سريعة وفاخرة مستوحاة من المطبخ الأوروبي. وجبات متوازنة وجاهزة في دقائق، توفر عليك الوقت دون المساومة على الجودة أو الطعم الرائع.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZHxlbnwxfHx8fDE3NzEzMTY1Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080', 5, 'أوروبي', 3, 'active'),
  ('b8c9d0e1-f2a3-41c2-5d6e-7f8a9b0c1d2e', 'توبوكي بالجبن', 'Cheese Tteokbokki', 14250, 'النسخة الكريمية والمفضلة لدى الكثيرين من التوبوكي. تمتزج حرارة التوبوكي مع غنى الجبن المذاب ليقدم توازناً مثالياً من النكهات المريحة واللذيذة.', 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NzEyMjY3MTV8MA&ixlib=rb-4.1.0&q=80&w=1080', 5, 'كوري', 12, 'active'),
  ('c9d0e1f2-a3b4-42d3-6e7f-8a9b0c1d2e3f', 'وجبات سريعة عالمية', 'Global Fast Food Selection', 13750, 'تشكيلة متنوعة من أفضل الوجبات السريعة المستوردة من أشهر المطاعم والعلامات التجارية العالمية، جاهزة للتقديم في دقائق.', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 4, 'وجبات سريعة', 1, 'active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  "nameEn" = EXCLUDED."nameEn",
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  category = EXCLUDED.category,
  stock = EXCLUDED.stock,
  status = EXCLUDED.status;
