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

    // Step 2: try to save jamaat times (columns may not exist yet)
    const jamaat = {
      date:            body.date,
      jamaat_fajr:    body.jamaat_fajr,
      jamaat_dhuhr:   body.jamaat_dhuhr,
      jamaat_asr:     body.jamaat_asr,
      jamaat_maghrib: body.jamaat_maghrib,
      jamaat_isha:    body.jamaat_isha,
    }
    const { error: e2 } = await supabaseAdmin
      .from("prayer_times")
      .upsert(jamaat, { onConflict: "date" })
    // ignore "column not found" — columns may not exist yet
    if (e2 && !e2.message?.includes("column")) throw e2

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
