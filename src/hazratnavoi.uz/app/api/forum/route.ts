import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { jwtVerify } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hazratnavoi-secret-key-2026'
)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!
const DAILY_LIMIT = 2

// GET — published savollarni olish
export async function GET() {
  const { data } = await supabase
    .from('forum_questions')
    .select('id, user_name, question, answer, answered_at, answered_by, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(20)

  return NextResponse.json({ ok: true, questions: data || [] })
}

// POST — yangi savol yuborish
export async function POST(req: NextRequest) {
  try {
    // Auth tekshirish
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Kirish talab etiladi' }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string
    const phone = payload.phone as string
    const userName = (payload.name as string) || 'Foydalanuvchi'

    const { question } = await req.json()
    if (!question?.trim() || question.trim().length < 10) {
      return NextResponse.json({ error: 'Савол камида 10 та белги бўлиши керак' }, { status: 400 })
    }

    // Kunlik limit tekshirish
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('forum_questions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', todayStart.toISOString())

    if ((count || 0) >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Кунига максимум ${DAILY_LIMIT} та савол бериш мумкин` },
        { status: 429 }
      )
    }

    // Savolni saqlash
    const { data: newQ } = await supabase
      .from('forum_questions')
      .insert({
        user_id: userId,
        user_name: userName,
        phone,
        question: question.trim(),
        published: false,
      })
      .select()
      .single()

    // Adminga Telegram xabari
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: `📩 <b>Форумдан янги савол</b>\n\n👤 ${userName} (${phone})\n\n❓ ${question}\n\n✏️ Жавоб бериш: /answer ${newQ.id} жавоб матни`,
        parse_mode: 'HTML',
      }),
    })

    return NextResponse.json({ ok: true, message: 'Саволингиз имом-хатибга юборилди' })
  } catch (err) {
    console.error('forum POST error:', err)
    return NextResponse.json({ error: 'Хатолик юз берди' }, { status: 500 })
  }
}
