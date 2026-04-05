"use client"

import { useState } from "react"
import { Play, MapPin, Clock, Users, Star, ChevronDown, ChevronUp } from "lucide-react"

const FACTS = [
  { icon: <MapPin className="w-5 h-5" />, label: "Жойлашуви", value: "Ҳижоз, Саудия Арабистони" },
  { icon: <Users className="w-5 h-5" />, label: "Аҳолиси", value: "2 миллиондан ортиқ" },
  { icon: <Clock className="w-5 h-5" />, label: "Ҳарам мажмуаси", value: "356 000 м²" },
  { icon: <Star className="w-5 h-5" />, label: "Ислом қиблагоҳи", value: "Масжид ул-Ҳаром" },
]

const INFO_BLOCKS = [
  {
    title: "Масжид ул-Ҳаром",
    text: "Масжид ул-Ҳаром — дунёдаги энг улуғ ва муқаддас масжид. У Каъба — мусулмонлар қибласи атрофида қурилган. Ҳар йили миллионлаб зиёратчилар бу муборак маконга Ҳаж ва Умра учун ташриф буюради.",
  },
  {
    title: "Каъба",
    text: "Каъба — Ислом оламининг маркази ҳисобланади. Ривоятга кўра, уни дастлаб Иброҳим алайҳиссалом ва ўғли Исмоил алайҳиссалом қурган. Мусулмонлар намоз ўқиганда Каъба томонга юзланади.",
  },
  {
    title: "Замзам қудуғи",
    text: "Замзам — Масжид ул-Ҳаром ичидаги муборак қудуқ. У минглаб йиллардан бери тиниксиз оқиб, зиёратчиларга шифобахш сув беради. Замзам суви Ислом оламида энг азиз неъматлардан бири.",
  },
  {
    title: "Ҳаж ва Умра",
    text: "Ҳаж — Исломнинг бешинчи рукни. Имкони бор ҳар бир мусулмон умрида бир марта Ҳаж қилиши фарздир. Умра эса нафл зиёрат бўлиб, йилнинг исталган вақтида адо этилади.",
  },
]

export function MakkahSection({ lang }: { lang: "latin" | "cyrillic" }) {
  const [liveOpen, setLiveOpen] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section id="makkah" className="relative py-24 lg:py-32 bg-emerald-deep overflow-hidden">
      {/* Pattern + vignette */}
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-yellow-500/60" />
            <span className="text-yellow-400/80 text-xs uppercase tracking-[0.2em]">Муқаддас қадамгоҳ</span>
            <div className="h-px w-12 bg-yellow-500/60" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Макка Мукаррама
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Мусулмонлар учун энг муқаддас шаҳар — Каъба, Масжид ул-Ҳаром ва Замзам қудуғи макони
          </p>
        </div>

        {/* Live stream */}
        <div className="mb-14">
          <button
            onClick={() => setLiveOpen(!liveOpen)}
            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-yellow-500/20 rounded-2xl px-6 py-4 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-semibold text-sm sm:text-base">Масжид ул-Ҳаром — жонли эфир</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Play className="w-4 h-4" />
              {liveOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {liveOpen && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-yellow-500/20 bg-black aspect-video">
              <iframe
                src="https://www.youtube.com/embed/TS6GNE5oZmo?autoplay=1&mute=1"
                title="Масжид ул-Ҳаром жонли эфири"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* Facts row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {FACTS.map((f) => (
            <div key={f.label} className="bg-white/5 border border-yellow-500/15 rounded-xl p-4 text-center">
              <div className="flex justify-center text-yellow-400 mb-2">{f.icon}</div>
              <p className="text-white/50 text-xs mb-1">{f.label}</p>
              <p className="text-white font-semibold text-sm">{f.value}</p>
            </div>
          ))}
        </div>

        {/* Info accordion */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {INFO_BLOCKS.map((block, i) => (
            <div key={i} className="bg-white/5 border border-yellow-500/15 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white font-semibold text-sm sm:text-base">{block.title}</span>
                {expanded === i
                  ? <ChevronUp className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-yellow-400/60 flex-shrink-0" />
                }
              </button>
              {expanded === i && (
                <div className="px-6 pb-5">
                  <p className="text-white/70 text-sm leading-relaxed">{block.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
