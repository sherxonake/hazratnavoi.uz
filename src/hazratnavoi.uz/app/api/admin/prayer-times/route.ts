import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

const VALID_COOKIE = Buffer.from("admin:xazrat123").toString("base64")

function isAuthorized(req: NextRequest) {
  const cookie = req.cookies.get("admin-auth")?.value
  return cookie === VALID_COOKIE
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Barcha vaqtlarni bitta upsert — ikki alohida upsert NOT NULL xatosini keltirib chiqaradi
    const payload = {
      date:           body.date,
      fajr:           body.fajr    || null,
      sunrise:        body.sunrise || null,
      dhuhr:          body.dhuhr   || null,
      asr:            body.asr     || null,
      maghrib:        body.maghrib || null,
      isha:           body.isha    || null,
      mosque_fajr:    body.mosque_fajr    ?? null,
      mosque_dhuhr:   body.mosque_dhuhr   ?? null,
      mosque_asr:     body.mosque_asr     ?? null,
      mosque_maghrib: body.mosque_maghrib ?? null,
      mosque_isha:    body.mosque_isha    ?? null,
    }

    if (!payload.fajr || !payload.dhuhr || !payload.asr || !payload.maghrib || !payload.isha) {
      return NextResponse.json({ error: "Асосий намоз вақтлари (Бомдод, Пешин, Аср, Шом, Хуфтон) тўлдирилмаган" }, { status: 400 })
    }

    const { error: e1 } = await supabaseAdmin
      .from("prayer_times")
      .upsert(payload, { onConflict: "date" })
    if (e1) throw e1

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
