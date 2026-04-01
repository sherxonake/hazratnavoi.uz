-- ============================================
-- HAZRATNAVOI.UZ — RLS Политиклари (Админ панел учун)
-- ============================================
-- Бу SQL Supabase SQL Editor'да ишга туширинг
-- https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/sql/new

-- ============================================
-- RLS'ни ўчириш (Админ панел учун вақтинча)
-- ============================================
-- ЭСКЕРТИШ: Бу фақат лойиҳа бошланишида. 
-- Кейинчалик Supabase Auth билан алмаштиринг!

-- NEWS учун RLS политикларини янгилаш
DROP POLICY IF EXISTS "Public can view published news" ON news;
DROP POLICY IF EXISTS "Admins can manage news" ON news;

-- Ҳамма ўқий олади (опубликованное)
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (published = true);

-- Ҳамма ёза олади (вақтинча - админ панел учун)
CREATE POLICY "Anyone can insert news"
  ON news FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update news"
  ON news FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete news"
  ON news FOR DELETE
  USING (true);

-- ============================================
-- QA_PAIRS учун RLS политикларини янгилаш
-- ============================================
DROP POLICY IF EXISTS "Public can view published qa pairs" ON qa_pairs;
DROP POLICY IF EXISTS "Admins can manage qa pairs" ON qa_pairs;

CREATE POLICY "Public can view published qa pairs"
  ON qa_pairs FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can insert qa pairs"
  ON qa_pairs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update qa pairs"
  ON qa_pairs FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete qa pairs"
  ON qa_pairs FOR DELETE
  USING (true);

-- ============================================
-- PRAYER_TIMES учун RLS политикларини янгилаш
-- ============================================
DROP POLICY IF EXISTS "Public can view prayer times" ON prayer_times;
DROP POLICY IF EXISTS "Admins can manage prayer times" ON prayer_times;

CREATE POLICY "Public can view prayer times"
  ON prayer_times FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert prayer times"
  ON prayer_times FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update prayer times"
  ON prayer_times FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete prayer times"
  ON prayer_times FOR DELETE
  USING (true);

-- ============================================
-- IMAM_MESSAGES учун RLS политикларини янгилаш
-- ============================================
DROP POLICY IF EXISTS "Public can view published imam messages" ON imam_messages;
DROP POLICY IF EXISTS "Admins can manage imam messages" ON imam_messages;

CREATE POLICY "Public can view published imam messages"
  ON imam_messages FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can insert imam messages"
  ON imam_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update imam messages"
  ON imam_messages FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete imam messages"
  ON imam_messages FOR DELETE
  USING (true);

-- ============================================
-- STORAGE BUCKET учун политиклар
-- ============================================
-- Storage bucket'ни оммавий қилиш
INSERT INTO storage.buckets (id, name, public)
VALUES ('hazratnavoi-images', 'hazratnavoi-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ҳамма расм кўра олади
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'hazratnavoi-images');

-- Ҳамма расм юклаш олади (вақтинча)
CREATE POLICY "Anyone can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hazratnavoi-images');

-- Ҳамма расм ўчира олади (вақтинча)
CREATE POLICY "Anyone can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'hazratnavoi-images');

-- ============================================
-- ТАККОМОЛЛАШ
-- ============================================
-- ЭСКЕРТИШ: Бу политиклар лойиҳа бошланишида қулай,
-- лекин production'да Supabase Auth ишлатиш тавсия этилади!
