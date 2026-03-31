-- ============================================
-- HAZRATNAVOI.UZ — Полная схема базы данных
-- ============================================
-- Выполните этот SQL в Supabase SQL Editor
-- https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/sql/new

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. NEWS TABLE — Новости мечети
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

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);

-- ============================================
-- 2. PRAYER_TIMES TABLE — Время намаза
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

-- Индексы
CREATE INDEX IF NOT EXISTS idx_prayer_date ON prayer_times(date);

-- ============================================
-- 3. QA_PAIRS TABLE — Вопросы и ответы
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

-- Индексы
CREATE INDEX IF NOT EXISTS idx_qa_published ON qa_pairs(published);
CREATE INDEX IF NOT EXISTS idx_qa_order ON qa_pairs(order_num);

-- ============================================
-- 4. IMAM_MESSAGES TABLE — Сообщения имама
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

-- Индексы
CREATE INDEX IF NOT EXISTS idx_imam_published ON imam_messages(published);
CREATE INDEX IF NOT EXISTS idx_imam_created_at ON imam_messages(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) — Безопасность
-- ============================================

-- Включаем RLS на всех таблицах
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE imam_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES — NEWS
-- ============================================
-- Все могут читать опубликованные новости
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (published = true);

-- Администраторы могут управлять новостями
CREATE POLICY "Admins can manage news"
  ON news FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- POLICIES — QA_PAIRS
-- ============================================
-- Все могут читать опубликованные вопросы-ответы
CREATE POLICY "Public can view published qa pairs"
  ON qa_pairs FOR SELECT
  USING (published = true);

-- Администраторы могут управлять
CREATE POLICY "Admins can manage qa pairs"
  ON qa_pairs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- POLICIES — PRAYER_TIMES
-- ============================================
-- Все могут читать время намаза
CREATE POLICY "Public can view prayer times"
  ON prayer_times FOR SELECT
  USING (true);

-- Администраторы могут управлять
CREATE POLICY "Admins can manage prayer times"
  ON prayer_times FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- POLICIES — IMAM_MESSAGES
-- ============================================
-- Все могут читать опубликованные сообщения
CREATE POLICY "Public can view published imam messages"
  ON imam_messages FOR SELECT
  USING (published = true);

-- Администраторы могут управлять
CREATE POLICY "Admins can manage imam messages"
  ON imam_messages FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- FUNCTIONS — Автоматическое обновление timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для news
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Триггер для prayer_times
CREATE TRIGGER update_prayer_times_updated_at
  BEFORE UPDATE ON prayer_times
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA — Тестовые данные
-- ============================================

-- Время намаза на сегодня (Навои, Узбекистан)
-- Координаты: 40.0844° N, 65.3792° E
INSERT INTO prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha)
VALUES (
  CURRENT_DATE,
  '05:00:00',
  '06:30:00',
  '12:45:00',
  '16:15:00',
  '18:45:00',
  '20:15:00'
)
ON CONFLICT (date) DO UPDATE SET
  fajr = EXCLUDED.fajr,
  sunrise = EXCLUDED.sunrise,
  dhuhr = EXCLUDED.dhuhr,
  asr = EXCLUDED.asr,
  maghrib = EXCLUDED.maghrib,
  isha = EXCLUDED.isha;

-- Тестовая новость
INSERT INTO news (title, content, published)
VALUES (
  'Рамазон ойи муборак бўлсин!',
  'Муқаддас Рамазон ойи кириб келди. Барчамизга рўза тутиш, ибодат қилиш, савобли ишлар билан шуғулланиш насиб этсин. Аллоҳ ҳар бир рўзадорнинг ибодатларини қабул қилсин.',
  true
);

-- Вопросы-ответы
INSERT INTO qa_pairs (question, answer, category, order_num, published) VALUES
(
  'Жума намози қачон ўқилади?',
  'Жума намози ҳар жума куни пешин вақтида ўқилади. Масжидимизда жума намози соат 12:30 да бошланади. Жума намозига келиш ҳар бир мусулмон кишига фарз.',
  'Намоз',
  1,
  true
),
(
  'Закот кимларга берилади?',
  'Закот қуръони каримда зикр қилинган 8 тоифага берилади: 1) Фақирлар, 2) Мискинлар, 3) Закот йиғувчилар, 4) Муаллафатул қулуб, 5) Қуллар, 6) Қарздорлар, 7) Фи сабилиллоҳ, 8) Ибнусабил.',
  'Закот',
  2,
  true
),
(
  'Рўза қандай туталади?',
  'Рўза тонг отишдан (фажр намози вақти) қуёш ботишгача (мағриб намози вақти) еб-ичишдан, жинсий яқинликдан ва рўзани бузувчи бошқа нарсалардан тийилишдир. Шом вақти кириши билан рўза очилади.',
  'Рўза',
  3,
  true
),
(
  'Садақаи фитр кимларга берилади?',
  'Садақаи фитр рўзадорнинг рўзасини беҳуда сўзлардан поклаш ва мискинларга ёрдам бериш учун берилади. Уни фақир ва мискинларга бериш жоиз.',
  'Закот',
  4,
  true
),
(
  'Таровеҳ намози қанча ракаат?',
  'Таровеҳ намози 20 ракаат суннати муаккададир. Уни жамоат билан ўқиш афзал. Ҳар икки ракаатдан сўнг салом берилади.',
  'Намоз',
  5,
  true
);

-- ============================================
-- VERIFICATION — Проверка создания
-- ============================================

-- Проверка количества записей
SELECT 
  'news' as table_name, 
  COUNT(*) as row_count 
FROM news
UNION ALL
SELECT 
  'qa_pairs' as table_name, 
  COUNT(*) as row_count 
FROM qa_pairs
UNION ALL
SELECT 
  'prayer_times' as table_name, 
  COUNT(*) as row_count 
FROM prayer_times
UNION ALL
SELECT 
  'imam_messages' as table_name, 
  COUNT(*) as row_count 
FROM imam_messages;
