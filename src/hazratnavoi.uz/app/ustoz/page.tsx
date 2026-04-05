"use client"

import { useState, useEffect, useCallback } from "react"
import { LogOut, MessageCircle, CheckCircle, Clock, Send, Eye, EyeOff, Lock, RefreshCw } from "lucide-react"
import Image from "next/image"

interface Question {
  id: string
  user_name: string
  phone: string
  question: string
  answer: string | null
  answered_at: string | null
  published: boolean
  created_at: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d} кун олдин`
  if (h > 0) return `${h} соат олдин`
  if (m > 0) return `${m} дақиқа олдин`
  return "Ҳозир"
}

function Divider() {
  return (
    <div className="my-2">
      <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/25 to-transparent" />
    </div>
  )
}

export default function UstozPage() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loginErr, setLoginErr] = useState("")
  const [logging, setLogging] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selected, setSelected] = useState<Question | null>(null)
  const [answer, setAnswer] = useState("")
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("pending")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetch("/api/ustoz/auth").then(r => {
      setAuthed(r.ok)
      setChecking(false)
    })
  }, [])

  const loadQuestions = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true)
    const res = await fetch("/api/ustoz/questions")
    if (res.ok) {
      const data = await res.json()
      setQuestions(data.questions)
    }
    setRefreshing(false)
  }, [])

  useEffect(() => { if (authed) loadQuestions(true) }, [authed, loadQuestions])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLogging(true); setLoginErr("")
    const res = await fetch("/api/ustoz/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) { setAuthed(true) }
    else { setLoginErr("Парол нотўғри") }
    setLogging(false)
  }

  async function handleAnswer(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !answer.trim()) return
    setSending(true)
    const res = await fetch("/api/ustoz/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: selected.id, answer }),
    })
    if (res.ok) {
      setAnswer(""); setSelected(null)
      loadQuestions(true)
    }
    setSending(false)
  }

  async function handleLogout() {
    await fetch("/api/ustoz/auth", { method: "DELETE" })
    setAuthed(false)
  }

  const filtered = questions.filter(q =>
    filter === "all" ? true : filter === "pending" ? !q.answer : !!q.answer
  )
  const pendingCount = questions.filter(q => !q.answer).length
  const answeredCount = questions.filter(q => q.answer).length

  // ── LOADING ──────────────────────────────────────────────
  if (checking) return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-yellow-500/50 text-sm font-serif">بِسْمِ اللَّهِ</p>
      </div>
    </div>
  )

  // ── LOGIN ─────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-30" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 40%, rgba(0,60,35,0.5) 0%, rgba(0,8,4,0.97) 100%)" }} />

      {/* Decorative arches */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none opacity-10">
        <svg viewBox="0 0 400 200" fill="none" className="w-full h-full">
          <path d="M50 200 L50 100 Q50 20 200 20 Q350 20 350 100 L350 200" stroke="#ca8a04" strokeWidth="1.5" fill="none"/>
          <path d="M80 200 L80 110 Q80 50 200 50 Q320 50 320 110 L320 200" stroke="#ca8a04" strokeWidth="0.8" fill="none"/>
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Top calligraphy */}
        <div className="text-center mb-8">
          <p className="text-yellow-500/50 font-serif text-base mb-6" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>

          <div className="relative mx-auto w-24 h-24 mb-5">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 animate-pulse" />
            <div className="absolute inset-1 rounded-full overflow-hidden ring-2 ring-yellow-500/40 bg-emerald-950">
              <Image src="/images/mosque-logo.png" alt="Logo" width={88} height={88} className="object-cover scale-110" />
            </div>
            {/* Decorative ring */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="46" stroke="#ca8a04" strokeWidth="0.5" strokeDasharray="4 3" fill="none" opacity="0.4"/>
            </svg>
          </div>

          <h1 className="font-serif text-2xl font-bold bg-gradient-to-b from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Hazratnavoi.uz
          </h1>
          <p className="text-white/35 text-xs mt-1 tracking-widest uppercase">Устоз панели</p>
        </div>

        {/* Login card */}
        <div className="relative">
          {/* Card glow */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-yellow-500/20 via-transparent to-yellow-600/10 blur-sm" />
          <form onSubmit={handleLogin} className="relative bg-emerald-950/90 border border-yellow-500/25 rounded-2xl p-7 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-yellow-500/15">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Устоз кириши</p>
                <p className="text-white/35 text-xs">Фақат имом-хатиб учун</p>
              </div>
            </div>

            {/* Password */}
            <div className="relative mb-5">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Парол"
                className="w-full bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-3.5 pr-11 text-white placeholder-white/20 focus:outline-none focus:border-yellow-500/50 focus:bg-white/8 text-sm transition-all"
                autoFocus
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                {showPass ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>

            {loginErr && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <p className="text-red-400 text-xs">{loginErr}</p>
              </div>
            )}

            <button type="submit" disabled={logging || !password}
              className="w-full relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-40 text-emerald-950 font-bold py-3.5 rounded-xl transition-all group">
              <span className="relative z-10">{logging ? "Текширилмоқда..." : "Кириш →"}</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            </button>
          </form>
        </div>

        <p className="text-center text-white/15 text-xs mt-6 font-serif" dir="rtl">الْعِلْمُ نُورٌ</p>
      </div>
    </div>
  )

  // ── DASHBOARD ─────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #021a0f 0%, #041208 50%, #020e08 100%)" }}>
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-[0.07]" />

      {/* ── HEADER ── */}
      <header className="relative border-b border-yellow-500/10 bg-black/20 backdrop-blur-xl sticky top-0 z-20">
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-yellow-500/40 flex-shrink-0">
              <Image src="/images/mosque-logo.png" alt="Logo" width={36} height={36} className="object-cover scale-110" />
            </div>
            <div className="leading-tight">
              <p className="text-yellow-400 font-serif font-bold text-sm">Hazratnavoi.uz</p>
              <p className="text-white/30 text-[10px] tracking-widest uppercase">Устоз панели</p>
            </div>
          </div>

          {/* Center calligraphy — desktop only */}
          <div className="hidden md:block text-center">
            <p className="text-yellow-500/40 font-serif text-sm" dir="rtl">الْعِلْمُ نُورٌ وَالْجَهْلُ ظُلْمَةٌ</p>
          </div>

          {/* Right: badge + refresh + logout */}
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 rounded-full px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-300 text-xs font-bold">{pendingCount} янги</span>
              </div>
            )}
            <button onClick={() => loadQuestions()} disabled={refreshing}
              className="w-8 h-8 rounded-full border border-white/10 hover:border-yellow-500/30 flex items-center justify-center text-white/30 hover:text-yellow-400 transition-all">
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/30 hover:text-red-400 text-xs transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Чиқиш</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── IMAM CARD + STATS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Imam profile card */}
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/8 to-transparent p-5">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-yellow-500/40 mb-3">
              <Image src="/images/mosque-logo.png" alt="Imam" width={48} height={48} className="object-cover scale-110" />
            </div>
            <p className="text-yellow-400 font-serif font-bold text-sm leading-snug">Темурхон домла Атоев</p>
            <p className="text-white/35 text-xs mt-0.5">Имом-хатиб</p>
            <div className="mt-3 pt-3 border-t border-yellow-500/15">
              <p className="text-white/20 text-[10px]" dir="rtl">وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ</p>
            </div>
          </div>

          {/* Stats — 3 cards */}
          {[
            {
              label: "Жами саволлар",
              labelAr: "مجموع الأسئلة",
              value: questions.length,
              color: "from-white/5 to-white/0",
              border: "border-white/10",
              textColor: "text-white",
              icon: "📋"
            },
            {
              label: "Жавоб кутяпти",
              labelAr: "تنتظر الإجابة",
              value: pendingCount,
              color: "from-red-500/10 to-transparent",
              border: "border-red-500/20",
              textColor: "text-red-400",
              icon: "⏳"
            },
            {
              label: "Жавоб берилган",
              labelAr: "تمت الإجابة",
              value: answeredCount,
              color: "from-emerald-500/10 to-transparent",
              border: "border-emerald-500/20",
              textColor: "text-emerald-400",
              icon: "✅"
            },
          ].map(s => (
            <div key={s.label} className={`relative overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} p-5`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-white/15 text-[10px] text-right" dir="rtl">{s.labelAr}</p>
              </div>
              <p className={`text-4xl font-bold font-serif ${s.textColor} leading-none`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── DAILY DUA ── */}
        <div className="relative rounded-2xl border border-yellow-500/15 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5" />
          <div className="relative px-6 py-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center flex-shrink-0 text-lg">🤲</div>
            <div className="flex-1">
              <p className="text-yellow-400/80 font-serif text-sm" dir="rtl">
                «اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا»
              </p>
              <p className="text-white/30 text-xs mt-1">
                "Эй Аллоҳ, менга ўргатган нарсангдан фойдалантир, фойдали нарсаларни ўргат ва илмимни зиёда қил"
              </p>
            </div>
          </div>
        </div>

        <Divider />

        {/* ── MAIN CONTENT ── */}
        <div className="grid lg:grid-cols-5 gap-5">

          {/* ── QUESTIONS LIST (2/5) ── */}
          <div className="lg:col-span-2 space-y-3">
            {/* Filter tabs */}
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/8">
              {([
                { key: "pending", label: "⏳ Кутяпти", count: pendingCount },
                { key: "answered", label: "✅ Жавоб", count: answeredCount },
                { key: "all", label: "📋 Барча", count: questions.length },
              ] as const).map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`flex-1 text-xs py-2 px-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1 ${
                    filter === f.key
                      ? "bg-yellow-500 text-emerald-950 shadow-sm"
                      : "text-white/40 hover:text-white/70"
                  }`}>
                  {f.label}
                  {f.count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${filter === f.key ? "bg-emerald-950/30 text-emerald-900" : "bg-white/10"}`}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Question cards */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-0.5 scrollbar-thin">
              {filtered.length === 0 && (
                <div className="text-center py-10">
                  <div className="text-3xl mb-2 opacity-30">🕌</div>
                  <p className="text-white/25 text-sm">Саволлар йўқ</p>
                </div>
              )}
              {filtered.map(q => (
                <button key={q.id} onClick={() => { setSelected(q); setAnswer(q.answer || "") }}
                  className={`w-full text-left rounded-xl border transition-all group ${
                    selected?.id === q.id
                      ? "border-yellow-500/50 bg-yellow-500/8 shadow-[0_0_20px_rgba(234,179,8,0.08)]"
                      : "border-white/8 bg-white/3 hover:border-yellow-500/20 hover:bg-white/5"
                  }`}>
                  {/* Left accent bar for pending */}
                  <div className="flex">
                    <div className={`w-0.5 rounded-l-xl flex-shrink-0 ${q.answer ? "bg-emerald-500/40" : "bg-yellow-500/70"}`} />
                    <div className="flex-1 p-3.5">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${q.answer ? "bg-emerald-500/15" : "bg-yellow-500/15"}`}>
                          <MessageCircle className={`w-3.5 h-3.5 ${q.answer ? "text-emerald-400" : "text-yellow-400"}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-xs font-medium leading-snug line-clamp-2 group-hover:text-white/90">{q.question}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-white/25 text-[10px]">{q.user_name}</span>
                            <span className="text-white/15 text-[10px]">·</span>
                            <span className="text-white/25 text-[10px]">{timeAgo(q.created_at)}</span>
                          </div>
                          <div className="mt-1.5">
                            {q.answer
                              ? <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-400/10 px-2 py-0.5 rounded-full">
                                  <CheckCircle className="w-2.5 h-2.5" /> Жавоб берилган
                                </span>
                              : <span className="inline-flex items-center gap-1 text-yellow-400/80 text-[10px] bg-yellow-400/10 px-2 py-0.5 rounded-full">
                                  <Clock className="w-2.5 h-2.5" /> Кутяпти
                                </span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── ANSWER PANEL (3/5) ── */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="rounded-2xl border border-yellow-500/20 overflow-hidden">
                {/* Mihrab-style arch header */}
                <div className="relative bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent px-6 pt-6 pb-5 border-b border-yellow-500/15">
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                    <svg viewBox="0 0 130 130" fill="none" className="w-full h-full">
                      <path d="M65 10 Q110 10 110 55 L110 120 L20 120 L20 55 Q20 10 65 10Z" stroke="#ca8a04" strokeWidth="1.5" fill="none"/>
                      <path d="M65 20 Q100 20 100 55 L100 115 L30 115 L30 55 Q30 20 65 20Z" stroke="#ca8a04" strokeWidth="0.8" fill="none"/>
                    </svg>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-yellow-400/70 text-xs font-semibold uppercase tracking-wider">Савол</span>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-white/40 text-xs">{selected.user_name}</span>
                        <span className="text-white/20 text-xs">{selected.phone}</span>
                        <span className="text-white/20 text-xs">·</span>
                        <span className="text-white/30 text-xs">{timeAgo(selected.created_at)}</span>
                      </div>
                      <p className="text-white font-medium text-sm leading-relaxed">{selected.question}</p>
                    </div>
                  </div>

                  {selected.answer && (
                    <div className="mt-4 pt-4 border-t border-yellow-500/10">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-emerald-400/70 text-[10px] uppercase tracking-wider mb-1">Берилган жавоб</p>
                          <p className="text-white/60 text-sm leading-relaxed">{selected.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Answer form */}
                <div className="p-6 bg-black/20">
                  <form onSubmit={handleAnswer}>
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-yellow-400/60 text-[11px] uppercase tracking-widest font-semibold">
                        {selected.answer ? "Жавобни таҳрирлаш" : "Жавоб ёзиш"}
                      </label>
                    </div>
                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder="Жавобингизни ёзинг..."
                      rows={7}
                      className="w-full bg-white/5 border border-yellow-500/15 rounded-xl px-4 py-3.5 text-white placeholder-white/15 text-sm focus:outline-none focus:border-yellow-500/35 focus:bg-white/8 resize-none mb-4 transition-all leading-relaxed"
                    />

                    <div className="flex items-center gap-3">
                      <button type="submit" disabled={sending || !answer.trim()}
                        className="flex-1 flex items-center justify-center gap-2 relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-40 text-emerald-950 font-bold py-3.5 rounded-xl transition-all group">
                        <Send className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{sending ? "Юборилмоқда..." : "Жавоб юбориш"}</span>
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                      </button>
                      <button type="button" onClick={() => { setSelected(null); setAnswer("") }}
                        className="px-4 py-3.5 rounded-xl border border-white/10 text-white/30 hover:text-white/60 hover:border-white/20 text-sm transition-all">
                        Бекор
                      </button>
                    </div>

                    <p className="text-white/20 text-[11px] text-center mt-3 flex items-center justify-center gap-1.5">
                      <span>📲</span>
                      Фойдаланувчига Telegram орқали хабар кетади — @hazratnavoiy2fa_bot
                    </p>
                  </form>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/2 h-full min-h-[400px] flex flex-col items-center justify-center p-10">
                {/* Empty state with Islamic decoration */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-4xl opacity-30">🕌</span>
                  </div>
                  <div className="absolute -inset-3 rounded-full border border-yellow-500/10 border-dashed animate-spin" style={{ animationDuration: "20s" }} />
                </div>
                <p className="text-white/25 text-sm mb-2">Саволни танланг ва жавоб ёзинг</p>
                <p className="text-yellow-500/20 text-xs font-serif" dir="rtl">وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ</p>
                <p className="text-white/15 text-[10px] mt-1">"Ҳар билувчидан юқорироқ билувчи бор" (Юсуф: 76)</p>

                {pendingCount > 0 && (
                  <button onClick={() => setFilter("pending")}
                    className="mt-6 flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs px-4 py-2 rounded-full hover:bg-yellow-500/15 transition-all">
                    <Clock className="w-3.5 h-3.5" />
                    {pendingCount} та савол жавоб кутяпти
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="pt-2 pb-4">
          <Divider />
          <p className="text-center text-white/15 text-xs mt-3 font-serif" dir="rtl">
            اللَّهُمَّ عَلِّمْنَا مَا يَنْفَعُنَا وَانْفَعْنَا بِمَا عَلَّمْتَنَا
          </p>
          <p className="text-center text-white/10 text-[10px] mt-1">hazratnavoi.uz © {new Date().getFullYear()}</p>
        </div>

      </div>
    </div>
  )
}
