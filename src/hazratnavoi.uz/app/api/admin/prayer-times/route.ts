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

    // Step 1: save main prayer times (always exist)
    const main = {
      date:    body.date,
      fajr:    body.fajr,
      sunrise: body.sunrise,
      dhuhr:   body.dhuhr,
      asr:     body.asr,
      maghrib: body.maghrib,
      isha:    body.isha,
    }
    const { error: e1 } = await supabaseAdmin
      .from("prayer_times")
      .upsert(main, { onConflict: "date" })
    if (e1) throw e1

    // Step 2: save mosque (jamaat) times — mosque_* columns already exist
    const jamaat = {
      date:            body.date,
      mosque_fajr:    body.mosque_fajr    ?? null,
      mosque_dhuhr:   body.mosque_dhuhr   ?? null,
      mosque_asr:     body.mosque_asr     ?? null,
      mosque_maghrib: body.mosque_maghrib ?? null,
      mosque_isha:    body.mosque_isha    ?? null,
    }
    const { error: e2 } = await supabaseAdmin
      .from("prayer_times")
      .upsert(jamaat, { onConflict: "date" })
    if (e2) throw e2

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
