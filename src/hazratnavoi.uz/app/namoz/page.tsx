"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ArrowLeft, BookOpen, Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────
interface Step {
  id: string
  num: number
  name: string
  nameAr: string
  emoji: string
  pos: "standing" | "bowing" | "prostration" | "sitting" | "intent"
  action: string
  arabic?: string
  trans?: string
  uzbek?: string
  repeat?: number
  note?: string
  rakatNote?: string
}

interface PrayerType {
  id: string
  name: string
  nameAr: string
  rakats: number
  icon: string
  fajr?: boolean
}

// ── Data ───────────────────────────────────────────────────────────────────
const prayers: PrayerType[] = [
  { id: "bomdod", name: "Бомдод",  nameAr: "الفجر",   rakats: 2, icon: "🌅", fajr: true },
  { id: "peshin", name: "Пешин",   nameAr: "الظهر",   rakats: 4, icon: "☀️" },
  { id: "asr",    name: "Аср",     nameAr: "العصر",   rakats: 4, icon: "🌤" },
  { id: "shom",   name: "Шом",     nameAr: "المغرب",  rakats: 3, icon: "🌆" },
  { id: "xufton", name: "Хуфтон",  nameAr: "العشاء",  rakats: 4, icon: "🌙" },
]

const STEPS: Step[] = [
  {
    id: "niyat", num: 1, name: "Ният", nameAr: "النية", emoji: "🤲", pos: "intent",
    action: "Дилда намоз ўқишга ният тутилади. Оғиз билан айтилмайди.",
    note: "«Мен [намоз номи] намозини Аллоҳ учун ўқишга ният қилдим»",
  },
  {
    id: "takbir", num: 2, name: "Такбири таҳрима", nameAr: "تكبيرة الإحرام", emoji: "🙌", pos: "standing",
    action: "Иккала қўлни бош бармоқ қулоқ юмшоқларига тегадиган қилиб кўтарилади. «Аллоҳу Акбар» дейилиб, кўллар кўкрак остида боғланади.",
    arabic: "اَللّٰهُ أَكْبَرُ",
    trans: "Аллоҳу Акбар",
    uzbek: "Аллоҳ улуғдир",
  },
  {
    id: "subhanaka", num: 3, name: "Субҳанака", nameAr: "سبحانك", emoji: "📿", pos: "standing",
    action: "Такбиридан кейин дарҳол ўқилади. Фақат биринчи ракаатда.",
    arabic: "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالٰى جَدُّكَ، وَلاَ إِلٰهَ غَيْرُكَ",
    trans: "Субҳанакаллоҳумма ва биҳамдик, ва табаракасмук, ва таъала жаддук, ва ла илаҳа ғайрук",
    uzbek: "Эй Аллоҳ! Сен покдирсан, Ҳамд Сенгадир. Исминг муборакдир, улуғлиғинг олийдир. Сендан бошқа илоҳ йўқ.",
    rakatNote: "Фақат 1-ракаатда ўқилади",
  },
  {
    id: "fatiha", num: 4, name: "Фотиҳа сураси", nameAr: "سورة الفاتحة", emoji: "📖", pos: "standing",
    action: "Аввал «Аъузу басмала» ўқилиб, сўнгра Фотиҳа сураси ўқилади. Охирида «Омийн» тин овозда айтилади.",
    arabic: "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ۝ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ۝ مَٰلِكِ يَوۡمِ ٱلدِّينِ ۝ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ۝ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ",
    trans: "Алҳамду лиллаҳи Роббил-аламийн. Ар-Роҳманир-Роҳийм. Малики йавмид-дийн. Иyyака наъбуду ва иyyака настаъийн. Иҳдинас-сиротол мустақийм. Сироталлазийна анъамта алайҳим, ғайрил-мағдуби алайҳим ва лод-дооллийн.",
    uzbek: "Барча ҳамдлар — оламлар Парвардигори Аллоҳга хосдир. У Меҳрибон ва Раҳмлидир. Ҳисоб-китоб куни Мулкидир. Сенгагина ибодат қиламиз ва Сендангина мадад сўраймиз. Бизни тўғри йўлга бошла — ўзинг неъмат берган зотларнинг йўлига; ғазабга учраганлар ва адашганларнинг йўлига эмас.",
  },
  {
    id: "sura", num: 5, name: "Зам сура", nameAr: "السورة الزائدة", emoji: "📜", pos: "standing",
    action: "Фотиҳадан кейин қисқа сура ёки 3 та оят ўқилади.",
    arabic: "قُلۡ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ ۝ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
    trans: "Қул ҳуваллоҳу аҳад. Аллоҳус-Самад. Лам йалид ва лам йулад. Ва лам йакун лаҳу куфуван аҳад.",
    uzbek: "Айтинг: У Аллоҳ — Якка ва Ягонадир. Аллоҳ — бениёздир. У туғмаган ва туғилмаган. Унга тенг бўлгувчи биронта ҳам йўқдир.",
    note: "Мисол: Ихлос сураси (112-сура). 3-4-ракаатларда фақат Фотиҳа ўқилади.",
    rakatNote: "1-2-ракаатларда ўқилади",
  },
  {
    id: "ruku", num: 6, name: "Руку", nameAr: "الركوع", emoji: "🫱", pos: "bowing",
    action: "«Аллоҳу Акбар» деб белни тўғри букиш. Иккала қўл билан тиззаларни ушлаш. Бош, бел ва думба бир текис бўлсин.",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    trans: "Субҳана Рабийял-Азийм",
    uzbek: "Буюк Парвардигорим покдир",
    repeat: 3,
  },
  {
    id: "qawma", num: 7, name: "Қавма", nameAr: "القومة", emoji: "🧍", pos: "standing",
    action: "«Самиаллоҳу лиман ҳамидаҳ» деб рукудан тик туриш. Тўлиқ тик турилгач «Рабийана ва лакал-ҳамд» дейилади.",
    arabic: "سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ ۗ رَبَّنَا وَلَكَ الْحَمْدُ",
    trans: "Самиаллоҳу лиман ҳамидаҳ. Рабийана ва лакал-ҳамд.",
    uzbek: "Аллоҳ ўзини мақтаганни эшитади. Парвардигоримиз, Ҳамд Сенгадир.",
  },
  {
    id: "sajda1", num: 8, name: "Биринчи сажда", nameAr: "السجدة الأولى", emoji: "🙇", pos: "prostration",
    action: "«Аллоҳу Акбар» деб тизза → кафт → бурун → пешона тартибида сажда қилинади. Бурун ва пешона ерга тегиши фарз. Оёқ бармоқлари Қиблага қаратилади.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلٰى",
    trans: "Субҳана Рабийял-Аъла",
    uzbek: "Юксак Парвардигорим покдир",
    repeat: 3,
  },
  {
    id: "jalsa", num: 9, name: "Жалса", nameAr: "الجلسة", emoji: "🧘", pos: "sitting",
    action: "«Аллоҳу Акбар» деб икки сажда орасида ўтирилади. Чап оёқ ётиб, унинг устига ўтирилади. Ўнг оёқ бармоқлари Қиблага қаратилади. Иккала қўл тизза устида туради.",
    note: "Бир «Субҳаналлоҳ» айтадиган вақт ўтирилади",
  },
  {
    id: "sajda2", num: 10, name: "Иккинчи сажда", nameAr: "السجدة الثانية", emoji: "🙇", pos: "prostration",
    action: "Жалсадан «Аллоҳу Акбар» деб иккинчи саждага тушилади. Биринчи сажда каби адо этилади.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلٰى",
    trans: "Субҳана Рабийял-Аъла",
    uzbek: "Юксак Парвардигорим покдир",
    repeat: 3,
  },
  {
    id: "tahiyyat", num: 11, name: "Таҳиятту", nameAr: "التشهد", emoji: "☝️", pos: "sitting",
    action: "Иккинчи ракаат охирида (ва охирги ракаатда) ўтирилади. «Ашҳаду» сўзида кўрсаткич бармоқ кўтарилади, «илла» да туширилади.",
    arabic: "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلاَمُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لاَّ إِلٰهَ إِلاَّ اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    trans: "Аттаҳиятту лиллаҳи вас-салавату ват-тоyyибату. Ассаламу алайка аyyуҳан-набиyyу ва роҳматуллоҳи ва барокатуҳу. Ассаламу алайна ва ала ибадиллаҳис-солиҳийн. Ашҳаду алла илаҳа иллаллоҳу ва ашҳаду анна Муҳаммадан абдуҳу ва расулуҳ.",
    uzbek: "Барча таъзимлар, намозлар ва покликлар Аллоҳники. Сенга салом бўлсин, эй Пайғамбар, Аллоҳнинг раҳмати ва баракоти билан. Бизга ҳам, Аллоҳнинг солиҳ бандаларига ҳам салом. Гувоҳлик бераман: Аллоҳдан бошқа илоҳ йўқ; Муҳаммад Унинг бандаси ва элчисидир.",
    rakatNote: "2-ракаат охирида ва охирги ракаатда ўқилади",
  },
  {
    id: "salawat", num: 12, name: "Саловот Иброҳим", nameAr: "الصلاة الإبراهيمية", emoji: "✨", pos: "sitting",
    action: "Охирги ракаатда Таҳиятттудан кейин Саловот ўқилади.",
    arabic: "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيمَ وَعَلٰى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. وَبَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلٰى إِبْرَاهِيمَ وَعَلٰى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    trans: "Аллоҳумма салли ала Муҳаммадив ва ала али Муҳаммад, кама саллайта ала Иброҳийма ва ала али Иброҳийм, иннака ҳамийдум мажийд. Ва барик ала Муҳаммадив ва ала али Муҳаммад, кама баракта ала Иброҳийма ва ала али Иброҳийм, иннака ҳамийдум мажийд.",
    uzbek: "Эй Аллоҳ! Муҳаммад ва унинг аҳлига раҳматингни юбор, Иброҳим ва унинг аҳлига юборганинг каби. Сен мақталгувчи ва улуғсан. Муҳаммад ва унинг аҳлига баракотингни бер, Иброҳим ва унинг аҳлига берганинг каби. Сен мақталгувчи ва улуғсан.",
    rakatNote: "Фақат охирги ракаатда ўқилади",
  },
  {
    id: "dua", num: 13, name: "Дуои маъсура", nameAr: "الدعاء المأثور", emoji: "🤲", pos: "sitting",
    action: "Саловотдан кейин ихтиёрий дуо ўқилади.",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    trans: "Рабийана атина фид-дунйа ҳасанатан ва фил-аҳирати ҳасанатан ва қийна азабан-нар.",
    uzbek: "Парвардигоримиз! Бизга дунёда яхшилик бер, охиратда ҳам яхшилик бер ва бизни дўзах азобидан асра.",
    rakatNote: "Фақат охирги ракаатда ўқилади",
  },
  {
    id: "salam", num: 14, name: "Салом", nameAr: "السلام", emoji: "🕌", pos: "sitting",
    action: "Дастлаб ўнг томонга, кейин чап томонга юзни буриб салом берилади. Бу намозни тугатади.",
    arabic: "اَلسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ",
    trans: "Ассалому алайкум ва роҳматуллоҳ",
    uzbek: "Сизга тинчлик ва Аллоҳнинг раҳмати бўлсин",
    note: "Аввал ўнг томонга, кейин чап томонга айтилади",
  },
]

