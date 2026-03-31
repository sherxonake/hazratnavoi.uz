# 🔄 Автоматическое выполнение миграций Supabase

## Инструкция:

### Шаг 1: Откройте Supabase Dashboard

Перейдите: https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik/sql/new

### Шаг 2: Выполните SQL для Storage

1. Скопируйте содержимое файла: `003_storage_setup.sql`
2. Вставьте в SQL Editor
3. Нажмите **Run** (Ctrl+Enter)

**Ожидаемый результат:**
- ✅ Бакет `hazratnavoi-images` создан
- ✅ RLS политики добавлены

---

### Шаг 3: Выполните SQL для данных

1. Скопируйте содержимое файла: `004_seed_data.sql`
2. Вставьте в SQL Editor
3. Нажмите **Run** (Ctrl+Enter)

**Ожидаемый результат:**
- ✅ 7 записей в `prayer_times`
- ✅ 5 записей в `news`
- ✅ 8 записей в `qa_pairs`
- ✅ 1 запись в `imam_messages`

---

## ✅ Проверка:

### 1. Проверьте бакет:

```sql
SELECT * FROM storage.buckets WHERE id = 'hazratnavoi-images';
```

**Должно вернуть:** 1 строка

### 2. Проверьте данные:

```sql
SELECT 'news' as table_name, COUNT(*) as count FROM news
UNION ALL
SELECT 'qa_pairs', COUNT(*) FROM qa_pairs
UNION ALL
SELECT 'prayer_times', COUNT(*) FROM prayer_times
UNION ALL
SELECT 'imam_messages', COUNT(*) FROM imam_messages;
```

**Должно вернуть:**
- news: 5
- qa_pairs: 8
- prayer_times: 7
- imam_messages: 1

---

## ⚠️ Если ошибка "syntax error":

1. Убедитесь что копируете **весь** файл целиком
2. Проверьте что нет лишних символов в начале
3. Выполняйте каждый файл **отдельно**

---

**После выполнения — сайт будет с реальными данными!** 🎉
