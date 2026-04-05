"use client"

import { useState, useEffect, useCallback } from "react"
import { LogOut, MessageCircle, CheckCircle, Clock, Send, Eye, EyeOff, Lock } from "lucide-react"
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

  useEffect(() => {
    fetch("/api/ustoz/auth").then(r => {
      setAuthed(r.ok)
      setChecking(false)
    })
  }, [])

  const loadQuestions = useCallback(async () => {
    const res = await fetch("/api/ustoz/questions")
    if (res.ok) {
      const data = await res.json()
      setQuestions(data.questions)
    }
  }, [])

  useEffect(() => { if (authed) loadQuestions() }, [authed, loadQuestions])

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
      loadQuestions()
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

  if (checking) return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
    </div>
  )

  // LOGIN PAGE
  if (!authed) return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-40" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,50,30,0.6) 0%, rgba(0,10,5,0.95) 100%)" }} />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-yellow-500/40 bg-emerald-950">
            <Image src="/images/mosque-logo.png" alt="Logo" width={80} height={80} className="object-cover scale-110" />
          </div>
          <h1 className="font-serif text-yellow-400 text-2xl font-bold">Hazratnavoi.uz</h1>
          <p className="text-white/40 text-sm mt-1">Устоз панели</p>
        </div>

        {/* Arabic calligraphy decoration */}
        <div className="text-center mb-6">
          <p className="text-yellow-500/60 font-serif text-lg" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white/5 border border-yellow-500/20 rounded-2xl p-6 backdrop-blur">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Устоз кириши</p>
              <p className="text-white/40 text-xs">Фақат имом-хатиб учун</p>
            </div>
          </div>

          <div className="relative mb-4">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Парол"
              className="w-full bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-3 pr-10 text-white placeholder-white/25 focus:outline-none focus:border-yellow-500/50 text-sm"
              autoFocus
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {loginErr && <p className="text-red-400 text-xs mb-3 text-center">{loginErr}</p>}
          <button type="submit" disabled={logging || !password}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-40 text-emerald-950 font-bold py-3 rounded-xl transition-all">
            {logging ? "Текширилмоқда..." : "Кириш →"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">hazratnavoi.uz © {new Date().getFullYear()}</p>
      </div>
    </div>
  )

  // DASHBOARD
  return (
    <div className="min-h-screen bg-emerald-950 text-white">
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-20" />

      {/* Header */}
      <header className="relative border-b border-yellow-500/15 bg-emerald-950/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-1 ring-yellow-500/30">
              <Image src="/images/mosque-logo.png" alt="Logo" width={36} height={36} className="object-cover scale-110" />
            </div>
            <div>
              <p className="text-yellow-400 font-serif font-bold text-sm leading-none">Hazratnavoi.uz</p>
              <p className="text-white/40 text-xs">Устоз панели</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                {pendingCount} янги
              </span>
            )}
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-white/40 hover:text-red-400 text-xs transition-colors">
              <LogOut className="w-4 h-4" /> Чиқиш
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-4 py-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Жами саволлар", value: questions.length, color: "text-white" },
            { label: "Жавоб кутяпти", value: pendingCount, color: "text-red-400" },
            { label: "Жавоб берилган", value: questions.filter(q => q.answer).length, color: "text-emerald-400" },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-yellow-500/15 rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Arabic quote */}
        <div className="text-center mb-6">
          <p className="text-yellow-500/50 text-sm font-serif" dir="rtl">الْعِلْمُ نُورٌ</p>
          <p className="text-white/25 text-xs mt-0.5">Илм — нур</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Questions list */}
          <div>
            <div className="flex gap-2 mb-3">
              {(["pending", "answered", "all"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${filter === f ? "bg-yellow-500 text-emerald-950 border-yellow-500 font-semibold" : "border-white/20 text-white/50 hover:border-yellow-500/40"}`}>
                  {f === "pending" ? "⏳ Кутяпти" : f === "answered" ? "✅ Жавоб берилган" : "📋 Барчаси"}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="text-white/30 text-sm text-center py-6">Саволлар йўқ</p>
              )}
              {filtered.map(q => (
                <button key={q.id} onClick={() => { setSelected(q); setAnswer(q.answer || "") }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === q.id ? "border-yellow-500/50 bg-yellow-500/10" : "border-white/10 bg-white/3 hover:border-yellow-500/25 hover:bg-white/5"}`}>
                  <div className="flex items-start gap-2">
                    <MessageCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${q.answer ? "text-emerald-400" : "text-yellow-400"}`} />
                    <div className="min-w-0">
                      <p className="text-white text-sm leading-snug line-clamp-2">{q.question}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-white/30 text-xs">{q.user_name}</span>
                        {q.answer
                          ? <span className="text-emerald-400 text-xs flex items-center gap-0.5"><CheckCircle className="w-3 h-3" /> Жавоб берилган</span>
                          : <span className="text-yellow-400/70 text-xs flex items-center gap-0.5"><Clock className="w-3 h-3" /> Кутяпти</span>
                        }
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Answer panel */}
          <div>
            {selected ? (
              <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-5">
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-white/40 text-xs mb-1">Савол — {selected.user_name} ({selected.phone})</p>
                  <p className="text-white font-medium text-sm leading-relaxed">{selected.question}</p>
                </div>
                <form onSubmit={handleAnswer}>
                  <label className="block text-yellow-400/70 text-xs uppercase tracking-wider mb-2">Жавоб</label>
                  <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Жавобингизни ёзинг..."
                    rows={6}
                    className="w-full bg-white/5 border border-yellow-500/15 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-yellow-500/40 resize-none mb-3"
                  />
                  <button type="submit" disabled={sending || !answer.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 disabled:opacity-40 text-emerald-950 font-bold py-3 rounded-xl transition-all">
                    <Send className="w-4 h-4" />
                    {sending ? "Юборилмоқда..." : "Жавоб юбориш ва нашр этиш"}
                  </button>
                  <p className="text-white/25 text-xs text-center mt-2">Фойдаланувчига Telegram орқали хабар кетади</p>
                </form>
              </div>
            ) : (
              <div className="bg-white/3 border border-white/10 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="text-5xl mb-3 opacity-30">🕌</div>
                <p className="text-white/30 text-sm">Саволни танланг ва жавоб ёзинг</p>
                <p className="text-yellow-500/30 text-xs mt-2" dir="rtl">وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
