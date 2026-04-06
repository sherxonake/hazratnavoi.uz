"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface PrayerTime {
  date: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  jamaat_fajr?: string
  jamaat_dhuhr?: string
  jamaat_asr?: string
  jamaat_maghrib?: string
  jamaat_isha?: string
}

const PRAYERS = [
  { key: "fajr",    label: "Бомдод",  icon: "🌙", jamaatKey: "jamaat_fajr"    },
  { key: "sunrise", label: "Қуёш",    icon: "🌅", jamaatKey: null              },
  { key: "dhuhr",   label: "Пешин",   icon: "☀️", jamaatKey: "jamaat_dhuhr"   },
  { key: "asr",     label: "Аср",     icon: "🌤", jamaatKey: "jamaat_asr"     },
  { key: "maghrib", label: "Шом",     icon: "🌇", jamaatKey: "jamaat_maghrib" },
  { key: "isha",    label: "Хуфтон",  icon: "🌃", jamaatKey: "jamaat_isha"    },
]

const JAMAAT = [
  { key: "jamaat_fajr",    label: "Бомдод"  },
  { key: "jamaat_dhuhr",   label: "Пешин"   },
  { key: "jamaat_asr",     label: "Аср"     },
  { key: "jamaat_maghrib", label: "Шом"     },
  { key: "jamaat_isha",    label: "Хуфтон"  },
]

function fmt(t: string | undefined | null) {
  if (!t) return "--:--"
  return t.slice(0, 5)
}

function getCurrentPrayerKey(times: PrayerTime): string {
  const now = new Date()
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
  let current = "isha"
  for (const p of PRAYERS) {
    const t = times[p.key as keyof PrayerTime] as string | undefined
    if (t && hhmm >= t.slice(0, 5)) current = p.key
  }
  return current
}

const UZ_DAYS   = ["Якшанба", "Душанба", "Сешанба", "Чоршанба", "Пайшанба", "Жума", "Шанба"]
const UZ_MONTHS = ["Январ", "Феврал", "Март", "Апрел", "Май", "Июн",
                   "Июл", "Август", "Сентябр", "Октябр", "Ноябр", "Декабр"]

export function PrayerTimesSection({ lang }: { lang: "latin" | "cyrillic" }) {
  const [times, setTimes]   = useState<PrayerTime | null>(null)
  const [loading, setLoading] = useState(true)
  const [tick, setTick]     = useState(0)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    supabase
      .from("prayer_times")
      .select("*")
      .eq("date", today)
      .maybeSingle()
      .then(({ data }) => { setTimes(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // refresh every minute to keep "Ҳозир" marker correct
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const currentKey = times ? getCurrentPrayerKey(times) : null

  const now = new Date()
  const dateStr = lang === "cyrillic"
    ? `${UZ_DAYS[now.getDay()]}, ${now.getDate()} ${UZ_MONTHS[now.getMonth()]} ${now.getFullYear()}`
    : now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  const hasJamaat = times && (times.jamaat_fajr || times.jamaat_dhuhr)

  return (
    <section id="namoz" className="py-14 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-gold opacity-[0.04] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium mb-4">
            <Clock className="w-3.5 h-3.5" />
            {lang === "cyrillic" ? "Намоз вақтлари" : "Namoz vaqtlari"}
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            {lang === "cyrillic" ? "Навоий шаҳри" : "Navoiy shahri"}
          </h2>
          <p className="text-white/35 text-sm mt-1">{dateStr}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-14">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-500/30 border-t-yellow-500 animate-spin" />
          </div>
        ) : !times ? (
          <div className="text-center py-10">
            <p className="text-white/30 text-sm">
              {lang === "cyrillic"
                ? "Бугунги намоз вақтлари ҳали киритилмаган"
                : "Bugungi namoz vaqtlari hali kiritilmagan"}
            </p>
          </div>
        ) : (
          <>
            {/* Prayer times grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-5">
              {PRAYERS.map(p => {
                const t      = fmt(times[p.key as keyof PrayerTime] as string)
                const active = currentKey === p.key
                return (
                  <div key={p.key}
                    className={`flex flex-col items-center py-4 px-2 rounded-2xl border transition-all duration-300 ${
                      active
                        ? "border-yellow-500/55 bg-yellow-500/10 shadow-lg shadow-yellow-500/8"
                        : "border-white/8 bg-white/3 hover:border-white/14"
                    }`}
                  >
                    <span className="text-xl mb-1.5">{p.icon}</span>
                    <p className={`text-[11px] font-medium mb-1 ${active ? "text-yellow-300" : "text-white/45"}`}>
                      {p.label}
                    </p>
                    <p className={`font-bold text-base tabular-nums ${active ? "text-yellow-400" : "text-white/75"}`}>
                      {t}
                    </p>
                    {active && (
                      <span className="mt-1.5 text-[9px] bg-yellow-500/20 text-yellow-400
                        px-2 py-0.5 rounded-full font-medium">
                        {lang === "cyrillic" ? "Ҳозир" : "Hozir"}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Congregation times */}
            {hasJamaat && (
              <div className="rounded-2xl border border-emerald-500/18 bg-emerald-900/20 px-5 py-4">
                <p className="text-emerald-400/60 text-[10px] font-semibold uppercase tracking-wider mb-3">
                  ⏰ {lang === "cyrillic" ? "Жамоат намози (масжид)" : "Jamaat namozi (masjid)"}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {JAMAAT.map(j => {
                    const t = times[j.key as keyof PrayerTime]
                    if (!t) return null
                    return (
                      <div key={j.key} className="flex items-center gap-2">
                        <span className="text-white/35 text-xs">{j.label}</span>
                        <span className="text-emerald-300 tabular-nums text-sm font-semibold">
                          {fmt(t as string)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
