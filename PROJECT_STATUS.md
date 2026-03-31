# 🎯 Проект: Hazratnavoi.uz

**Дата:** 2026-03-31
**Статус:** ✅ Backend настроен, готов к интеграции

---

## ✅ Выполнено

### 1. Vercel Деплой
- [x] Проект создан и привязан
- [x] Деплой выполнен: https://hazratnavoi-uz.vercel.app
- [x] Домен `hazratnavoi.uz` добавлен
- [ ] Ожидается настройка DNS в Cloudflare (A-запись: 76.76.21.21)

### 2. Supabase База данных
- [x] Клиент Supabase установлен (`@supabase/supabase-js`)
- [x] Project URL: `https://rbmkdwkbdvglekouekik.supabase.co`
- [x] Anon ключ добавлен в `.env.local`
- [ ] Ожидается вставка `service_role` ключа в `.env.local`
- [x] Созданы типы TypeScript для БД
- [x] Написаны хуки для работы с данными:
  - `use-news()` — новости
  - `use-qa()` — вопросы-ответы
  - `use-prayer-times()` — время намаза
  - `use-imam-messages()` — сообщения имама
- [x] Создан SQL миграционный файл
- [ ] Ожидается выполнение SQL в Supabase Dashboard

### 3. Файловая структура
- [x] `/lib/supabase/client.ts` — клиент для браузера
- [x] `/lib/supabase/server.ts` — админ-клиент (service role)
- [x] `/lib/supabase/types.ts` — TypeScript типы
- [x] `/lib/supabase/migrations/001_create_tables.sql` — схема БД
- [x] `/hooks/use-*.ts` — React хуки

### 4. Документация
- [x] `README.md` — основная документация проекта
- [x] `SUPABASE_SETUP.md` — инструкция по настройке Supabase
- [x] `TELEGRAM_BOT.md` — инструкция по настройке Telegram-бота
- [x] `PROJECT_STATUS.md` — этот файл

---

## ⏳ Следующие шаги

### Приоритет 1 — Настройка Supabase

1. **Вставить Service Role Key** в `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=ваш_ключ
   ```

2. **Выполнить SQL миграцию** в Supabase Dashboard:
   - Открыть SQL Editor
   - Вставить содержимое `lib/supabase/migrations/001_create_tables.sql`
   - Нажать Run

3. **Проверить таблицы** в Table Editor:
   - `news`
   - `qa_pairs`
   - `prayer_times`
   - `imam_messages`

4. **Добавить тестовые данные** (опционально):
   ```sql
   -- Время намаза на сегодня
   INSERT INTO prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha)
   VALUES (CURRENT_DATE, '05:15:00', '06:45:00', '12:30:00', '15:45:00', '18:15:00', '19:45:00');
   ```

### Приоритет 2 — Интеграция с Frontend

1. **Обновить компоненты** для использования хуков:
   - `news-section.tsx` → `useNews()`
   - `qa-section.tsx` → `useQA()`
   - `hero-section.tsx` → `usePrayerTimes()`
   - `imam-section.tsx` → `useImamMessages()`

2. **Проверить работу** на локальном сервере:
   ```bash
   npm run dev
   ```

3. **Задеплоить обновления**:
   ```bash
   git add . && git commit -m "Integrate Supabase" && git push
   ```

### Приоритет 3 — Telegram-бот

1. **Создать бота** через @BotFather
2. **Получить токен** и Chat ID администратора
3. **Создать папку** `telegram-bot/` с кодом бота
4. **Протестировать** команды `/news`, `/qa`, `/prayer`

### Приоритет 4 — DNS и домен

1. **Настроить DNS** в Cloudflare:
   - A-запись: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

2. **Проверить верификацию** домена

---

## 📦 Переменные окружения

### `.env.local` (локально)

```bash
# Vercel (уже есть)
VERCEL_OIDC_TOKEN=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rbmkdwkbdvglekouekik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=❌ ВСТАВИТЬ
```

### Vercel Environment Variables

Нужно добавить в Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Или выполнить:
```bash
vercel env pull
```

---

## 🎨 Визуальный стиль

### Цвета
- **Изумрудно-зелёный:** `#166534` (emerald-800)
- **Сапфирово-синий:** `#1e3a8a` (blue-900)
- **Фон:** Чистый белый `#ffffff`

### Шрифты
- **Заголовки:** Playfair Display (serif)
- **Текст:** Inter (sans-serif)

### Эффекты
- Glassmorphism для карточек
- Много "воздуха" (whitespace)
- Плавные анимации

---

## 📞 Контакты

**Разработка:** [Ваш контакт]
**Администратор:** Хаёт ака
**Имам-хатиб:** Темуржон домла Атоев

---

## 📅 Timeline

| Дата | Событие |
|------|---------|
| 2026-03-31 | ✅ Vercel деплой, ✅ Supabase настройка |
| 2026-04-01 | ⏳ Настройка DNS, интеграция хуков |
| 2026-04-02 | ⏳ Telegram-бот |
| 2026-04-03 | ⏳ Тестирование и запуск |

---

**Ин ша Аллоҳ!** 🤲
