# 📸 Настройка Supabase Storage

## Шаг 1: Откройте Supabase Dashboard

Перейдите: https://supabase.com/dashboard/project/rbmkdwkbdvglekouekik

---

## Шаг 2: Создайте Bucket

1. В левом меню выберите **Storage**
2. Нажмите **New Bucket**
3. Введите:
   - **Bucket name:** `hazratnavoi-images`
   - **Public:** ✅ Включено
   - **File size limit:** `5242880` (5MB)
4. Нажмите **Create bucket**

---

## Шаг 3: Настройте RLS Policies

### 3.1 Откройте SQL Editor

1. В левом меню выберите **SQL Editor**
2. Нажмите **New Query**

### 3.2 Выполните SQL

Скопируйте содержимое файла:
```
lib/supabase/migrations/003_storage_setup.sql
```

Вставьте в SQL Editor и нажмите **Run** (Ctrl+Enter)

---

## Шаг 4: Проверка

### 4.1 Проверьте Bucket

1. Откройте **Storage** → `hazratnavoi-images`
2. Убедитесь, что бакет создан

### 4.2 Проверьте Policies

1. Откройте **Authentication** → **Policies**
2. Найдите политики для `storage.objects`
3. Должны быть:
   - ✅ Public can view images
   - ✅ Authenticated users can upload images
   - ✅ Authenticated users can delete images

---

## Шаг 5: Тестирование загрузки

### Через Админ-панель:

1. Откройте: https://hazratnavoi-uz.vercel.app/admin/news
2. Загрузите фото
3. Добавьте сарлавҳа и матн
4. Нажмите "Чоп этиш"

### Проверьте в Supabase:

1. Откройте **Storage** → `hazratnavoi-images`
2. Должно появиться новое фото

---

## ⚠️ Возможные проблемы:

### Ошибка: "Bucket not found"

**Решение:** Убедитесь, что бакет `hazratnavoi-images` создан

### Ошибка: "Permission denied"

**Решение:** Проверьте RLS политики в SQL Editor

### Фото не загружается

**Решение:**
1. Проверьте размер файла (макс. 5MB)
2. Проверьте формат (JPEG, PNG, WebP)
3. Проверьте логи в Vercel Dashboard

---

**После настройки — фото будут загружаться в Supabase!** 🎉
