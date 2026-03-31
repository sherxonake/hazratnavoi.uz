#!/bin/bash

# Автоматическое добавление переменных в Vercel

echo "🔧 Добавление переменных окружения в Vercel..."

# TELEGRAM_BOT_TOKEN
echo "📤 Добавляем TELEGRAM_BOT_TOKEN..."
vercel env add TELEGRAM_BOT_TOKEN 8667990988:AAFNcPpDbpXC5utsMcuJEpYM5jN2cXGwHVM

# ADMIN_CHAT_ID
echo "📤 Добавляем ADMIN_CHAT_ID..."
vercel env add ADMIN_CHAT_ID 5232481462

echo "✅ Переменные добавлены!"
echo "🚀 Теперь выполните: vercel --prod --yes"
