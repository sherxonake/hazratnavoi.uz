import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

const PRAYER_LABELS: Record<string, string> = {
  fajr:    "Бомдод",
  dhuhr:   "Пешин",
  asr:     "Аср",
  maghrib: "Шом",
  isha:    "Хуфтон",
}

const MOSQUE_KEY: Record<string, string> = {
  fajr:    "mosque_fajr",
  dhuhr:   "mosque_dhuhr",
  asr:     "mosque_asr",
  maghrib: "mosque_maghrib",
  isha:    "mosque_isha",
}

function timeStrToMinutes(t: string | null): number | null {
  if (!t) return null
  const [h, m] = t.slice(0, 5).split(":").map(Number)
  return h * 60 + m
}

export async function GET(req: NextRequest) {
  // Allow Vercel cron or manual trigger with secret
  const secret = req.nextUrl.searchParams.get("secret")
  const authHeader = req.headers.get("authorization")
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`
  const isManual = secret === process.env.CRON_SECRET

  if (!isVercelCron && !isManual && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = new Date()
    // Use Uzbekistan timezone (UTC+5)
    const uzNow = new Date(now.getTime() + 5 * 60 * 60 * 1000)
    const today = uzNow.toISOString().slice(0, 10)
    const currentMinutes = uzNow.getUTCHours() * 60 + uzNow.getUTCMinutes()

    // Fetch today's prayer times
    const { data: pt } = await supabaseAdmin
      .from("prayer_times")
      .select("*")
      .eq("date", today)
      .maybeSingle()

    if (!pt) return NextResponse.json({ ok: true, msg: "No prayer times today" })

    // Check each prayer — notify if 18-22 minutes away (5-min cron window)
    const results: string[] = []

    for (const [key, label] of Object.entries(PRAYER_LABELS)) {
      const prayerMin = timeStrToMinutes(pt[key as keyof typeof pt] as string)
      if (!prayerMin) continue

      const diff = prayerMin - currentMinutes
      if (diff < 18 || diff > 22) continue

      // Check if already notified
      const { data: logged } = await supabaseAdmin
        .from("push_notifications_log")
        .select("id")
        .eq("prayer_date", today)
        .eq("prayer_key", key)
        .maybeSingle()

      if (logged) continue // already sent

      // Get mosque time
      const mosqueTime = pt[MOSQUE_KEY[key] as keyof typeof pt] as string | null
      const mosqueStr  = mosqueTime ? ` · Масжид жамоати: ${mosqueTime.slice(0, 5)}` : ""

      const title = `🕌 ${label} намози — ${diff} дақиқадан сўнг`
      const body  = `Вақт: ${(pt[key as keyof typeof pt] as string).slice(0, 5)}${mosqueStr}`

      // Get all subscriptions
      const { data: subs } = await supabaseAdmin
        .from("push_subscriptions")
        .select("endpoint, p256dh, auth")

      if (!subs?.length) continue

      // Send push to all subscribers
      const webpush = await import("web-push")
      webpush.setVapidDetails(
        process.env.VAPID_EMAIL!,
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!
      )

      let sent = 0
      const dead: string[] = []

      await Promise.allSettled(
        subs.map(async (sub) => {
          try {
            await webpush.sendNotification(
              { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
              JSON.stringify({ title, body, tag: `prayer-${key}-${today}`, url: "/" })
            )
            sent++
          } catch (e: unknown) {
            const err = e as { statusCode?: number }
            if (err?.statusCode === 410 || err?.statusCode === 404)
              dead.push(sub.endpoint) // expired subscription
          }
        })
      )

      // Remove dead subscriptions
      if (dead.length)
        await supabaseAdmin.from("push_subscriptions").delete().in("endpoint", dead)

      // Log sent notification
      await supabaseAdmin.from("push_notifications_log").insert({
        prayer_date: today, prayer_key: key, recipients_count: sent,
      })

      results.push(`${label}: sent to ${sent}`)
    }

    return NextResponse.json({ ok: true, results, time: currentMinutes })
  } catch (e: unknown) {
    const err = e as { message?: string }
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }
}