// ── Position icons ─────────────────────────────────────────────────────────
function PosIcon({ pos }: { pos: Step["pos"] }) {
  const icons: Record<Step["pos"], string> = {
    intent: "🧠", standing: "🕴", bowing: "🫱", prostration: "🙇", sitting: "🧘",
  }
  return <span className="text-2xl">{icons[pos]}</span>
}

// ── Rakat structure guide ──────────────────────────────────────────────────
function RakatGuide({ prayer }: { prayer: PrayerType }) {
  const r = prayer.rakats
  const rows = Array.from({ length: r }, (_, i) => i + 1)
  return (
    <div className="flex gap-2 items-center flex-wrap">
      {rows.map(i => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center text-yellow-300 text-sm font-bold">
            {i}
          </div>
          <div className="text-[9px] text-white/40 tracking-wide">ракаат</div>
        </div>
      ))}
      <div className="text-white/30 text-xs ml-2">
        {r === 2 ? "2 ракаат фарз" : r === 3 ? "3 ракаат фарз" : "4 ракаат фарз"}
      </div>
    </div>
  )
}

// ── Step card ──────────────────────────────────────────────────────────────
function StepCard({ step, defaultOpen }: { step: Step; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className={cn(
      "rounded-2xl border transition-all duration-300",
      open
        ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-emerald-900/20 shadow-lg shadow-yellow-500/5"
        : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
    )}>
      {/* Header row */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        onClick={() => setOpen(o => !o)}
      >
        {/* Step number */}
        <div className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
          open ? "bg-yellow-500 text-black" : "bg-white/8 text-white/50"
        )}>
          {step.num}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-semibold text-base transition-colors", open ? "text-yellow-200" : "text-white/80")}>
              {step.name}
            </span>
            <span className="text-white/30 text-sm font-arabic">{step.nameAr}</span>
            {step.rakatNote && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {step.rakatNote}
              </span>
            )}
          </div>
          {!open && step.trans && (
            <div className="text-white/30 text-xs mt-0.5 truncate">{step.trans}</div>
          )}
        </div>

        {/* Position icon */}
        <PosIcon pos={step.pos} />

        {/* Toggle */}
        <div className={cn("text-white/30 transition-colors", open && "text-yellow-400")}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Arabic text */}
          {step.arabic && (
            <div className="rounded-xl bg-gradient-to-br from-black/40 to-emerald-950/40 border border-yellow-500/15 p-5 text-right">
              <div className="font-arabic text-2xl md:text-3xl leading-[2] text-yellow-200 namoz-arabic">
                {step.arabic}
              </div>
              {step.repeat && (
                <div className="mt-2 text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/20">
                    × {step.repeat} марта
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Transliteration */}
          {step.trans && (
            <div className="space-y-1">
              <div className="text-[10px] text-emerald-400/60 uppercase tracking-widest font-semibold">Талаффуз</div>
              <div className="text-emerald-200/90 text-sm leading-relaxed italic">{step.trans}</div>
            </div>
          )}

          {/* Uzbek translation */}
          {step.uzbek && (
            <div className="space-y-1">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Маъноси</div>
              <div className="text-white/70 text-sm leading-relaxed">{step.uzbek}</div>
            </div>
          )}

          {/* Action */}
          <div className="flex gap-3 rounded-xl bg-emerald-900/20 border border-emerald-500/15 p-4">
            <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-white/65 text-sm leading-relaxed">{step.action}</div>
          </div>

          {/* Note */}
          {step.note && (
            <div className="flex gap-2 items-start text-yellow-300/60 text-xs">
              <span>💡</span>
              <span>{step.note}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function NamazPage() {
  const [selectedPrayer, setSelectedPrayer] = useState<string>("peshin")
  const [lang] = useState<"latin" | "cyrillic">("cyrillic")
  const prayer = prayers.find(p => p.id === selectedPrayer)!

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 namoz-bg-pattern opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-background pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Бош саҳифа
          </Link>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🕌</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Намоз ўқиш тартиби
            </h1>
            <p className="text-white/40 text-sm font-arabic text-xl">كيفية أداء الصلاة</p>
            <p className="text-white/40 text-sm mt-2">Ҳанафий мазҳаби бўйича</p>
          </div>

          {/* Prayer type selector */}
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            {prayers.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPrayer(p.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all",
                  selectedPrayer === p.id
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/25"
                    : "bg-white/8 text-white/60 hover:bg-white/12 border border-white/8"
                )}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-bold",
                  selectedPrayer === p.id ? "bg-black/20 text-black/70" : "bg-white/10 text-white/40"
                )}>
                  {p.rakats}р
                </span>
              </button>
            ))}
          </div>

          {/* Rakat indicator */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/4 border border-white/8">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-white/50 text-sm">{prayer.name} намози —</span>
              <RakatGuide prayer={prayer} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Rakat structure info ── */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900/30 to-emerald-950/30 border border-emerald-500/15 p-4">
          <div className="text-emerald-300 text-sm font-semibold mb-2">📋 {prayer.name} тузилмаси</div>
          <div className="text-white/50 text-xs leading-relaxed">
            {prayer.id === "bomdod" && "2 ракаат фарз. Ҳар ракаатда Фотиҳа + Зам сура. Охирида Таҳиятту + Саловот + Дуо + Салом."}
            {prayer.id === "shom"   && "3 ракаат фарз. 1-2-ракаатда Фотиҳа + Зам сура. 3-ракаатда фақат Фотиҳа. Иккинчи ракаатда Таҳиятту. Охирида Таҳиятту + Саловот + Дуо + Салом."}
            {(prayer.id === "peshin" || prayer.id === "asr" || prayer.id === "xufton") && "4 ракаат фарз. 1-2-ракаатда Фотиҳа + Зам сура. 3-4-ракаатда фақат Фотиҳа. Иккинчи ракаатда Таҳиятту. Охирида Таҳиятту + Саловот + Дуо + Салом."}
          </div>
        </div>
      </div>

      {/* ── Steps list ── */}
      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-2">
        <div className="text-white/30 text-xs uppercase tracking-widest font-semibold px-1 mb-3">
          Намоз қадамлари — {STEPS.length} та босқич
        </div>
        {STEPS.map((step, i) => (
          <StepCard key={step.id} step={step} defaultOpen={i === 0} />
        ))}

        {/* Footer note */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-yellow-500/8 to-transparent border border-yellow-500/15 p-5 text-center">
          <div className="text-4xl mb-3">🤲</div>
          <div className="text-yellow-200/70 text-sm leading-relaxed">
            Намоздан кейин тасбеҳ айтиш таvsия қилинади: <br/>
            <span className="text-yellow-300 font-semibold">Субҳаналлоҳ × 33 · Алҳамдулиллоҳ × 33 · Аллоҳу Акбар × 34</span>
          </div>
        </div>
      </div>
    </div>
  )
}
