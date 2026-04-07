"use client"

import { useState, useEffect, useCallback } from "react"
import { Send, Lock, User } from "lucide-react"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/lib/auth-context"

type Lang = "latin" | "cyrillic"
const label = (lang: Lang, l: string, c: string) => lang === "latin" ? l : c

export function ForumSection({ lang }: { lang: Lang }) {
  const [showAuth, setShowAuth] = useState(false)
  const { user, setUser } = useAuth()
  const [question, setQuestion] = useState("")
  const [sending, setSending] = useState(false)
  const [sendMsg, setSendMsg] = useState("")

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

  return (
    <section id="forum" className="relative py-16 lg:py-20 bg-emerald-deep overflow-hidden">
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
