"use client"

import { useState } from "react"
import { X, Phone, Shield, User, CheckCircle } from "lucide-react"

type Step = "phone" | "bot_instructions" | "code" | "name" | "done"

interface AuthModalProps {
  onClose: () => void
  onSuccess: (user: { id: string; phone: string; name: string }) => void
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "")
    if (!digits.startsWith("998")) return "+998"
    return "+" + digits.slice(0, 12)
  }

  async function handleSendOtp() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (data.error === "BOT_NOT_STARTED") {
        setStep("bot_instructions")
      } else if (!res.ok) {
        setError(data.error)
      } else {
        setStep("code")
      }
    } catch {
      setError("Хатолик юз берди")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
      } else {
        onSuccess(data.user)
        setStep("done")
        setTimeout(onClose, 2000)
      }
    } catch {
      setError("Хатолик юз берди")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-emerald-950 border border-yellow-500/25 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 text-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6 text-yellow-400" />
          </div>
          <h3 className="text-white font-serif font-bold text-lg">
            {step === "done" ? "Кирдингиз!" : "Kirish / Ro'yxatdan o'tish"}
          </h3>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">

          {/* STEP 1: Telefon */}
          {step === "phone" && (
            <div className="space-y-4">
              <p className="text-white/50 text-sm text-center">
                Ўзбекистон телефон рақамингизни киритинг
              </p>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(formatPhone(e.target.value))}
                  placeholder="+998 90 123 45 67"
                  className="w-full bg-white/5 border border-yellow-500/20 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-yellow-500/50"
                />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                onClick={handleSendOtp}
                disabled={loading || phone.length < 13}
                className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-emerald-900 font-semibold py-3 rounded-xl transition-all"
              >
                {loading ? "Текширилмоқда..." : "Давом этиш →"}
              </button>
            </div>
          )}

          {/* STEP 2: Bot instructions */}
          {step === "bot_instructions" && (
            <div className="space-y-4 text-center">
              <p className="text-white/70 text-sm leading-relaxed">
                Аввал Telegramda ботни очинг ва рақамингизни улашинг:
              </p>
              <a
                href="https://t.me/hazratnavoiy2fa_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                </svg>
                @hazratnavoiy2fa_bot
              </a>
              <p className="text-white/40 text-xs">
                Ботда /start босиб, рақамингизни улашгандан сўнг:
              </p>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-emerald-900 font-semibold py-3 rounded-xl transition-all"
              >
                {loading ? "Текширилмоқда..." : "Код юбориш"}
              </button>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
          )}

          {/* STEP 3: OTP kod */}
          {step === "code" && (
            <div className="space-y-4">
              <p className="text-white/60 text-sm text-center">
                <span className="text-yellow-400">@hazratnavoiy2fa_bot</span> дан келган 6 рақамли кодни киритинг
              </p>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="· · · · · ·"
                className="w-full bg-white/5 border border-yellow-500/20 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[0.5em] placeholder-white/20 focus:outline-none focus:border-yellow-500/50"
              />
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Исмингиз (ихтиёрий)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Абдуллоҳ"
                    className="w-full bg-white/5 border border-yellow-500/20 rounded-xl pl-9 pr-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-yellow-500/50"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-emerald-900 font-semibold py-3 rounded-xl transition-all"
              >
                {loading ? "Текширилмоқда..." : "Тасдиқлаш ✓"}
              </button>
              <button onClick={() => { setStep("phone"); setCode("") }} className="w-full text-white/30 text-xs hover:text-white/50 transition-colors">
                ← Орқага
              </button>
            </div>
          )}

          {/* STEP 4: Done */}
          {step === "done" && (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-yellow-400 mx-auto mb-3" />
              <p className="text-white font-semibold text-lg">Хуш келибсиз!</p>
              <p className="text-white/50 text-sm mt-1">Муваффақиятли кирдингиз</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
