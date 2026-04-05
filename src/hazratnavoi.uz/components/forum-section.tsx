"use client"

import { useState, useEffect, useCallback } from "react"
import { MessageCircle, Send, Lock, ChevronDown, User, CheckCircle, Clock } from "lucide-react"
import { AuthModal } from "./auth-modal"

type Lang = "latin" | "cyrillic"
const label = (lang: Lang, l: string, c: string) => lang === "latin" ? l : c

interface Question {
  id: string
  user_name: string
  question: string
  answer: string | null
  answered_at: string | null
  answered_by: string | null
  created_at: string
}

interface CurrentUser {
  id: string
  phone: string
  name: string
}

export function ForumSection({ lang }: { lang: Lang }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [question, setQuestion] = useState("")
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/forum")
      const data = await res.json()
      setQuestions(data.questions || [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setSending(true)
    setSendMsg("")
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendMsg(data.error)
      } else {
        setSendMsg(label(lang, "Savol yuborildi! Imom-xatib tez orada javob beradi.", "Савол юборилди! Имом-хатиб тез орада жавоб беради."))
        setQuestion("")
        setTimeout(() => setSendMsg(""), 4000)
      }
    } finally {
      setSending(false)
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (d > 0) return `${d} кун олдин`
    if (h > 0) return `${h} соат олдин`
    return "Ҳозир"
  }

  return (
    <section id="forum" className="relative py-16 lg:py-20 bg-emerald-deep overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }}
        aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="w-8 h-px bg-yellow-500/60" />
            <span className="text-yellow-400/80 text-xs font-semibold uppercase tracking-widest">
              {label(lang, "Ochiq forum", "Очиқ форум")}
            </span>
            <span className="w-8 h-px bg-yellow-500/60" />
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl font-bold mb-3">
            {label(lang, "Forum", "Форум")}
          </h2>
          <p className="text-white/50 text-sm">
            {label(lang, "Savol bering — imom-xatib javob beradi. Kuniga 2 ta savol.", "Савол беринг — имом-хатиб жавоб беради. Кунига 2 та савол.")}
          </p>
        </div>

        {/* Savol yuborish */}
        <div className="mb-8 bg-white/5 border border-yellow-500/20 rounded-2xl p-5">
          {user ? (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-yellow-400" />
                </div>
                <span className="text-white/60 text-sm">{user.name || user.phone}</span>
              </div>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder={label(lang, "Savolingizni yozing...", "Саволингизни ёзинг...")}
                rows={3}
                className="w-full bg-white/5 border border-yellow-500/15 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-yellow-500/40 resize-none mb-3"
              />
              {sendMsg && (
                <p className={`text-xs mb-3 ${sendMsg.includes("юборилди") || sendMsg.includes("yuborildi") ? "text-emerald-400" : "text-red-400"}`}>
                  {sendMsg}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sending || question.trim().length < 10}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-emerald-900 font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? label(lang, "Yuborilmoqda...", "Юборилмоқда...") : label(lang, "Yuborish", "Юбориш")}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <Lock className="w-8 h-8 text-yellow-400/50 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-4">
                {label(lang, "Savol berish uchun ro'yxatdan o'ting", "Савол бериш учун рўйхатдан ўтинг")}
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-yellow-500 hover:bg-yellow-400 text-emerald-900 font-semibold text-sm px-6 py-2.5 rounded-full transition-all"
              >
                {label(lang, "Kirish / Ro'yxat", "Кириш / Рўйхат")}
              </button>
            </div>
          )}
        </div>

        {/* Savollar */}
        <div className="space-y-3">
          {loading && (
            <p className="text-center text-white/40 text-sm py-4">{label(lang, "Yuklanmoqda...", "Юкланмоқда...")}</p>
          )}
          {!loading && questions.length === 0 && (
            <p className="text-center text-white/40 text-sm py-4">
              {label(lang, "Hozircha savollar yo'q", "Ҳозирча саволлар йўқ")}
            </p>
          )}
          {questions.map(q => (
            <div key={q.id} className="bg-white/5 border border-yellow-500/15 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-yellow-400/60 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug">{q.question}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-white/30 text-xs">{q.user_name}</span>
                    <span className="text-white/20 text-xs">·</span>
                    <span className="text-white/30 text-xs">{timeAgo(q.created_at)}</span>
                    {q.answer ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle className="w-3 h-3" /> Жавоб бор
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-white/30 text-xs">
                        <Clock className="w-3 h-3" /> Кутилмоқда
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/30 flex-shrink-0 mt-0.5 transition-transform ${expanded === q.id ? "rotate-180" : ""}`} />
              </button>
              {expanded === q.id && q.answer && (
                <div className="px-5 pb-4 pl-12 border-t border-white/5">
                  <p className="text-xs text-yellow-400/70 mb-1.5 mt-3">{q.answered_by} · {q.answered_at ? timeAgo(q.answered_at) : ""}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={u => { setUser(u); setShowAuth(false) }}
        />
      )}
    </section>
  )
}
