// @hazratnavoiy2fa_bot webhook
// 1. /start → foydalanuvchi telefon raqamini so'raydi
// 2. Telefon kelganda → DB ga yozadi (phone → chat_id)
// 3. Admin /reply <question_id> <javob> → foydalanuvchiga javob yuboradi

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_2FA_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendMessage(chatId: number | string, text: string, extra?: object) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', ...extra }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const msg = body.message
    if (!msg) return NextResponse.json({ ok: true })

    const chatId = msg.chat.id
    const text: string = msg.text || ''
    const contact = msg.contact

    // /start — telefon raqamini so'raymiz
    if (text === '/start') {
      await sendMessage(chatId,
        '🕌 <b>Hazratnavoi.uz</b> saytiga xush kelibsiz!\n\n' +
        'Ro\'yxatdan o\'tish uchun telefon raqamingizni ulashing:',
        {
          reply_markup: {
            keyboard: [[{ text: '📱 Telefon raqamni ulashish', request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          }
        }
      )
      return NextResponse.json({ ok: true })
    }

    // Telefon kontakt keldi
    if (contact && contact.phone_number) {
      let phone = contact.phone_number.replace(/\D/g, '')
      if (!phone.startsWith('998')) {
        await sendMessage(chatId, '❌ Faqat O\'zbekiston (+998) raqamlari qabul qilinadi.')
        return NextResponse.json({ ok: true })
      }
      phone = '+' + phone

      // DB ga saqlash: phone → telegram_chat_id
      await supabase.from('site_users').upsert(
        { phone, telegram_chat_id: chatId },
        { onConflict: 'phone' }
      )

      // OTP kodni yaratish va yuborish
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 daqiqa

      await supabase.from('otp_codes').insert({
        phone,
        code,
        telegram_chat_id: chatId,
        expires_at: expiresAt,
      })

      await sendMessage(chatId,
        `✅ Raqamingiz qabul qilindi: <b>${phone}</b>\n\n` +
        `🔐 Tasdiqlash kodi: <b>${code}</b>\n\n` +
        `⏱ Kod 5 daqiqa amal qiladi.\n` +
        `Kodni saytga kiriting.`,
        { reply_markup: { remove_keyboard: true } }
      )

      return NextResponse.json({ ok: true })
    }

    // Admin: /answer <question_id> <text>
    if (String(chatId) === ADMIN_CHAT_ID && text.startsWith('/answer ')) {
      const parts = text.split(' ')
      const questionId = parts[1]
      const answer = parts.slice(2).join(' ')

      if (!questionId || !answer) {
        await sendMessage(chatId, '❌ Format: /answer <question_id> <javob matni>')
        return NextResponse.json({ ok: true })
      }

      // Savolni topib javob saqlaymiz
      const { data: question } = await supabase
        .from('forum_questions')
        .select('*, site_users(telegram_chat_id, name)')
        .eq('id', questionId)
        .single()

      if (!question) {
        await sendMessage(chatId, '❌ Savol topilmadi: ' + questionId)
        return NextResponse.json({ ok: true })
      }

      await supabase.from('forum_questions').update({
        answer,
        answered_at: new Date().toISOString(),
        answered_by: 'Имом-хатиб',
        published: true,
      }).eq('id', questionId)

      // Foydalanuvchiga javob yuborish
      const userChatId = question.site_users?.telegram_chat_id
      if (userChatId) {
        await sendMessage(userChatId,
          `🕌 <b>Hazratnavoi.uz</b> — Саволингизга жавоб\n\n` +
          `❓ <i>${question.question}</i>\n\n` +
          `✅ <b>Жавоб:</b>\n${answer}\n\n` +
          `— Имом-хатиб Темурхон домла Атоев`
        )
      }

      await sendMessage(chatId, '✅ Жавоб юборилди ва сайтда чоп этилди.')
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('user-bot-webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
