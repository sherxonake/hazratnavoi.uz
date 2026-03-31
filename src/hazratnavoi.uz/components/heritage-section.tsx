import { PenLine, ScrollText } from "lucide-react"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

interface HeritageCard {
  icon: React.ReactNode
  titleLatin: string
  titleCyrillic: string
  quoteLatin: string
  quoteCyrillic: string
  authorLatin: string
  authorCyrillic: string
}

const CARDS: HeritageCard[] = [
  {
    icon: <PenLine className="w-7 h-7" aria-hidden="true" />,
    titleLatin: "Imom al-Buxoriy merosi",
    titleCyrillic: "Имом ал-Бухорий мероси",
    quoteLatin:
      "\"Ilm olish niyatida safar qilgan kishini Alloh taolo jannat yo'liga olib kiradi. Farishtalar ilm tolibiga qanotlarini yozadilar.\"",
    quoteCyrillic:
      "\"Илм олиш ниятида сафар қилган кишини Аллоҳ таоло жаннат йўлига олиб киради. Фаришталар илм толибига қанотларини ёзадилар.\"",
    authorLatin: "— Imom al-Buxoriy rahimahumulloh",
    authorCyrillic: "— Имом ал-Бухорий раҳимаҳумуллоҳ",
  },
  {
    icon: <ScrollText className="w-7 h-7" aria-hidden="true" />,
    titleLatin: "Hazrat Alisher Navoiy hikmatlari",
    titleCyrillic: "Ҳазрат Алишер Навоий ҳикматлари",
    quoteLatin:
      "\"Insonki qildi johillik aybi,\nAng bir ajal birla topmas ta'siri.\nFazilat ahlidin o'rgan adab,\nBu ilm birla topgay umr nashibi.\"",
    quoteCyrillic:
      "\"Инсонки қилди жоҳиллик айби,\nАнг бир ажал бирла топмас таъсири.\nФазилат аҳлидин ўргань адаб,\nБу илм бирла топгай умр насибаси.\"",
    authorLatin: "— Alisher Navoiy",
    authorCyrillic: "— Алишер Навоий",
  },
]

export function HeritageSection({ lang }: { lang: Lang }) {
  return (
    <section className="relative py-24 lg:py-32 bg-emerald-deep overflow-hidden">
      {/* Islamic geometric pattern overlay — gold toned */}
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" aria-hidden="true" />

      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="w-8 h-px bg-yellow-500/60" />
            <span className="text-yellow-400/80 text-xs font-semibold uppercase tracking-widest">
              {label(lang, "Buyuk meros", "Буюк мерос")}
            </span>
            <span className="w-8 h-px bg-yellow-500/60" />
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
            {label(lang, "Ilm va hikmat xazinasi", "Илм ва ҳикмат хазинаси")}
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto leading-relaxed">
            {label(
              lang,
              "Buyuk allomalarimiz va shoirlarimiz bizga qoldirgan ma'naviy meros.",
              "Буюк аллломаларимиз ва шоирларимиз бизга қолдирган маьнавий мерос."
            )}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className="group relative bg-white/5 border border-yellow-500/15 rounded-2xl p-8 lg:p-10 hover:bg-white/8 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-1 cursor-default"
            >
              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-yellow-500/20 rounded-tr-2xl" />
              </div>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-6 group-hover:bg-yellow-500/15 transition-colors duration-300">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-white text-xl sm:text-2xl font-bold mb-6 text-balance">
                {label(lang, card.titleLatin, card.titleCyrillic)}
              </h3>

              {/* Quote */}
              <blockquote className="border-l-2 border-yellow-500/40 pl-5">
                <p className="text-white/70 italic leading-relaxed text-sm sm:text-base whitespace-pre-line font-serif">
                  {label(lang, card.quoteLatin, card.quoteCyrillic)}
                </p>
                <footer className="mt-4 text-yellow-400/80 text-xs font-semibold not-italic tracking-wide">
                  {label(lang, card.authorLatin, card.authorCyrillic)}
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
