-- ============================================
-- HAZRATNAVOI.UZ — RLS Политиклари (Тўлиқ reset)
-- ============================================
-- Supabase SQL Editor'да ишга туширинг:
-- https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/sql/new

-- ============================================
-- NEWS
-- ============================================
DROP POLICY IF EXISTS "Public can view published news" ON news;
DROP POLICY IF EXISTS "Admins can manage news" ON news;
DROP POLICY IF EXISTS "Anyone can insert news" ON news;
DROP POLICY IF EXISTS "Anyone can update news" ON news;
DROP POLICY IF EXISTS "Anyone can delete news" ON news;

CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (published = true);

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
-- QA_PAIRS
-- ============================================
DROP POLICY IF EXISTS "Public can view published qa pairs" ON qa_pairs;
DROP POLICY IF EXISTS "Admins can manage qa pairs" ON qa_pairs;
DROP POLICY IF EXISTS "Anyone can insert qa pairs" ON qa_pairs;
DROP POLICY IF EXISTS "Anyone can update qa pairs" ON qa_pairs;
DROP POLICY IF EXISTS "Anyone can delete qa pairs" ON qa_pairs;

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
-- PRAYER_TIMES
-- ============================================
DROP POLICY IF EXISTS "Public can view prayer times" ON prayer_times;
DROP POLICY IF EXISTS "Admins can manage prayer times" ON prayer_times;
DROP POLICY IF EXISTS "Anyone can insert prayer times" ON prayer_times;
DROP POLICY IF EXISTS "Anyone can update prayer times" ON prayer_times;
DROP POLICY IF EXISTS "Anyone can delete prayer times" ON prayer_times;

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
-- IMAM_MESSAGES
-- ============================================
DROP POLICY IF EXISTS "Public can view published imam messages" ON imam_messages;
DROP POLICY IF EXISTS "Admins can manage imam messages" ON imam_messages;
DROP POLICY IF EXISTS "Anyone can insert imam messages" ON imam_messages;
DROP POLICY IF EXISTS "Anyone can update imam messages" ON imam_messages;
DROP POLICY IF EXISTS "Anyone can delete imam messages" ON imam_messages;

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
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('hazratnavoi-images', 'hazratnavoi-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;

CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'hazratnavoi-images');

CREATE POLICY "Anyone can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'hazratnavoi-images');

CREATE POLICY "Anyone can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'hazratnavoi-images');
