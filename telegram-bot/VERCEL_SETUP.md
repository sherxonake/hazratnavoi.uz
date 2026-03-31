# 🤖 Настройка Telegram бота в Vercel

## ⚠️ ВАЖНО!

Бот не работает, потому что переменные окружения не добавлены в Vercel!

---

## ✅ Способ 1: Через Vercel Dashboard (рекомендуется)

### Шаг 1: Откройте Vercel Dashboard

Перейдите: https://vercel.com/serhon618-6221s-projects/hazratnavoi-uz/settings/environment-variables

### Шаг 2: Добавьте переменные

Нажмите **Add New** и добавьте:

| Name | Value | Target |
|------|-------|--------|
| `TELEGRAM_BOT_TOKEN` | `8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM` | Production, Development, Preview |
| `ADMIN_CHAT_ID` | `5232481462` | Production, Development, Preview |

### Шаг 3: Сохраните

Нажмите **Save**

### Шаг 4: Перезадеплойте

```bash
cd /Users/wer/projects/ustoz/src/hazratnavoi.uz
vercel --prod --yes
```

---

## ✅ Способ 2: Через Vercel CLI

```bash
cd /Users/wer/projects/ustoz/src/hazratnavoi.uz

# Добавьте переменные
vercel env add TELEGRAM_BOT_TOKEN 8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM
vercel env add ADMIN_CHAT_ID 5232481462

# Перезадеплойте
vercel --prod --yes
```

---

## ✅ Проверка

### 1. Проверьте webhook:

```bash
curl -X POST "https://api.telegram.org/bot8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM/getWebhookInfo"
```

**Ожидаемый ответ:**
```json
{
  "ok": true,
  "result": {
    "url": "https://hazratnavoi-uz.vercel.app/api/telegram-webhook",
    "pending_update_count": 0
  }
}
```

### 2. Проверьте бота:

Откройте Telegram и отправьте боту `/start`

**Ожидаемый ответ:**
```
🕌 HazratNavoi Admin Bot

Ассаламу алайкум, Ҳаёт ака!

Мавжуд команда лар:
/news - Янгилик қўшиш
/prayer - Намоз вақтларини янгилаш
/qa - Савол-жавоб қўшиш
/help - Ёрдам

Бот ҳолати: 🟢 Ишламоқда (Vercel)
```

---

## 🔧 Если бот всё равно не работает:

### 1. Проверьте логи Vercel:

```bash
cd /Users/wer/projects/ustoz/src/hazratnavoi.uz
vercel logs
```

### 2. Проверьте API роут:

```bash
curl -X POST https://hazratnavoi-uz.vercel.app/api/telegram-webhook \
  -H "Content-Type: application/json" \
  -d '{"update":{"message":{"chat":{"id":5232481462},"text":"/start"}}}'
```

**Ожидаемый ответ:** `{"ok":true}`

### 3. Удалите и заново установите webhook:

```bash
# Удалить webhook
curl -X POST "https://api.telegram.org/bot8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM/deleteWebhook"

# Установить заново
curl -X POST "https://api.telegram.org/bot8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM/setWebhook?url=https://hazratnavoi-uz.vercel.app/api/telegram-webhook"
```

---

**После настройки переменных — бот заработает!** 🚀
