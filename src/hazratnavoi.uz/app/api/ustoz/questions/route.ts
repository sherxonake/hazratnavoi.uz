import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'hazratnavoi-secret-key-2026')
const BOT_TOKEN = process.env.TELEGRAM_2FA_BOT_TOKEN!
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function verifyUstoz(req: NextRequest) {
  const token = req.cookies.get('ustoz_token')?.value
  if (!token) return false
  try { await jwtVerify(token, SECRET); return true } catch { return false }
}

export async function GET(req: NextRequest) {
  if (!await verifyUstoz(req)) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
  const { data } = await supabase
    .from('forum_questions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  return NextResponse.json({ ok: true, questions: data || [] })
}

export async function POST(req: NextRequest) {
  if (!await verifyUstoz(req)) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
  const { questionId, answer } = await req.json()
  if (!questionId || !answer?.trim()) return NextResponse.json({ error: 'Ma\'lumot yetarli emas' }, { status: 400 })

  const { data: q } = await supabase
    .from('forum_questions')
    .select('*, site_users(telegram_chat_id, name)')
    .eq('id', questionId).single()

  if (!q) return NextResponse.json({ error: 'Savol topilmadi' }, { status: 404 })

  const { error: updateError } = await supabase.from('forum_questions').update({
    answer: answer.trim(),
    answered_at: new Date().toISOString(),
    answered_by: 'Имом-хатиб Темурхон домла Атоев',
    published: true,
  }).eq('id', questionId)

  if (updateError) {
    console.error('ustoz answer update error:', updateError)
    return NextResponse.json({ error: 'Жавоб сақланмади' }, { status: 500 })
  }

  // Telegram orqali foydalanuvchiga yuborish (xato bo'lsa ham OK qaytaramiz)
  const chatId = q.site_users?.telegram_chat_id
  if (chatId && BOT_TOKEN) {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🕌 <b>Hazratnavoi.uz</b>\n\nСаволингизга жавоб:\n\n❓ <i>${q.question}</i>\n\n✅ <b>Жавоб:</b>\n${answer}\n\n— Имом-хатиб Темурхон домла Атоев`,
          parse_mode: 'HTML',
        }),
      })
    } catch (tgErr) {
      console.error('Telegram notify error:', tgErr)
    }
  }

  return NextResponse.json({ ok: true })
}
