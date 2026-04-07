"use client"

import { useEffect, useState } from "react"
import { Calendar as CalendarIcon, Moon, Star } from "lucide-react"
import { HijriCalendar } from "@/lib/prayer-calculations"
import { cn } from "@/lib/utils"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

const IMPORTANT_DATES_2026 = [
  { date: "2026-02-18", latin: "Рамазон бошланиши", cyrillic: "Рамазон бошланиши", icon: "🌙" },
  { date: "2026-03-15", latin: "Лайлат ал-Қадр", cyrillic: "Лайлат ал-Қадр", icon: "✨" },
  { date: "2026-03-20", latin: "Рамазон Ҳайити", cyrillic: "Рамазон Ҳайити", icon: "🎉" },
  { date: "2026-05-26", latin: "Арафа куни", cyrillic: "Арафа куни", icon: "🤲" },
  { date: "2026-05-27", latin: "Қурбон Ҳайити", cyrillic: "Қурбон Ҳайити", icon: "🐑" },
  { date: "2026-06-16", latin: "Исломий Янги йил", cyrillic: "Исломий Янги йил", icon: "🎊" },
  { date: "2026-06-25", latin: "Ошура", cyrillic: "Ошура", icon: "⭐" },
  { date: "2026-08-25", latin: "Мавлюд", cyrillic: "Мавлюд", icon: "🕌" },
]

export function IslamicCalendar({ lang }: { lang: Lang }) {
  const [hijriDate, setHijriDate] = useState<{ day: number; month: number; year: number } | null>(null)
  const [today, setToday] = useState<Date>(new Date())
  const [specialEvent, setSpecialEvent] = useState<string | null>(null)

  useEffect(() => {
    const date = HijriCalendar.toHijri(new Date())
    setHijriDate(date)
    
    const key = today.toISOString().split('T')[0]
    const event = IMPORTANT_DATES_2026.find(d => d.date === key)
    if (event) {
      setSpecialEvent(event[lang])
    }

    const interval = setInterval(() => {
      const now = new Date()
      setToday(now)
      const newHijri = HijriCalendar.toHijri(now)
      setHijriDate(newHijri)
    }, 60000)

    return () => clearInterval(interval)
  }, [lang, today])

  const monthName = hijriDate ? HijriCalendar.getMonthName(hijriDate.month, lang) : ""

  return (
    <section className="py-16 lg:py-20 bg-emerald-deep relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-emerald-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <Moon className="w-5 h-5 text-emerald-900" aria-hidden="true" />
            </div>
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">
              {label(lang, "ISLOMIY TAQVIM", "ИСЛОМИЙ ТАҚВИМ")}
            </span>
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {label(lang, "Hijriy sana", "Ҳижрий сана")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Hijri Date Card */}
          <div className="bg-gradient-to-br from-emerald-800/60 via-emerald-900/60 to-emerald-800/60 backdrop-blur-xl rounded-3xl border-2 border-yellow-500/30 p-8 shadow-2xl">
            <div className="absolute inset-0 islamiy-pattern opacity-15" aria-hidden="true" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">
                    {label(lang, "Бугунги сана", "Бугунги сана")}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {label(lang, "Исломий тақвим", "Исломий тақвим")}
                  </p>
                </div>
              </div>

              {hijriDate && (
                <div className="space-y-2">
                  <p className="text-5xl lg:text-6xl font-serif font-bold">
                    {hijriDate.day}
                  </p>
                  <p className="text-2xl text-yellow-400 font-semibold">
                    {monthName} {hijriDate.year}
                  </p>
                  <p className="text-white/60 text-sm">
                    {today.toLocaleDateString(lang === "latin" ? "uz-Latn-UZ" : "uz-Cyrl-UZ", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {specialEvent && (
                <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                    <span className="text-yellow-300 font-semibold text-sm">
                      {specialEvent}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Important Dates */}
          <div className="bg-white/5 rounded-3xl border border-yellow-500/20 p-6 lg:p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="w-6 h-6 text-yellow-400" aria-hidden="true" />
              <h3 className="font-serif text-white text-xl font-bold">
                {label(lang, "Муҳим саналар 2026", "Муҳим саналар 2026")}
              </h3>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {IMPORTANT_DATES_2026.map((event, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/8 transition-colors duration-200"
                >
                  <span className="text-2xl">{event.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {event[lang]}
                    </p>
                    <p className="text-white/50 text-xs">
                      {new Date(event.date).toLocaleDateString(lang === "latin" ? "uz-Latn-UZ" : "uz-Cyrl-UZ", {
                        day: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
