-- Hazratnavoi.uz Database Schema
-- Created: 2026-03-31

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- NEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_news_published ON news(published);
CREATE INDEX idx_news_created_at ON news(created_at DESC);

-- ============================================
-- QA_PAIRS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS qa_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_qa_published ON qa_pairs(published);
CREATE INDEX idx_qa_order ON qa_pairs(order_num);

-- ============================================
-- PRAYER_TIMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS prayer_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  fajr TIME NOT NULL,
  sunrise TIME NOT NULL,
  dhuhr TIME NOT NULL,
  asr TIME NOT NULL,
  maghrib TIME NOT NULL,
  isha TIME NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prayer_date ON prayer_times(date);

-- ============================================
-- IMAM_MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS imam_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_imam_published ON imam_messages(published);
CREATE INDEX idx_imam_created_at ON imam_messages(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE imam_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- NEWS POLICIES
-- ============================================
-- Everyone can read published news
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage news"
  ON news FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- QA_PAIRS POLICIES
-- ============================================
-- Everyone can read published QA pairs
CREATE POLICY "Public can view published qa pairs"
  ON qa_pairs FOR SELECT
  USING (published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage qa pairs"
  ON qa_pairs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- PRAYER_TIMES POLICIES
-- ============================================
-- Everyone can read prayer times
CREATE POLICY "Public can view prayer times"
  ON prayer_times FOR SELECT
  USING (true);

-- Authenticated users (admin) can manage
CREATE POLICY "Admins can manage prayer times"
  ON prayer_times FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- IMAM_MESSAGES POLICIES
-- ============================================
-- Everyone can read published messages
CREATE POLICY "Public can view published imam messages"
  ON imam_messages FOR SELECT
  USING (published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admins can manage imam messages"
  ON imam_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to news table
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to prayer_times table
CREATE TRIGGER update_prayer_times_updated_at
  BEFORE UPDATE ON prayer_times
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Example QA pairs
INSERT INTO qa_pairs (question, answer, category, order_num, published) VALUES
(
  'Жума намози қачон ўқилади?',
  'Жума намози ҳар жума куни пешин вақтида ўқилади. Масжидимизда жума намози соат 12:30 да бошланади.',
  'Намоз',
  1,
  true
),
(
  'Закот кимларга берилади?',
  'Закот қуръонда зикр қилинган 8 тоифага берилади: фақирлар, мискинлар, закот йиғувчилар, муаллафатул қулуб, қуллар, қарздорлар, фи сабилиллоҳ, ибнусабил.',
  'Закот',
  2,
  true
),
(
  'Рўза қандай туталади?',
  'Рўза тонг отишдан қуёш ботишгача еб-ичишдан, жинсий яқинликдан ва рўзани бузувчи нарсалардан тийилишдир.',
  'Рўза',
  3,
  true
);
