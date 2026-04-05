import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SignJWT } from 'jose'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'hazratnavoi-secret-key-2026'
)

export async function POST(req: NextRequest) {
  try {
    const { phone, code, name } = await req.json()

    if (!phone || !code) {
      return NextResponse.json({ error: 'Телефон ва код керак' }, { status: 400 })
    }

    // OTP tekshirish
    const { data: otp } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!otp) {
      return NextResponse.json({ error: 'Код нотўғри ёки муддати ўтган' }, { status: 401 })
    }

    // Kodni ishlatilgan deb belgilash
    await supabase.from('otp_codes').update({ used: true }).eq('id', otp.id)

    // Foydalanuvchini yaratish yoki yangilash
    const { data: user } = await supabase
      .from('site_users')
      .upsert(
        {
          phone,
          telegram_chat_id: otp.telegram_chat_id,
          name: name || null,
          last_login: new Date().toISOString(),
        },
        { onConflict: 'phone' }
      )
      .select()
      .single()

    // JWT token
    const token = await new SignJWT({ userId: user.id, phone, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(JWT_SECRET)

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, phone, name: user.name },
    })

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('verify-otp error:', err)
    return NextResponse.json({ error: 'Хатолик юз берди' }, { status: 500 })
  }
}
