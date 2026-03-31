# Supabase Настройка — Hazratnavoi.uz

## 📋 Шаг 1: Создание таблиц в Supabase

1. Зайдите в [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите проект: `rbmkdwkbdvglekouekik`
3. Перейдите в **SQL Editor** (левое меню)
4. Нажмите **New Query**
5. Скопируйте и вставьте содержимое файла:
   ```
   lib/supabase/migrations/001_create_tables.sql
   ```
6. Нажмите **Run** (или Ctrl+Enter)

✅ Таблицы созданы!

---

## 🔐 Шаг 2: Вставьте Service Role Key

Откройте файл `.env.local` и замените:

```bash
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
```

На ваш реальный ключ из Supabase:

1. Settings → API → **Project API keys**
2. Скопируйте `service_role` ключ (секретный!)
3. Вставьте в `.env.local`

⚠️ **Никогда не коммитьте `service_role` ключ в Git!**

---

## 📊 Шаг 3: Проверка таблиц

В Supabase Dashboard перейдите в **Table Editor** и убедитесь, что созданы:

- ✅ `news` — Новости
- ✅ `qa_pairs` — Вопросы и ответы
- ✅ `prayer_times` — Время намаза
- ✅ `imam_messages` — Сообщения имама

---

## 🤖 Шаг 4: Создание администратора для Telegram-бота

Для работы Telegram-бота нужно создать пользователя в Supabase:

### Вариант A: Через Dashboard (рекомендуется)

1. **Authentication** → **Users** → **Add User**
2. Введите email: `admin@hazratnavoi.uz`
3. Введите пароль: (сложный пароль, сохраните!)
4. Нажмите **Create User**
5. Скопируйте **User UID** (понадобится для бота)

### Вариант B: Через SQL Editor

```sql
-- Создадим администратора
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
VALUES (
  'admin@hazratnavoi.uz',
  crypt('ВАШ_ПАРОЛЬ', gen_salt('bf')),
  NOW(),
  'authenticated'
);
```

---

## 📝 Шаг 5: Добавление тестовых данных

### Время намаза (пример на сегодня)

```sql
INSERT INTO prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha)
VALUES (
  CURRENT_DATE,
  '05:15:00',
  '06:45:00',
  '12:30:00',
  '15:45:00',
  '18:15:00',
  '19:45:00'
);
```

### Новости (пример)

```sql
INSERT INTO news (title, content, published)
VALUES (
  'Рамазон ойи муборак бўлсин!',
  'Муқаддас Рамазон ойи кириб келди. Барчамизга рўза тутиш, ибодат қилиш насиб этсин.',
  true
);
```

---

## 🔧 Шаг 6: Настройка Vercel Environment Variables

Для production-деплоя нужно добавить переменные в Vercel:

1. Зайдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите проект: `hazratnavoi-uz`
3. **Settings** → **Environment Variables**
4. Добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://rbmkdwkbdvglekouekik.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (ваш anon ключ)
   - `SUPABASE_SERVICE_ROLE_KEY` = (ваш service_role ключ)

Или выполните команду:

```bash
cd /Users/wer/projects/ustoz/src/hazratnavoi.uz
vercel env pull
```

---

## ✅ Проверка

После настройки проверьте:

1. **Фронтенд** — откройте https://hazratnavoi-uz.vercel.app
2. **Данные** — проверьте, что новости и QA отображаются
3. **Время намаза** — должно показывать правильное время

---

## 📞 Контакты для поддержки

Если возникли вопросы:
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs

---

**Создано:** 2026-03-31
**Проект:** Hazratnavoi.uz
