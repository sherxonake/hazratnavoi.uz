// @hazratnavoiy_bot webhook — admin boti
// Admin shu bot orqali savollarni oladi va /answer bilan javob beradi

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const USER_BOT_TOKEN = process.env.TELEGRAM_2FA_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sendAdmin(text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text, parse_mode: 'HTML' }),
  })
}

async function sendUser(chatId: string | number, text: string) {
  await fetch(`https://api.telegram.org/bot${USER_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const msg = body.message
    if (!msg) return NextResponse.json({ ok: true })

    const chatId = String(msg.chat.id)
    const text: string = msg.text || ''

    // Faqat admin xabarlarini qabul qilamiz
    if (chatId !== ADMIN_CHAT_ID) return NextResponse.json({ ok: true })

    // /start
    if (text === '/start') {
      await sendAdmin(
        '🕌 <b>Hazratnavoi.uz — Устоз боти</b>\n\n' +
        'Форумдан саволлар шу ерга келади.\n\n' +
        '📝 Жавоб бериш:\n<code>/answer SAVOL_ID javob matni</code>\n\n' +
        '📋 Сайт орқали жавоб:\nhttps://hazratnavoi-uz.vercel.app/ustoz'
      )
      return NextResponse.json({ ok: true })
    }

    // /pending — javobsiz savollar ro'yxati
    if (text === '/pending') {
      const { data } = await supabase
        .from('forum_questions')
        .select('id, user_name, question, created_at')
        .is('answer', null)
        .order('created_at', { ascending: true })
        .limit(10)

      if (!data || data.length === 0) {
        await sendAdmin('✅ Жавобсиз саволлар йўқ!')
        return NextResponse.json({ ok: true })
      }

      const list = data.map((q, i) =>
        `${i + 1}. <b>${q.user_name}</b>\n❓ ${q.question.slice(0, 100)}...\n<code>/answer ${q.id} ЖАВОБ</code>`
      ).join('\n\n')

      await sendAdmin(`📋 <b>Жавобсиз саволлар (${data.length} та):</b>\n\n${list}`)
      return NextResponse.json({ ok: true })
    }

    // /answer <id> <javob>
    if (text.startsWith('/answer ')) {
      const spaceIdx = text.indexOf(' ', 8)
      if (spaceIdx === -1) {
        await sendAdmin('❌ Format: <code>/answer SAVOL_ID javob matni</code>')
        return NextResponse.json({ ok: true })
      }

      const questionId = text.slice(8, spaceIdx).trim()
      const answer = text.slice(spaceIdx + 1).trim()

      if (!questionId || !answer) {
        await sendAdmin('❌ Format: <code>/answer SAVOL_ID javob matni</code>')
        return NextResponse.json({ ok: true })
      }

      const { data: question } = await supabase
        .from('forum_questions')
        .select('*, site_users(telegram_chat_id, name)')
        .eq('id', questionId)
        .single()

      if (!question) {
        await sendAdmin(`❌ Savol topilmadi: <code>${questionId}</code>`)
        return NextResponse.json({ ok: true })
      }

      // Javobni saqlash
      await supabase.from('forum_questions').update({
        answer,
        answered_at: new Date().toISOString(),
        answered_by: 'Имом-хатиб Темурхон домла Атоев',
        published: true,
      }).eq('id', questionId)

      // Foydalanuvchiga @hazratnavoiy2fa_bot orqali xabar
      const userChatId = question.site_users?.telegram_chat_id
      if (userChatId) {
        await sendUser(userChatId,
          `🕌 <b>Hazratnavoi.uz</b>\n\nСаволингизга жавоб:\n\n` +
          `❓ <i>${question.question}</i>\n\n` +
          `✅ <b>Жавоб:</b>\n${answer}\n\n` +
          `— Имом-хатиб Темурхон домла Атоев`
        )
      }

      await sendAdmin(
        `✅ Жавоб юборилди!\n\n` +
        `👤 ${question.user_name}\n` +
        `❓ ${question.question.slice(0, 80)}\n\n` +
        `✏️ ${answer}`
      )

      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('admin-bot-webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
