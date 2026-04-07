import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { name, question } = await req.json()

    if (!name?.trim() || !question?.trim()) {
      return NextResponse.json({ error: 'Исм ва савол талаб қилинади' }, { status: 400 })
    }

    // Supabase'га сақлаш (устоз панели кўрсин учун)
    const { data: newQ, error: insertError } = await supabase
      .from('forum_questions')
      .insert({
        user_name: name.trim(),
        phone: 'sayt',
        question: question.trim(),
        published: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('ask-question insert error:', insertError)
    }

    // Telegram'га хабар юбориш
    const text = `📩 <b>Сайтдан янги савол</b>\n\n👤 <b>Исм:</b> ${name.trim()}\n\n❓ <b>Савол:</b>\n${question.trim()}`

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    })

    const data = await res.json()
    if (!data.ok) throw new Error(data.description)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('ask-question error:', err)
    return NextResponse.json({ error: 'Юборишда хатолик' }, { status: 500 })
  }
}
