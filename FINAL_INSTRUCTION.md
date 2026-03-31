# 🎉 HAZRATNAVOI.UZ — ФИНАЛ ИНСТРУКЦИЯ

**Сана:** 2026-03-31
**Ҳолат:** ✅ Готов к использованию

---

## ✅ ЧТО ГОТОВО:

### 1. 🕌 Сайт
- ✅ Splash Screen с Бисмиллях и логотипом
- ✅ Главная страница с временем намаза
- ✅ Новости из Supabase
- ✅ Савол-жавоб раздел
- ✅ Имом минбари раздел

### 2. 🔐 Админ-панель
- ✅ Аутентификация (admin / xazrat123)
- ✅ Добавление новостей с фото
- ✅ Управление намоз вақтлари
- ✅ Управление савол-жавоб
- ✅ Статистика

### 3. 📊 База данных (Supabase)
- ✅ Таблицы: news, qa_pairs, prayer_times, imam_messages
- ✅ RLS политики безопасности
- ✅ Готовые данные

### 4. 📁 GitHub
- ✅ Репозиторий: https://github.com/sherxonake/hazratnavoi.uz
- ✅ Все файлы закоммичены

### 5. 🌐 Vercel
- ✅ Деплой: https://hazratnavoi-uz.vercel.app
- ✅ Автоматический деплой при пуше

---

## 📋 СЛЕДУЮЩИЕ ШАГИ:

### 1. Настроить Supabase Storage (10 минут)

**Инструкция:** SUPABASE_STORAGE_SETUP.md

**Кратко:**
1. Откройте https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/storage
2. Создайте bucket `hazratnavoi-images` (public, 5MB)
3. Выполните SQL из `lib/supabase/migrations/003_storage_setup.sql`

---

### 2. Добавить реальные данные (30 минут)

**Инструкция:**

1. Откройте https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/sql/new
2. Скопируйте содержимое `lib/supabase/migrations/004_seed_data.sql`
3. Нажмите **Run**

**Или через админку:**
1. Откройте https://hazratnavoi-uz.vercel.app/admin
2. Войдите: `admin` / `xazrat123`
3. Добавьте новости, намоз вақтлари, савол-жавоб

---

### 3. Проверить сайт (5 минут)

1. Откройте https://hazratnavoi-uz.vercel.app
2. Проверите:
   - ✅ Splash Screen (3-4 секунды)
   - ✅ Время намаза (из Supabase)
   - ✅ Новости (из Supabase)
   - ✅ Савол-жавоб (из Supabase)

---

### 4. Telegram-бот (опционально)

**Проблема:** Vercel блокирует webhook из Узбекистана

**Решение:** Деплой на Railway.app

**Инструкция:** telegram-bot/DEPLOY.md

---

## 🔐 ДОСТУПЫ:

### Админ-панель:
- **URL:** https://hazratnavoi-uz.vercel.app/admin/login
- **Логин:** `admin`
- **Пароль:** `xazrat123`

### Supabase:
- **URL:** https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik
- **Email:** ваш email
- **Пароль:** ваш пароль

### Vercel:
- **URL:** https://vercel.com/serhon618-6221s-projects/hazratnavoi-uz
- **Email:** ваш email

---

## 📁 СТРУКТУРА ПРОЕКТА:

```
ustoz/
├── src/hazratnavoi.uz/
│   ├── app/
│   │   ├── admin/           # Админ-панель
│   │   │   ├── login/       # Страница входа
│   │   │   ├── news/        # Добавление новостей
│   │   │   ├── prayer-times/# Намоз вақтлари
│   │   │   └── qa/          # Савол-жавоб
│   │   └── api/             # API роуты
│   ├── components/          # React компоненты
│   ├── hooks/               # React хуки
│   └── lib/supabase/        # Supabase клиент
├── telegram-bot/            # Telegram бот
└── *.md                     # Документация
```

---

## 🎯 ССЫЛКИ:

| Что | Ссылка |
|-----|--------|
| **Сайт** | https://hazratnavoi-uz.vercel.app |
| **Админка** | https://hazratnavoi-uz.vercel.app/admin/login |
| **GitHub** | https://github.com/sherxonake/hazratnavoi.uz |
| **Supabase** | https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik |
| **Vercel** | https://vercel.com/serhon618-6221s-projects/hazratnavoi-uz |

---

## ⚠️ ВАЖНО:

### Безопасность:
1. Смените пароль администратора в production
2. Не коммитьте `.env` файлы в Git
3. Используйте Supabase Auth для production

### Контент:
1. Добавьте реальные новости через админку
2. Обновите время намаза на актуальное
3. Заполните савол-жавоб раздел

### Домен:
1. Настройте DNS для `hazratnavoi.uz`
2. A-запись: `@` → `76.76.21.21`
3. CNAME: `www` → `cname.vercel-dns.com`

---

## 📞 ПОДДЕРЖКА:

Если возникли вопросы:
1. Проверьте документацию в папке проекта
2. Supabase Docs: https://supabase.com/docs
3. Vercel Docs: https://vercel.com/docs
4. Next.js Docs: https://nextjs.org/docs

---

**Ин ша Аллоҳ! Сайт готов к использованию!** 🤲

**Баракотли бўлсин!** 🎉
