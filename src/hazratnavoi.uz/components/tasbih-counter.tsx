"use client"

import { useState, useEffect } from "react"
import { HandHeart, RotateCcw, Plus, Minus, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

const PRESET_DHIKR = [
  { arabic: "سُبْحَانَ ٱللَّٰهِ", latin: "SubhanAllah", cyrillic: "Субҳаналлоҳ", count: 33 },
  { arabic: "ٱلْحَمْدُ لِلَّٰهِ", latin: "Alhamdulillah", cyrillic: "Алҳамдулиллоҳ", count: 33 },
  { arabic: "ٱللَّٰهُ أَكْبَرُ", latin: "Allahu Akbar", cyrillic: "Аллоҳу Акбар", count: 33 },
  { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", latin: "La ilaha illallah", cyrillic: "Ла илаҳа иллаллоҳ", count: 100 },
  { arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", latin: "Astaghfirullah", cyrillic: "Астағфируллоҳ", count: 100 },
  { arabic: "ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ", latin: "Allahumma salli", cyrillic: "Аллоҳумма солли", count: 100 },
]

export function TasbihCounter({ lang }: { lang: Lang }) {
  const [count, setCount] = useState(0)
  const [target, setTarget] = useState(33)
  const [selectedDhikr, setSelectedDhikr] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [sessions, setSessions] = useState(0)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasbih-count')
    const savedTotal = localStorage.getItem('tasbih-total')
    const savedSessions = localStorage.getItem('tasbih-sessions')
    
    if (saved) setCount(parseInt(saved))
    if (savedTotal) setTotalCount(parseInt(savedTotal))
    if (savedSessions) setSessions(parseInt(savedSessions))
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tasbih-count', count.toString())
    localStorage.setItem('tasbih-total', totalCount.toString())
    localStorage.setItem('tasbih-sessions', sessions.toString())
  }, [count, totalCount, sessions])

  const handleIncrement = () => {
    const newCount = count + 1
    setCount(newCount)
    setTotalCount(prev => prev + 1)

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10)
    }

    // Vibrate on completion
    if (newCount === target) {
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50])
      }
      setSessions(prev => prev + 1)
    }
  }

  const handleReset = () => {
    setCount(0)
  }

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget)
    setCount(0)
  }

  const progress = Math.min((count / target) * 100, 100)
  const currentDhikr = PRESET_DHIKR[selectedDhikr]

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 uzbek-paxta-pattern opacity-25" aria-hidden="true" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-emerald-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <HandHeart className="w-5 h-5 text-emerald-900" aria-hidden="true" />
            </div>
            <span className="text-yellow-400 text-sm font-bold uppercase tracking-widest">
              {label(lang, "ZIKR SANOVCISI", "ЗИКР САНОВЧИСИ")}
            </span>
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {label(lang, "Tasbeh", "Тасбеҳ")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Counter */}
          <div className="bg-gradient-to-br from-emerald-800/60 via-emerald-900/60 to-emerald-800/60 backdrop-blur-xl rounded-3xl border-2 border-yellow-500/30 p-8 shadow-2xl">
            {/* Dhikr Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white/90 mb-3">
                {label(lang, "Zikrni tanlang", "Зикрни танланг")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_DHIKR.map((dhikr, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDhikr(i)
                      setTarget(dhikr.count)
                      setCount(0)
                    }}
                    className={cn(
                      "p-3 rounded-xl border-2 text-center transition-all duration-200",
                      selectedDhikr === i
                        ? "border-yellow-400 bg-yellow-500/20 text-yellow-400"
                        : "border-white/20 hover:border-yellow-400/40 text-white/80"
                    )}
                  >
                    <p className="text-xs font-semibold">{dhikr[lang === 'cyrillic' ? 'cyrillic' : 'latin']}</p>
                    <p className="text-[10px] text-white/60 mt-1">{dhikr.count}x</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Arabic Display */}
            <div className="text-center mb-6 p-4 bg-white/10 rounded-2xl">
              <p className="text-3xl font-serif text-yellow-400 mb-2 direction-rtl">
                {currentDhikr.arabic}
              </p>
              <p className="text-sm text-white/80">
                {currentDhikr[lang === 'cyrillic' ? 'cyrillic' : 'latin']}
              </p>
            </div>

            {/* Counter Display */}
            <div className="relative mb-6">
              {/* Progress Ring */}
              <div className="relative w-64 h-64 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-white/20"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                    className="text-primary transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Count Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <button
                    onClick={handleIncrement}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-emerald-deep text-white text-6xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
                  >
                    {count}
                  </button>
                  <p className="text-sm text-muted-foreground mt-4">
                    / {target}
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleTargetChange(Math.max(1, target - 1))}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Minus className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors font-semibold"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
                {label(lang, "Qayta", "Қайта")}
              </button>

              <button
                onClick={() => handleTargetChange(target + 1)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-2xl p-6 text-white border-2 border-yellow-500/30 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <HandHeart className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-emerald-100 font-medium">
                    {label(lang, "Jami", "Жами")}
                  </p>
                </div>
                <p className="text-4xl font-bold text-yellow-400">{totalCount.toLocaleString()}</p>
                <p className="text-xs text-emerald-200 mt-1">
                  {label(lang, "Zikr aytildi", "Зикр айтилди")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white border-2 border-yellow-300/50 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-yellow-100" aria-hidden="true" />
                  </div>
                  <p className="text-sm text-yellow-100 font-medium">
                    {label(lang, "Bosqich", "Босқич")}
                  </p>
                </div>
                <p className="text-4xl font-bold text-white">{sessions}</p>
                <p className="text-xs text-yellow-100 mt-1">
                  {label(lang, "To'liq tugal", "Тўлиқ тугал")}
                </p>
              </div>
            </div>

            {/* Target Selection */}
            <div className="bg-emerald-800/60 backdrop-blur rounded-2xl border-2 border-yellow-500/30 p-6">
              <h3 className="font-semibold text-yellow-400 mb-4 text-lg">
                {label(lang, "Maqsad", "Мақсад")}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[33, 99, 100, 300, 500, 1000].map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTargetChange(t)}
                    className={cn(
                      "py-3 rounded-xl border-2 font-semibold transition-all duration-200",
                      target === t
                        ? "border-yellow-400 bg-yellow-500/30 text-yellow-300 shadow-lg"
                        : "border-emerald-600 bg-emerald-700/50 text-emerald-200 hover:border-yellow-500/50"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-emerald-800/60 backdrop-blur rounded-2xl border-2 border-yellow-500/30 p-6">
              <h3 className="font-serif text-yellow-400 text-lg font-bold mb-3">
                {label(lang, "Fazilati", "Фазилати")}
              </h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-4">
                {label(
                  lang,
                  "Rasululloh ﷺ aytdilar: «Kimki «Subhanalloh» desa, unga o'n savob yoziladi. Kimki «Alhamdulillah» desa, unga o'n savob yoziladi. Kimki «Allohu Akbar» desa, unga o'n savob yoziladi.»",
                  "Расулуллоҳ ﷺ айтдилар: «Кимки «Субҳаналлоҳ» деса, унга ўн савоб ёзилади. Кимки «Алҳамдулиллоҳ» деса, унга ўн савоб ёзилади. Кимки «Аллоҳу Акбар» деса, унга ўн савоб ёзилади.»"
                )}
              </p>
              <p className="text-xs text-emerald-300">
                [Термизий ривояти]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
