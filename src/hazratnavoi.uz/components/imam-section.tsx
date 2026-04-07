"use client"

import Image from "next/image"
import { PlayCircle, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useImamMessages } from "@/hooks/use-imam-messages"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function ImamSection({ lang }: { lang: Lang }) {
  const { messages, loading } = useImamMessages()
  const imamMessage = messages[0]
  return (
    <section id="maruzalar" className="relative py-24 lg:py-32 bg-emerald-deep overflow-hidden">
      {/* Subtle Islamic pattern background */}
      <div className="absolute inset-0 islamic-pattern-girih pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }} aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <span className="w-8 h-px bg-yellow-500/60" />
          <span className="text-yellow-400/80 text-sm font-semibold uppercase tracking-widest">
            {label(lang, "Imom minbari", "Имом минбари")}
          </span>
          <span className="w-8 h-px bg-yellow-500/60" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Portrait */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative gold ring */}
              <div className="absolute -inset-3 rounded-2xl border border-yellow-500/20 pointer-events-none" aria-hidden="true" />
              <div className="absolute -inset-6 rounded-2xl border border-yellow-500/10 pointer-events-none" aria-hidden="true" />

              <div className="relative w-72 h-96 sm:w-80 sm:h-[26rem] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/imam-portrait.jpg"
                  alt="Темуржон домла Атоев — Бош имом-хатиб"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 288px, 320px"
                />
                {/* Subtle gradient at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Name tag floating */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-56 bg-emerald-800 border border-yellow-500/30 rounded-xl px-4 py-3 shadow-xl text-center">
                <p className="text-yellow-400 font-serif font-bold text-sm">Темуржон домла Атоев</p>
                <p className="text-white/60 text-xs mt-0.5">
                  {label(lang, "Bosh imom-xatib", "Бош имом-хатиб")}
                </p>
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex flex-col gap-8 pt-6 lg:pt-0">
            <div>
              <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance mb-2">
                {label(lang, "Bosh imom-xatib", "Бош имом-хатиб")}
              </h2>
              <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
                {label(lang, "minbari", "минбари")}
              </h2>
            </div>

            {/* Blockquote */}
            <blockquote className="relative pl-5 border-l-2 border-yellow-500/40">
              <Quote className="absolute -top-2 -left-1 w-5 h-5 text-yellow-500/30" aria-hidden="true" />
              <p className="text-white/70 italic leading-relaxed text-base sm:text-lg font-serif">
                {label(
                  lang,
                  "\"Bilim izlash har bir musulmonga farzdir. Ilm bilan nurlanган qalb — eng kuchli qalqon va eng ulug' boylikdir.\"",
                  "\"Илм излаш ҳар бир мусулмонга фарздир. Илм билан нурланган қалб — энг кучли қалқон ва энг улуғ бойликдир.\""
                )}
              </p>
              <footer className="mt-3 text-sm font-semibold text-yellow-400 not-italic">
                — {label(lang, "Temurjon domla Atoev", "Темуржон домла Атоев")}
              </footer>
            </blockquote>

            <p className="text-white/70 leading-relaxed">
              {label(
                lang,
                "Hazrat Navoiy jome masjidining bosh imom-xatibi sifatida xalqimizga ma'naviy rahbarlik qilib kelmoqda. Juma mav'izalari har hafta onlayn efirga uzatiladi.",
                "Ҳазрат Навоий жоме масжидининг бош имом-хатиби сифатида халқимизга маънавий раҳбарлик қилиб келмоқда. Жума мавъизалари ҳар ҳафта онлайн эфирга узатилади."
              )}
            </p>

            <a
              href="https://www.youtube.com/@hazratnavoiuz"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start"
            >
              <Button
                size="lg"
                className="bg-yellow-500 text-emerald-900 hover:bg-yellow-400 rounded-full px-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <PlayCircle className="w-5 h-5 mr-2" aria-hidden="true" />
                {label(lang, "Juma mav'izasini tinglash", "Жума мавъизасини тинглаш")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
