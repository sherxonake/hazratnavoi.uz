"use client"

import { useState } from "react"
import { Send, CheckCircle, Lock, MessageSquare, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "./auth-modal"

type Lang = "latin" | "cyrillic"
const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function QASection({ lang }: { lang: Lang }) {
  const { user, setUser } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [question, setQuestion] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState("")

  function handleAskClick() {
    if (!user) {
      setShowAuth(true)
    } else {
      setModalOpen(true)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || question.trim().length < 5) return
    setSending(true)
    setSendError("")
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Xatolik")
      setSent(true)
      setQuestion("")
      setTimeout(() => { setSent(false); setModalOpen(false) }, 3500)
    } catch (err: unknown) {
      setSendError(err instanceof Error ? err.message : label(lang, "Yuborishda xatolik.", "Юборишда хатолик."))
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="savol" className="relative py-16 lg:py-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #021a0f 0%, #031508 100%)" }}>
      {/* Islamic pattern */}
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-[0.06]" aria-hidden="true" />
      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,10,5,0.5) 100%)" }} aria-hidden="true" />
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="w-10 h-px bg-gradient-to-r from-transparent to-yellow-500/60" />
            <span className="text-yellow-400/70 text-[11px] font-bold uppercase tracking-[0.2em]">
              {label(lang, "Savol-javob", "Савол-жавоб")}
            </span>
            <span className="w-10 h-px bg-gradient-to-l from-transparent to-yellow-500/60" />
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl font-bold mb-3">
            {label(lang, "Imomdan so'rang", "Имомдан сўранг")}
          </h2>
          <p className="text-yellow-500/40 text-sm font-serif" dir="rtl">وَمَا أُوتِيتُمْ مِنَ الْعِلْمِ إِلَّا قَلِيلًا</p>
          <p className="text-white/35 text-xs mt-2">
            {label(lang, "Din va ibodatga oid savolingizni yuboring", "Дин ва ибодатга оид саволингизни юборинг")}
          </p>
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-yellow-500/20 via-transparent to-yellow-600/10" />
          <div className="relative bg-white/[0.03] border border-yellow-500/15 rounded-2xl overflow-hidden">

            {/* Top accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />

            <div className="p-6 sm:p-8">
              {user ? (
                /* Logged in — show ask button */
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4.5 h-4.5 text-yellow-400/80" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {label(lang, "Savolingiz bormi?", "Саволингиз борми?")}
                      </p>
                      <p className="text-white/35 text-xs mt-0.5">
                        {label(lang, "Imom-xatib javob beradi", "Имом-хатиб жавоб беради")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAskClick}
                    className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-emerald-900 font-bold text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-yellow-500/20"
                  >
                    {label(lang, "So'rash", "Сўраш")}
                  </button>
                </div>
              ) : (
                /* Not logged in — show auth prompt */
                <div className="text-center py-4">
                  {/* Decorative top */}
                  <div className="flex items-center justify-center mb-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-yellow-500/8 border border-yellow-500/20 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-yellow-400/60" />
                      </div>
                      <div className="absolute inset-0 rounded-full animate-ping bg-yellow-500/5" />
                    </div>
                  </div>

                  <p className="text-white font-serif font-semibold text-base mb-1">
                    {label(lang, "Savol berish uchun kiring", "Савол бериш учун киринг")}
                  </p>
                  <p className="text-white/35 text-xs mb-5 leading-relaxed max-w-xs mx-auto">
                    {label(
                      lang,
                      "Ro'yxatdan o'tgan foydalanuvchilar imomdan javob oladi",
                      "Рўйхатдан ўтган фойдаланувчилар имомдан жавоб олади"
                    )}
                  </p>

                  <button
                    onClick={handleAskClick}
                    className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 active:scale-95 text-emerald-900 font-bold text-sm px-8 py-3 rounded-full transition-all duration-200 shadow-lg shadow-yellow-500/25"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                    </svg>
                    {label(lang, "Telegram orqali kirish", "Telegram орқали кириш")}
                  </button>

                  <p className="text-white/20 text-[11px] mt-4 font-serif" dir="rtl">
                    طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
                  </p>
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/15 to-transparent" />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={u => { setUser(u); setShowAuth(false); setModalOpen(true) }}
        />
      )}

      {/* Question Modal */}
      {modalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pb-0 sm:pb-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-emerald-950 border border-yellow-500/25 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {label(lang, "Savol yuborish", "Савол юбориш")}
                  </p>
                  <p className="text-white/30 text-xs">{user.name || user.phone}</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/25 hover:text-white/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {sent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-white font-serif font-bold text-lg mb-1">
                    {label(lang, "Yuborildi!", "Юборилди!")}
                  </p>
                  <p className="text-white/40 text-sm">
                    {label(lang, "Imom-xatib tez orada Telegram orqali javob beradi.", "Имом-хатиб тез орада Telegram орқали жавоб беради.")}
                  </p>
                  <p className="text-yellow-500/40 text-xs font-serif mt-3" dir="rtl">جَزَاكَ اللَّهُ خَيْرًا</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                      {label(lang, "Savolingiz", "Саволингиз")} *
                    </label>
                    <textarea
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder={label(lang, "Savolingizni yozing...", "Саволингизни ёзинг...")}
                      required
                      rows={4}
                      autoFocus
                      className="w-full bg-white/5 border border-yellow-500/15 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-yellow-500/40 transition-colors resize-none"
                    />
                    <p className="text-white/20 text-xs mt-1.5">
                      {label(lang, "Kamida 5 ta belgi", "Камида 5 та белги")} ({question.trim().length})
                    </p>
                  </div>

                  {sendError && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-xs">{sendError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending || question.trim().length < 5}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-emerald-900 font-bold py-3 rounded-xl transition-all duration-200"
                  >
                    <Send className="w-4 h-4" />
                    {sending
                      ? label(lang, "Yuborilmoqda...", "Юборилмоқда...")
                      : label(lang, "Yuborish", "Юбориш")
                    }
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
