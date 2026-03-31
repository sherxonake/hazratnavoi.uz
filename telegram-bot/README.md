# 🤖 Telegram-бот ўрнатиш

## 1. Бот яратиш

1. Telegram'да [@BotFather](https://t.me/BotFather) га киринг
2. `/newbot` командасини юборинг
3. Ном: `Hazratnavoi Admin Bot`
4. Username: `hazratnavoi_admin_bot`
5. **API Token** олинг

## 2. Chat ID олиш

1. Ботга `/start` юборинг
2. Линкни очинг: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. `"chat":{"id":123456789}` қисмидан Chat ID ни олинг

## 3. .env файлини тўлдириш

`telegram-bot/.env` файлини очинг ва тўлдиринг:

```bash
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_CHAT_ID=123456789
SUPABASE_URL=https://rbmkdwkbdvglekouekik.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Ўрнатиш ва ишга тушириш

```bash
cd telegram-bot
npm install
npm run dev
```

## 5. Команда лар

| Команда | Тавсиф |
|---------|--------|
| `/start` | Ботни ишга тушириш |
| `/news` | Янгилик қўшиш |
| `/prayer` | Намоз вақтларини янгилаш |
| `/qa` | Савол-жавоб қўшиш |
| `/help` | Ёрдам |

## 6. Янгилик қўшиш (мисол)

1. `/news` юборинг
2. Сарлавҳа: `Рамазон ойи муборак бўлсин!`
3. Матн: `Муқаддас Рамазон ойи...`
4. Расм юборинг (ёки `/skip`)
5. ✅ Янгилик сайтга қўшилди!

---

**Создано:** 2026-03-31
