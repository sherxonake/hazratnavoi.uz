import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'hazratnavoi-secret-key-2026')
const USTOZ_PASSWORD = process.env.USTOZ_PASSWORD || 'nurota571'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== USTOZ_PASSWORD) {
    return NextResponse.json({ error: 'Паrol noto\'g\'ri' }, { status: 401 })
  }
  const token = await new SignJWT({ role: 'ustoz' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(SECRET)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('ustoz_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 43200, path: '/' })
  return res
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('ustoz_token')?.value
  if (!token) return NextResponse.json({ ok: false }, { status: 401 })
  try {
    await jwtVerify(token, SECRET)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('ustoz_token')
  return res
}
