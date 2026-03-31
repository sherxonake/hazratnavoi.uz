# 🧪 Тестирование подключения к Supabase

## ✅ Что создано:

### API роуты для тестирования:

| Роут | Описание | Доступ |
|------|----------|--------|
| `/api/test-db` | Проверка подключения (anon ключ) | Публичный |
| `/api/test-admin-db` | Проверка подключения (service role) | Публичный |

---

## 🚀 Как запустить тест:

### Вариант 1: Локальное тестирование

1. **Запустите dev-сервер:**
   ```bash
   cd /Users/wer/projects/ustoz/src/hazratnavoi.uz
   npm run dev
   ```

2. **Откройте в браузере:**
   - http://localhost:3000/api/test-db
   - http://localhost:3000/api/test-admin-db

3. **Ожидаемый результат:**
   ```json
   {
     "status": "success",
     "message": "Supabase connected successfully",
     "details": {
       "news_count": 1,
       "timestamp": "2026-03-31T..."
     }
   }
   ```

---

### Вариант 2: Тестирование production

1. **Откройте в браузере:**
   - https://hazratnavoi.uz/api/test-db
   - https://hazratnavoi.uz/api/test-admin-db

2. **Или через curl:**
   ```bash
   curl https://hazratnavoi.uz/api/test-db
   curl https://hazratnavoi.uz/api/test-admin-db
   ```

---

## 📊 SQL для создания таблиц

### Шаг 1: Откройте Supabase SQL Editor

Перейдите по ссылке:
https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/sql/new

### Шаг 2: Выполните SQL

Скопируйте и вставьте содержимое файла:
```
lib/supabase/migrations/002_full_schema.sql
```

Или выполните по частям:

```sql
-- 1. Создайте таблицы
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

CREATE TABLE IF NOT EXISTS qa_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS imam_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);
```

### Шаг 3: Проверьте таблицы

В Supabase Dashboard перейдите в **Table Editor** и убедитесь, что созданы:
- ✅ `news`
- ✅ `prayer_times`
- ✅ `qa_pairs`
- ✅ `imam_messages`

---

## 🔍 Проверка данных

### Через Supabase Dashboard:

1. **Table Editor** → Выберите таблицу
2. Убедитесь, что данные есть:
   - `news`: 1 запись (тестовая новость)
   - `qa_pairs`: 5 записей (вопросы-ответы)
   - `prayer_times`: 1 запись (сегодняшняя дата)
   - `imam_messages`: 0 записей (пока пусто)

### Через SQL запрос:

```sql
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
```

---

## ❌ Возможные ошибки и решения

### Ошибка: "Database connection failed"

**Причина:** Неверные переменные окружения

**Решение:**
1. Проверьте `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://rbmkdwkbdvglekouekik.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Обновите переменные в Vercel:
   ```bash
   vercel env pull
   vercel --prod
   ```

---

### Ошибка: "relation 'news' does not exist"

**Причина:** Таблицы ещё не созданы в Supabase

**Решение:** Выполните SQL из файла `002_full_schema.sql`

---

### Ошибка: "permission denied"

**Причина:** RLS политики блокируют доступ

**Решение:** Убедитесь, что выполнены SQL команды для создания POLICIES из файла миграции

---

## 📝 Чек-лист проверки

- [ ] Переменные окружения в `.env.local` заполнены
- [ ] SQL миграция выполнена в Supabase
- [ ] Таблицы видны в Table Editor
- [ ] Тестовые данные добавлены
- [ ] `/api/test-db` возвращает `status: "success"`
- [ ] `/api/test-admin-db` возвращает `status: "success"`
- [ ] Production сайт работает: https://hazratnavoi.uz

---

## 🎯 Следующие шаги

После успешного тестирования:

1. **Интегрировать хуки во фронтенд:**
   - `components/news-section.tsx` → `useNews()`
   - `components/qa-section.tsx` → `useQA()`
   - `components/hero-section.tsx` → `usePrayerTimes()`

2. **Создать Telegram-бота** для управления контентом

3. **Настроить DNS** для домена `hazratnavoi.uz`

---

**Создано:** 2026-03-31
**Статус:** Готово к тестированию
