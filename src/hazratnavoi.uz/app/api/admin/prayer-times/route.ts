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
    const { error } = await supabaseAdmin
      .from("prayer_times")
      .upsert(body, { onConflict: "date" })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const e = err as { message?: string }
    return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 })
  }
}
