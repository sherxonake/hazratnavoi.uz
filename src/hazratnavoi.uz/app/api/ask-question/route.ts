import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!

export async function POST(req: NextRequest) {
  try {
    const { name, question } = await req.json()

    if (!name?.trim() || !question?.trim()) {
      return NextResponse.json({ error: 'Исм ва савол талаб қилинади' }, { status: 400 })
    }

    const text = `📩 *Сайтдан янги савол*\n\n👤 *Исм:* ${name}\n\n❓ *Савол:*\n${question}`

    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text,
        parse_mode: 'Markdown',
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
