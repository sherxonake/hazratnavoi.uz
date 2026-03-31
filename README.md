# Hazratnavoi.uz — Официальный сайт Главной соборной мечети Навоийской области

[![Vercel](https://vercelbadge.vercel.app/api/serhon618-6221s-projects/hazratnavoi-uz)](https://hazratnavoi-uz.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green?logo=supabase)](https://supabase.com)

---

## 🕌 О проекте

Официальный веб-сайт Главной соборной мечети Навоийской области Узбекистана.

**Миссия:** Предоставить прихожанам удобный доступ к информации о времени намаза, новостях мечети, проповедях имама и ответах на религиозные вопросы.

---

## ✨ Особенности

- 🎨 **Премиальный дизайн** — современный, светлый, с уважением к исламским традициям
- ⚡ **Быстрый** — Next.js 16 + Vercel Edge Network
- 📱 **Адаптивный** — отлично работает на всех устройствах
- 🌐 **Двуязычный** — узбекский (Лотиница ↔ Кириллица)
- 📊 **Real-time** — живое время намаза с таймером обратного отсчёта
- 🔐 **Безопасный** — Supabase RLS, валидация данных

---

## 🚀 Технологический стек

| Компонент | Технология |
|-----------|------------|
| **Фреймворк** | Next.js 16 (App Router) |
| **Язык** | TypeScript |
| **React** | 19 |
| **Стилизация** | Tailwind CSS v4 |
| **Компоненты** | Radix UI / shadcn/ui |
| **База данных** | Supabase (PostgreSQL) |
| **Деплой** | Vercel |
| **Аналитика** | Vercel Analytics |

---

## 📁 Структура проекта

```
ustoz/
├── src/hazratnavoi.uz/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # React компоненты
│   │   ├── header.tsx
│   │   ├── hero-section.tsx
│   │   ├── imam-section.tsx
│   │   ├── heritage-section.tsx
│   │   ├── news-section.tsx
│   │   ├── qa-section.tsx
│   │   └── footer.tsx
│   ├── hooks/                  # Custom React хуки
│   │   ├── use-news.ts
│   │   ├── use-qa.ts
│   │   ├── use-prayer-times.ts
│   │   └── use-imam-messages.ts
│   ├── lib/                    # Утилиты и конфигурации
│   │   └── supabase/
│   │       ├── client.ts
│   │       ├── server.ts
│   │       ├── types.ts
│   │       └── migrations/
│   │           └── 001_create_tables.sql
│   ├── public/                 # Статические файлы
│   └── styles/                 # Глобальные стили
├── SUPABASE_SETUP.md          # Инструкция по настройке Supabase
├── TELEGRAM_BOT.md            # Инструкция по настройке Telegram-бота
└── README.md                  # Этот файл
```

---

## 🛠️ Установка и запуск

### Требования

- Node.js 20+
- npm или bun
- Supabase аккаунт
- Vercel аккаунт

### 1. Клонирование

```bash
cd /Users/wer/projects/ustoz/src/hazratnavoi.uz
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Запуск в режиме разработки

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

### 5. Сборка для production

```bash
npm run build
npm start
```

---

## 📊 База данных (Supabase)

### Таблицы

| Таблица | Описание |
|---------|----------|
| `news` | Новости мечети |
| `qa_pairs` | Вопросы и ответы |
| `prayer_times` | Время намаза |
| `imam_messages` | Сообщения имама |

### Настройка

См. подробную инструкцию в [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

## 🤖 Telegram-бот

Для удобного управления контентом через Telegram создан специальный бот.

**Команды:**
- `/news` — Опубликовать новость
- `/qa` — Добавить вопрос-ответ
- `/prayer` — Обновить время намаза
- `/imam` — Добавить сообщение имама

См. инструкцию в [TELEGRAM_BOT.md](./TELEGRAM_BOT.md)

---

## 🌐 Деплой

Проект задеплоен на Vercel:

- **Production:** https://hazratnavoi-uz.vercel.app
- **Домен:** https://hazratnavoi.uz (ожидает настройки DNS)

### Обновление через Git

```bash
git add .
git commit -m "Описание изменений"
git push
```

Vercel автоматически задеплоит изменения.

---

## 📝 Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка production |
| `npm start` | Запуск production сервера |
| `npm run lint` | ESLint проверка |

---

## 👥 Команда

- **Разработка:** [Ваше имя/статус]
- **Администратор:** Хаёт ака
- **Имам-хатиб:** Темуржон домла Атоев

---

## 📞 Контакты

**Мечеть:** Главная соборная мечеть Навоийской области
**Адрес:** г. Навои, Узбекистан
**Сайт:** https://hazratnavoi.uz

---

## 📜 Лицензия

© 2026 Hazratnavoi.uz. Все права защищены.

---

**Создано:** 2026-03-31
**Обновлено:** 2026-03-31
