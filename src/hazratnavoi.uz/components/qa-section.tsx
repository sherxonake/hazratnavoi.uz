"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import { useQA } from "@/hooks/use-qa"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function QASection({ lang }: { lang: Lang }) {
  const { qaPairs, loading, error } = useQA()
  return (
    <section id="savol" className="relative py-24 lg:py-32 bg-emerald-deep overflow-hidden">
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }} aria-hidden="true" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="w-8 h-px bg-yellow-500/60" />
            <span className="text-yellow-400/80 text-sm font-semibold uppercase tracking-widest">
              {label(lang, "Ko'p so'raladigan savollar", "Кўп сўраладиган саволлар")}
            </span>
            <span className="w-8 h-px bg-yellow-500/60" />
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl font-bold leading-tight text-balance mb-4">
            {label(lang, "Savol-javob", "Савол-жавоб")}
          </h2>
          <p className="text-white/50 leading-relaxed">
            {label(
              lang,
              "Din va ibodatga oid tez-tez beriladigan savollarga javoblar.",
              "Дин ва ибодатга оид тез-тез бериладиган саволларга жавоблар."
            )}
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {loading && (
            <div className="text-center py-8 text-white/50">
              {label(lang, "Savol-javoblar yuklanmoqda...", "Савол-жавоблар юкланмоқда...")}
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-red-500">
              {label(lang, "Xatolik: ", "Хатолик: ")} {error}
            </div>
          )}

          {!loading && !error && qaPairs.length === 0 && (
            <div className="text-center py-8 text-white/50">
              {label(lang, "Hozircha savol-javoblar yo'q", "Ҳозирча савол-жавоблар йўқ")}
            </div>
          )}

          {!loading && !error && qaPairs.map((item, i) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-white/5 border border-yellow-500/15 rounded-xl px-6 hover:bg-white/8 hover:border-yellow-500/30 data-[state=open]:border-yellow-500/40 data-[state=open]:shadow-md transition-all duration-300"
            >
              <AccordionTrigger className="flex items-start gap-3 text-left py-5 hover:no-underline group">
                <HelpCircle className="w-5 h-5 text-yellow-400/80 flex-shrink-0 mt-0.5 group-data-[state=open]:text-yellow-400" aria-hidden="true" />
                <span className="font-serif font-semibold text-white text-base leading-snug group-data-[state=open]:text-yellow-400 transition-colors duration-200">
                  {label(lang, item.question, item.question)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 pl-8 text-white/60 leading-relaxed text-sm">
                {label(lang, item.answer, item.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA to ask more */}
        <div className="mt-12 text-center p-8 bg-white/5 rounded-2xl border border-yellow-500/15">
          <p className="text-white font-serif font-semibold text-lg mb-2">
            {label(lang, "Savolingiz qolganmi?", "Саволингиз қолганми?")}
          </p>
          <p className="text-white/50 text-sm mb-5">
            {label(
              lang,
              "Bizga yozing — imom-xatib tez orada javob beradi.",
              "Бизга ёзинг — имом-хатиб тез орада жавоб беради."
            )}
          </p>
          <a
            href="#aloqa"
            className="inline-flex items-center gap-2 bg-yellow-500 text-emerald-900 font-semibold text-sm px-6 py-3 rounded-full hover:bg-yellow-400 hover:scale-105 transition-all duration-300 shadow-md"
          >
            {label(lang, "Savol yuborish", "Савол юбориш")}
          </a>
        </div>
      </div>
    </section>
  )
}
