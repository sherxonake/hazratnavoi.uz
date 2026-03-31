-- ============================================
-- HAZRATNAVOI.UZ — Supabase Storage Setup
-- ============================================

-- Создаём бакет для изображений
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hazratnavoi-images',
  'hazratnavoi-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS Policies для бакета
-- ============================================

-- Разрешаем всем читать файлы (публичный доступ)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hazratnavoi-images');

-- Разрешаем авторизованным пользователям загружать файлы
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hazratnavoi-images' 
  AND auth.role() = 'authenticated'
);

-- Разрешаем авторизованным пользователям удалять файлы
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hazratnavoi-images' 
  AND auth.role() = 'authenticated'
);

-- ============================================
-- Проверка
-- ============================================

-- Показать все бакеты
SELECT * FROM storage.buckets;

-- Показать все политики
SELECT * FROM storage.policies WHERE bucket_id = 'hazratnavoi-images';
