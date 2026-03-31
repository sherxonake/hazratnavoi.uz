# Fly.io Deployment Guide

## Шаг 1: Авторизация в Fly.io

```bash
fly auth login
```

Откроется браузер — войдите через GitHub или email.

## Шаг 2: Инициализация приложения

```bash
cd /Users/wer/projects/ustoz/telegram-bot
fly launch --no-deploy
```

- **App name:** hazratnavoi-bot (или другое уникальное)
- **Region:** fra (Frankfurt) — ближе к Узбекистану
- **PostgreSQL:** No
- **Redis:** No

## Шаг 3: Настройка переменных окружения

```bash
fly secrets set TELEGRAM_BOT_TOKEN=8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM
fly secrets set ADMIN_CHAT_ID=5232481462
fly secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Шаг 4: Деплой

```bash
fly deploy
```

## Шаг 5: Проверка

```bash
fly logs --app hazratnavoi-bot
```

## Шаг 6: Тестирование бота

Откройте Telegram и найдите своего бота.
Отправьте `/start` — бот должен ответить!

---

## Полезные команды:

```bash
# Просмотр логов
fly logs --app hazratnavoi-bot

# Перезапуск
fly restart --app hazratnavoi-bot

# Остановка
fly apps stop hazratnavoi-bot

# Запуск
fly apps start hazratnavoi-bot

# Информация о приложении
fly status --app hazratnavoi-bot
```

---

## Тарифы Fly.io:

- **Бесплатно:** 3 VM с shared CPU (256MB RAM)
- **Платно:** от $1.94/месяц за VM

---

**Создано:** 2026-03-31
