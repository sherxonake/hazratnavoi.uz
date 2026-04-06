import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const { endpoint, keys, userAgent } = await req.json()
    if (!endpoint || !keys?.p256dh || !keys?.auth)
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })

    await supabaseAdmin.from("push_subscriptions").upsert(
      { endpoint, p256dh: keys.p256dh, auth: keys.auth, user_agent: userAgent || "" },
      { onConflict: "endpoint" }
    )

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { message?: string }
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { endpoint } = await req.json()
    await supabaseAdmin.from("push_subscriptions").delete().eq("endpoint", endpoint)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
