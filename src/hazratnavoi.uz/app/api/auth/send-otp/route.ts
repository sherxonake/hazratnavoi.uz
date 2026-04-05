import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BOT_TOKEN = process.env.TELEGRAM_2FA_BOT_TOKEN!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json()

    // +998 tekshirish
    if (!phone || !/^\+998\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Фақат Ўзбекистон рақамлари (+998XXXXXXXXX)' },
        { status: 400 }
      )
    }

    // Foydalanuvchi Telegram da botni ishga tushirganmi?
    const { data: user } = await supabase
      .from('site_users')
      .select('telegram_chat_id')
      .eq('phone', phone)
      .single()

    if (!user?.telegram_chat_id) {
      return NextResponse.json(
        { error: 'BOT_NOT_STARTED', message: 'Аввал Telegramda @hazratnavoiy2fa_bot ni ochib /start bosing' },
        { status: 404 }
      )
    }

    // Yangi OTP yaratish
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

    // Eski kodlarni o'chirish
    await supabase.from('otp_codes')
      .delete()
      .eq('phone', phone)
      .eq('used', false)

    await supabase.from('otp_codes').insert({
      phone,
      code,
      telegram_chat_id: user.telegram_chat_id,
      expires_at: expiresAt,
    })

    // Telegram orqali yuborish
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: user.telegram_chat_id,
        text: `🔐 <b>Hazratnavoi.uz</b> kirish kodi:\n\n<b>${code}</b>\n\n⏱ 5 daqiqa amal qiladi.`,
        parse_mode: 'HTML',
      }),
    })

    return NextResponse.json({ ok: true, message: 'Telegram orqali kod yuborildi' })
  } catch (err) {
    console.error('send-otp error:', err)
    return NextResponse.json({ error: 'Хатолик юз берди' }, { status: 500 })
  }
}
