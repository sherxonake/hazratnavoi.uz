"use client"

import { useState } from "react"
import { X, Send, CheckCircle } from "lucide-react"

type Lang = "latin" | "cyrillic"
const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function QASection({ lang }: { lang: Lang }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState("")
  const [question, setQuestion] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !question.trim()) return
    setSending(true)
    setSendError("")
    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), question: question.trim() }),
      })
      if (!res.ok) throw new Error("Xatolik")
      setSent(true)
      setName("")
      setQuestion("")
      setTimeout(() => { setSent(false); setModalOpen(false) }, 3000)
    } catch {
      setSendError(label(lang, "Yuborishda xatolik. Qayta urinib ko'ring.", "Юборишда хатолик. Қайта уриниб кўринг."))
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="savol" className="relative py-16 lg:py-20 bg-emerald-deep overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }} aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <span className="w-8 h-px bg-yellow-500/60" />
            <span className="text-yellow-400/80 text-xs font-semibold uppercase tracking-widest">
              {label(lang, "Ko'p so'raladigan savollar", "Кўп сўраладиган саволлар")}
            </span>
            <span className="w-8 h-px bg-yellow-500/60" />
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl font-bold mb-3">
            {label(lang, "Savol-javob", "Савол-жавоб")}
          </h2>
          <p className="text-white/50 text-sm">
            {label(lang, "Din va ibodatga oid savollarga javoblar.", "Дин ва ибодатга оид саволларга жавоблар.")}
          </p>
        </div>

        {/* Ask question CTA */}
        <div className="mt-8 flex items-center justify-between bg-white/5 rounded-xl border border-yellow-500/15 px-6 py-5">
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">
              {label(lang, "Savolingiz qolganmi?", "Саволингиз қолганми?")}
            </p>
            <p className="text-white/40 text-xs">
              {label(lang, "Imom-xatib tez orada javob beradi", "Имом-хатиб тез орада жавоб беради")}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-400 text-emerald-900 font-semibold text-sm px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
          >
            {label(lang, "Savol yuborish", "Савол юбориш")}
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md bg-emerald-950 border border-yellow-500/25 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {sent ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <p className="text-white font-semibold text-lg mb-1">
                  {label(lang, "Yuborildi!", "Юборилди!")}
                </p>
                <p className="text-white/50 text-sm">
                  {label(lang, "Savolingiz imom-xatibga yetkazildi.", "Саволингиз имом-хатибга етказилди.")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="font-serif text-white text-xl font-bold mb-5">
                  {label(lang, "Savol yuborish", "Савол юбориш")}
                </h3>

                <div className="mb-4">
                  <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                    {label(lang, "Ism Sharifingiz", "Исм Шарифингиз")} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={label(lang, "Masalan: Abdulloh", "Масалан: Абдуллоҳ")}
                    required
                    className="w-full bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors"
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
                    {label(lang, "Savolingiz", "Саволингиз")} *
                  </label>
                  <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder={label(lang, "Savolingizni yozing...", "Саволингизни ёзинг...")}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                  />
                </div>

                {sendError && (
                  <p className="text-red-400 text-xs mb-3">{sendError}</p>
                )}

                <button
                  type="submit"
                  disabled={sending || !name.trim() || !question.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-emerald-900 font-semibold py-3 rounded-xl transition-all duration-200"
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
      )}
    </section>
  )
}
