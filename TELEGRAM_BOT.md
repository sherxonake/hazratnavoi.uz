# Telegram Bot для администратора — Hazratnavoi.uz

## 🤖 Описание

Telegram-бот для быстрого управления контентом сайта hazratnavoi.uz через Telegram.

**Администратор:** Хаёт ака
**Цель:** Публикация новостей, вопросов-ответов и времени намаза без доступа к админ-панели

---

## 📋 Функционал

### Команды бота:

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие и инструкция |
| `/news` | Опубликовать новость (фото + текст) |
| `/qa` | Добавить вопрос-ответ |
| `/prayer` | Обновить время намаза |
| `/imam` | Добавить сообщение имама |
| `/help` | Справка по командам |

---

## 🔧 Настройка

### 1. Создание бота в Telegram

1. Откройте [@BotFather](https://t.me/BotFather)
2. Отправьте `/newbot`
3. Введите имя: `Hazratnavoi Admin Bot`
4. Введите username: `hazratnavoi_admin_bot`
5. Скопируйте **API Token** (сохраните в секрете!)

### 2. Получение Chat ID администратора

1. Откройте созданного бота
2. Отправьте любое сообщение
3. Перейдите по ссылке:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. Найдите `"chat":{"id":123456789}` — это ваш Chat ID

### 3. Установка переменных окружения

Создайте файл `.env` в папке `telegram-bot/`:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
ADMIN_CHAT_ID=your_chat_id_here
SUPABASE_URL=https://rbmkdwkbdvglekouekik.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🚀 Запуск

```bash
cd telegram-bot
npm install
npm run dev
```

---

## 📁 Структура файлов бота

```
telegram-bot/
├── src/
│   ├── bot.ts          # Основная логика бота
│   ├── commands/
│   │   ├── news.ts     # Команда /news
│   │   ├── qa.ts       # Команда /qa
│   │   └── prayer.ts   # Команда /prayer
│   └── utils/
│       └── supabase.ts # Supabase клиент
├── .env
├── package.json
└── tsconfig.json
```

---

## 🔐 Безопасность

- Бот проверяет Chat ID перед выполнением команд
- `SUPABASE_SERVICE_ROLE_KEY` хранится только в `.env`
- Доступ только у авторизованного администратора

---

**Создано:** 2026-03-31
**Статус:** Ожидает настройки
