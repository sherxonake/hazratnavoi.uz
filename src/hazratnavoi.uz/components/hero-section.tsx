"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Sun, Sunrise, Sunset, Moon, MoonStar } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePrayerTimes } from "@/hooks/use-prayer-times"

type Lang = "latin" | "cyrillic"

interface Prayer {
  key: string
  name: string
  nameCyrillic: string
  time: string
  icon: React.ReactNode
}

const DEFAULT_PRAYERS: Prayer[] = [
  { key: "bomdod", name: "Bomdod", nameCyrillic: "Бомдод", time: "05:12", icon: <Sunrise className="w-5 h-5" /> },
  { key: "peshin", name: "Peshin", nameCyrillic: "Пешин", time: "12:45", icon: <Sun className="w-5 h-5" /> },
  { key: "asr", name: "Asr", nameCyrillic: "Аср", time: "16:20", icon: <Sun className="w-4 h-4 opacity-80" /> },
  { key: "shom", name: "Shom", nameCyrillic: "Шом", time: "19:38", icon: <Sunset className="w-5 h-5" /> },
  { key: "xufton", name: "Xufton", nameCyrillic: "Хуфтон", time: "21:10", icon: <Moon className="w-5 h-5" /> },
]

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function getCurrentPrayer(prayers: Prayer[]): string {
  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()

  let current = prayers[prayers.length - 1].key
  for (let i = prayers.length - 1; i >= 0; i--) {
    if (minutesNow >= timeToMinutes(prayers[i].time)) {
      current = prayers[i].key
      break
    }
  }
  return current
}

function getNextPrayerCountdown(prayers: Prayer[]): { name: string; nameCyrillic: string; timeLeft: string } {
  const now = new Date()
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const secondsNow = now.getSeconds()

  const prayerMinutes = prayers.map((p) => timeToMinutes(p.time))

  let nextIdx = prayerMinutes.findIndex((m) => m > minutesNow)
  if (nextIdx === -1) nextIdx = 0 // wrap to first prayer next day

  const nextPrayer = prayers[nextIdx]
  let diffSeconds: number

  if (nextIdx === 0 && minutesNow > prayerMinutes[prayerMinutes.length - 1]) {
    // Next day's first prayer
    const nextDayMinutes = 24 * 60 - minutesNow + prayerMinutes[0]
    diffSeconds = nextDayMinutes * 60 - secondsNow
  } else {
    diffSeconds = (prayerMinutes[nextIdx] - minutesNow) * 60 - secondsNow
  }

  if (diffSeconds < 0) diffSeconds = 0

  const h = Math.floor(diffSeconds / 3600)
  const m = Math.floor((diffSeconds % 3600) / 60)
  const s = diffSeconds % 60

  return {
    name: nextPrayer.name,
    nameCyrillic: nextPrayer.nameCyrillic,
    timeLeft: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
  }
}

export function HeroSection({ lang }: { lang: Lang }) {
  const { prayerTimes, loading } = usePrayerTimes()
  const [currentPrayer, setCurrentPrayer] = useState(() => getCurrentPrayer(DEFAULT_PRAYERS))
  const [countdown, setCountdown] = useState(() => getNextPrayerCountdown(DEFAULT_PRAYERS))
  const [today, setToday] = useState("")
  const [prayers, setPrayers] = useState<Prayer[]>(DEFAULT_PRAYERS)

  const label = useCallback((l: string, c: string) => (lang === "latin" ? l : c), [lang])

  // Update prayers from Supabase
  useEffect(() => {
    if (prayerTimes) {
      setPrayers([
        { key: "bomdod", name: "Bomdod", nameCyrillic: "Бомдод", time: prayerTimes.fajr, icon: <Sunrise className="w-5 h-5" /> },
        { key: "peshin", name: "Peshin", nameCyrillic: "Пешин", time: prayerTimes.dhuhr, icon: <Sun className="w-5 h-5" /> },
        { key: "asr", name: "Asr", nameCyrillic: "Аср", time: prayerTimes.asr, icon: <Sun className="w-4 h-4 opacity-80" /> },
        { key: "shom", name: "Shom", nameCyrillic: "Шом", time: prayerTimes.maghrib, icon: <Sunset className="w-5 h-5" /> },
        { key: "xufton", name: "Xufton", nameCyrillic: "Хуфтон", time: prayerTimes.isha, icon: <Moon className="w-5 h-5" /> },
      ])
    }
  }, [prayerTimes])

  useEffect(() => {
    const d = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    setToday(d.toLocaleDateString("uz-UZ", options))
  }, [])

  useEffect(() => {
    const tick = () => {
      setCurrentPrayer(getCurrentPrayer(prayers))
      setCountdown(getNextPrayerCountdown(prayers))
    }
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [prayers])

  return (
    <section id="bosh" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/mosque-hero.jpg"
          alt="Ҳазрат Навоий жоме масжиди"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 flex flex-col items-center gap-8">

        {/* Date badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2">
          <MoonStar className="w-4 h-4 text-yellow-300" aria-hidden="true" />
          <span className="text-white/90 text-sm">{today}</span>
        </div>

        {/* Main Glassmorphism Card */}
        <div className="w-full max-w-3xl bg-emerald-900/40 backdrop-blur-xl rounded-2xl border border-white/15 shadow-2xl overflow-hidden">

          {/* Card Header */}
          <div className="px-6 pt-8 pb-6 text-center border-b border-white/10">
            <h1 className="font-serif text-white leading-tight text-balance">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
                {label("Navoiy shahri namoz vaqtlari", "Навоий шаҳри намоз вақтлари")}
              </span>
            </h1>
            <p className="text-white/60 text-sm mt-2">
              {label("Bugungi namoz jadval", "Бугунги намоз жадвали")}
            </p>
          </div>

          {/* Countdown */}
          <div className="px-6 py-6 text-center border-b border-white/10">
            <p className="text-white/70 text-xs uppercase tracking-widest mb-3">
              {label(
                `Navbatdagi namoz: ${countdown.name}`,
                `Навбатдаги намоз: ${countdown.nameCyrillic}`
              )}
            </p>
            <div
              className="font-mono text-5xl sm:text-6xl font-bold gold-glow text-gold tracking-wider"
              aria-live="polite"
              aria-atomic="true"
            >
              {countdown.timeLeft}
            </div>
            <p className="text-white/50 text-xs mt-2">
              {label("qolgan vaqt", "қолган вақт")}
            </p>
          </div>

          {/* Prayer Grid */}
          <div className="grid grid-cols-5 divide-x divide-white/10">
            {prayers.map((prayer) => {
              const isActive = prayer.key === currentPrayer
              return (
                <div
                  key={prayer.key}
                  className={cn(
                    "flex flex-col items-center gap-2 py-5 px-2 transition-colors duration-300",
                    isActive
                      ? "bg-primary/30 border-t-2 border-t-yellow-400/80"
                      : "hover:bg-white/5"
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors duration-300",
                      isActive ? "text-yellow-300" : "text-white/50"
                    )}
                    aria-hidden="true"
                  >
                    {prayer.icon}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide",
                      isActive ? "text-yellow-200" : "text-white/70"
                    )}
                  >
                    {label(prayer.name, prayer.nameCyrillic)}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-base sm:text-lg font-bold",
                      isActive ? "text-white" : "text-white/60"
                    )}
                  >
                    {prayer.time}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" aria-label="Ҳозирги намоз" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2 mt-4 opacity-60">
          <span className="text-white/70 text-xs tracking-widest uppercase">
            {label("Batafsil", "Батафсил")}
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}
