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
}

// ── Data ───────────────────────────────────────────────────────────────────
const prayers: PrayerType[] = [
  { id: "bomdod", name: "Бомдод", nameAr: "الفجر",  rakats: 2 },
  { id: "peshin", name: "Пешин",  nameAr: "الظهر",  rakats: 4 },
  { id: "asr",    name: "Аср",    nameAr: "العصر",  rakats: 4 },
  { id: "shom",   name: "Шом",    nameAr: "المغرب", rakats: 3 },
  { id: "xufton", name: "Хуфтон", nameAr: "العشاء", rakats: 4 },
]

const STEPS: Step[] = [
  {
    id: "niyat", num: 1, name: "Ният", nameAr: "النية", pos: "intent",
    action: "Дилда намоз ўқишга ният тутилади. Оғиз билан айтилмайди.",
    note: "«Мен [намоз номи] намозини Аллоҳ учун ўқишга ният қилдим»",
  },
  {
    id: "takbir", num: 2, name: "Такбири таҳрима", nameAr: "تكبيرة الإحرام", pos: "intent",
    action: "Иккала қўлни бош бармоқ қулоқ юмшоқларига тегадиган қилиб кўтарилади. «Аллоҳу Акбар» дейилиб, қўллар кўкрак остида боғланади.",
    arabic: "اَللّٰهُ أَكْبَرُ",
    trans: "Аллоҳу Акбар",
    uzbek: "Аллоҳ улуғдир",
  },
  {
    id: "subhanaka", num: 3, name: "Субҳанака", nameAr: "سبحانك", pos: "standing",
    action: "Такбиридан кейин дарҳол ўқилади. Фақат биринчи ракаатда.",
    arabic: "سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالٰى جَدُّكَ، وَلاَ إِلٰهَ غَيْرُكَ",
    trans: "Субҳанакаллоҳумма ва биҳамдик, ва табаракасмук, ва таъала жаддук, ва ла илаҳа ғайрук",
    uzbek: "Эй Аллоҳ! Сен покдирсан, Ҳамд Сенгадир. Исминг муборакдир, улуғлиғинг олийдир. Сендан бошқа илоҳ йўқ.",
    rakatNote: "Фақат 1-ракаатда",
  },
  {
    id: "fatiha", num: 4, name: "Фотиҳа сураси", nameAr: "سورة الفاتحة", pos: "standing",
    action: "Аввал «Аъузу басмала» ўқилиб, сўнгра Фотиҳа сураси ўқилади. Охирида «Омийн» тин овозда айтилади.",
    arabic: "ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ۝ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ۝ مَٰلِكِ يَوۡمِ ٱلدِّينِ ۝ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ۝ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ",
    trans: "Алҳамду лиллаҳи Роббил-аламийн. Ар-Роҳманир-Роҳийм. Малики йавмид-дийн. Иyyака наъбуду ва иyyака настаъийн. Иҳдинас-сиротол мустақийм. Сироталлазийна анъамта алайҳим, ғайрил-мағдуби алайҳим ва лод-дооллийн.",
    uzbek: "Барча ҳамдлар — оламлар Парвардигори Аллоҳга хосдир. У Меҳрибон ва Раҳмлидир. Ҳисоб-китоб куни Мулкидир. Сенгагина ибодат қиламиз ва Сендангина мадад сўраймиз. Бизни тўғри йўлга бошла — ўзинг неъмат берган зотларнинг йўлига; ғазабга учраган ва адашганларнинг йўлига эмас.",
  },
  {
    id: "sura", num: 5, name: "Зам сура", nameAr: "السورة الزائدة", pos: "standing",
    action: "Фотиҳадан кейин қисқа сура ёки 3 та оят ўқилади.",
    arabic: "قُلۡ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ ۝ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
    trans: "Қул ҳуваллоҳу аҳад. Аллоҳус-Самад. Лам йалид ва лам йулад. Ва лам йакун лаҳу куфуван аҳад.",
    uzbek: "Айтинг: У Аллоҳ — Якка ва Ягонадир. Аллоҳ — бениёздир. У туғмаган ва туғилмаган. Унга тенг бўлгувчи биронта ҳам йўқдир.",
    note: "Мисол: Ихлос сураси (112-сура).",
    rakatNote: "1-2-ракаатларда",
  },
  {
    id: "ruku", num: 6, name: "Руку", nameAr: "الركوع", pos: "bowing",
    action: "«Аллоҳу Акбар» деб белни тўғри букиш. Иккала қўл билан тиззаларни ушлаш. Бош, бел ва думба бир текис бўлсин.",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    trans: "Субҳана Рабийял-Азийм",
    uzbek: "Буюк Парвардигорим покдир",
    repeat: 3,
  },
  {
    id: "qawma", num: 7, name: "Қавма", nameAr: "القومة", pos: "standing",
    action: "«Самиаллоҳу лиман ҳамидаҳ» деб рукудан тик туриш. Тўлиқ тик турилгач «Рабийана ва лакал-ҳамд» дейилади.",
    arabic: "سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ ۗ رَبَّنَا وَلَكَ الْحَمْدُ",
    trans: "Самиаллоҳу лиман ҳамидаҳ. Рабийана ва лакал-ҳамд.",
    uzbek: "Аллоҳ ўзини мақтаганни эшитади. Парвардигоримиз, Ҳамд Сенгадир.",
  },
  {
    id: "sajda1", num: 8, name: "Биринчи сажда", nameAr: "السجدة الأولى", pos: "prostration",
    action: "«Аллоҳу Акбар» деб тизза → кафт → бурун → пешона тартибида сажда қилинади. Бурун ва пешона ерга тегиши фарз. Оёқ бармоқлари Қиблага қаратилади.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلٰى",
    trans: "Субҳана Рабийял-Аъла",
    uzbek: "Юксак Парвардигорим покдир",
    repeat: 3,
  },
  {
    id: "jalsa", num: 9, name: "Жалса", nameAr: "الجلسة", pos: "sitting",
    action: "«Аллоҳу Акбар» деб икки сажда орасида ўтирилади. Чап оёқ ётиб, унинг устига ўтирилади. Ўнг оёқ бармоқлари Қиблага қаратилади. Иккала қўл тизза устида туради.",
    note: "Бир «Субҳаналлоҳ» айтадиган вақт ўтирилади",
  },
  {
    id: "sajda2", num: 10, name: "Иккинчи сажда", nameAr: "السجدة الثانية", pos: "prostration",
    action: "Жалсадан «Аллоҳу Акбар» деб иккинчи саждага тушилади. Биринчи сажда каби адо этилади.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلٰى",
    trans: "Субҳана Рабийял-Аъла",
    uzbek: "Юксак Парвардигорим покдир",
    repeat: 3,
  },
  {
    id: "tahiyyat", num: 11, name: "Таҳиятту", nameAr: "التشهد", pos: "sitting",
    action: "Иккинчи ракаат охирида (ва охирги ракаатда) ўтирилади. «Ашҳаду» сўзида кўрсаткич бармоқ кўтарилади, «илла» да туширилади.",
    arabic: "اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلاَمُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لاَّ إِلٰهَ إِلاَّ اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    trans: "Аттаҳиятту лиллаҳи вас-салавату ват-тоyyибату. Ассаламу алайка аyyуҳан-набиyyу ва роҳматуллоҳи ва барокатуҳу. Ассаламу алайна ва ала ибадиллаҳис-солиҳийн. Ашҳаду алла илаҳа иллаллоҳу ва ашҳаду анна Муҳаммадан абдуҳу ва расулуҳ.",
    uzbek: "Барча таъзимлар, намозлар ва покликлар Аллоҳники. Сенга салом бўлсин, эй Пайғамбар, Аллоҳнинг раҳмати ва баракоти билан. Бизга ҳам, Аллоҳнинг солиҳ бандаларига ҳам салом. Гувоҳлик бераман: Аллоҳдан бошқа илоҳ йўқ; Муҳаммад Унинг бандаси ва элчисидир.",
    rakatNote: "2-ракаат ва охирги ракаатда",
  },
  {
    id: "salawat", num: 12, name: "Саловот Иброҳим", nameAr: "الصلاة الإبراهيمية", pos: "sitting",
    action: "Охирги ракаатда Таҳиятттудан кейин ўқилади.",
    arabic: "اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيمَ وَعَلٰى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. وَبَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلٰى إِبْرَاهِيمَ وَعَلٰى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    trans: "Аллоҳумма салли ала Муҳаммадив ва ала али Муҳаммад, кама саллайта ала Иброҳийма ва ала али Иброҳийм, иннака ҳамийдум мажийд. Ва барик ала Муҳаммадив ва ала али Муҳаммад, кама баракта ала Иброҳийма ва ала али Иброҳийм, иннака ҳамийдум мажийд.",
    uzbek: "Эй Аллоҳ! Муҳаммад ва унинг аҳлига раҳматингни юбор, Иброҳим ва унинг аҳлига юборганинг каби. Сен мақталгувчи ва улуғсан. Муҳаммад ва унинг аҳлига баракотингни бер, Иброҳим ва унинг аҳлига берганинг каби. Сен мақталгувчи ва улуғсан.",
    rakatNote: "Фақат охирги ракаатда",
  },
  {
    id: "dua", num: 13, name: "Дуои маъсура", nameAr: "الدعاء المأثور", pos: "sitting",
    action: "Саловотдан кейин ихтиёрий дуо ўқилади.",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    trans: "Рабийана атина фид-дунйа ҳасанатан ва фил-аҳирати ҳасанатан ва қийна азабан-нар.",
    uzbek: "Парвардигоримиз! Бизга дунёда яхшилик бер, охиратда ҳам яхшилик бер ва бизни дўзах азобидан асра.",
    rakatNote: "Фақат охирги ракаатда",
  },
  {
    id: "salam", num: 14, name: "Салом", nameAr: "السلام", pos: "sitting",
    action: "Дастлаб ўнг томонга, кейин чап томонга юзни буриб салом берилади. Бу намозни тугатади.",
    arabic: "اَلسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ",
    trans: "Ассалому алайкум ва роҳматуллоҳ",
    uzbek: "Сизга тинчлик ва Аллоҳнинг раҳмати бўлсин",
    note: "Аввал ўнг томонга, кейин чап томонга айтилади",
  },
]

// ── Prayer position illustrations (SVG) ────────────────────────────────────
function PosIllustration({ pos }: { pos: Step["pos"] }) {
  const emerald = "rgb(52 211 153 / 0.82)"
  const body    = "rgb(52 211 153 / 0.72)"

  if (pos === "intent") return (
    // Такбир — қўллар қулоққа кўтарилган
    <svg viewBox="0 0 48 100" width={48} height={100} aria-hidden>
      <circle cx="24" cy="11" r="10" fill={emerald}/>
      <path d="M16 22 Q24 20 32 22 L34 60 L14 60 Z" fill={body}/>
      <path d="M16 28 L5 20 L6 30" stroke={emerald} fill="none" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 28 L43 20 L42 30" stroke={emerald} fill="none" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="60" width="8"  height="34" rx="4" fill={body}/>
      <rect x="26" y="60" width="8"  height="34" rx="4" fill={body}/>
    </svg>
  )

  if (pos === "standing") return (
    // Қиём — қўллар кўкракда боғлиқ
    <svg viewBox="0 0 48 100" width={48} height={100} aria-hidden>
      <circle cx="24" cy="11" r="10" fill={emerald}/>
      <path d="M16 22 Q24 20 32 22 L34 60 L14 60 Z" fill={body}/>
      <path d="M16 34 L8 40 L17 43 L23 43" stroke={emerald} fill="none" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M32 34 L40 40 L31 43 L25 43" stroke={emerald} fill="none" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="14" y="60" width="8"  height="34" rx="4" fill={body}/>
      <rect x="26" y="60" width="8"  height="34" rx="4" fill={body}/>
    </svg>
  )

  if (pos === "bowing") return (
    // Руку — белни букиш
    <svg viewBox="0 0 96 64" width={96} height={64} aria-hidden>
      <circle cx="10" cy="28" r="10" fill={emerald}/>
      <rect x="20" y="22" width="44" height="12" rx="6" fill={body}/>
      <line x1="42" y1="34" x2="42" y2="52" stroke={emerald} strokeWidth="5.5" strokeLinecap="round"/>
      <line x1="56" y1="34" x2="56" y2="52" stroke={emerald} strokeWidth="5.5" strokeLinecap="round"/>
      <rect x="37" y="34" width="9" height="24" rx="4.5" fill={body}/>
      <rect x="50" y="34" width="9" height="24" rx="4.5" fill={body}/>
      <rect x="32" y="56" width="16" height="6" rx="3" fill={body} opacity=".6"/>
      <rect x="46" y="56" width="16" height="6" rx="3" fill={body} opacity=".6"/>
    </svg>
  )

  if (pos === "prostration") return (
    // Сажда — пешона ерга
    <svg viewBox="0 0 108 58" width={108} height={58} aria-hidden>
      <rect x="0" y="50" width="108" height="2" rx="1" fill={emerald} opacity=".18"/>
      <circle cx="13" cy="40" r="10" fill={emerald}/>
      <path d="M21 36 L68 14 L72 24 L25 46 Z" fill={body}/>
      <ellipse cx="7"  cy="50" rx="7" ry="5" fill={body} opacity=".75"/>
      <ellipse cx="24" cy="50" rx="7" ry="5" fill={body} opacity=".75"/>
      <ellipse cx="76" cy="46" rx="9" ry="7" fill={body} opacity=".85"/>
      <ellipse cx="92" cy="46" rx="9" ry="7" fill={body} opacity=".85"/>
      <line x1="68" y1="20" x2="68" y2="50" stroke={body} strokeWidth="6" strokeLinecap="round" opacity=".7"/>
      <line x1="82" y1="14" x2="82" y2="50" stroke={body} strokeWidth="6" strokeLinecap="round" opacity=".7"/>
    </svg>
  )

  // sitting — жалса / таҳиятту
  return (
    <svg viewBox="0 0 58 80" width={58} height={80} aria-hidden>
      <circle cx="29" cy="11" r="10" fill={emerald}/>
      <path d="M21 22 Q29 20 37 22 L39 52 L19 52 Z" fill={body}/>
      <line x1="21" y1="38" x2="10" y2="52" stroke={emerald} strokeWidth="5" strokeLinecap="round"/>
      <line x1="37" y1="38" x2="48" y2="52" stroke={emerald} strokeWidth="5" strokeLinecap="round"/>
      <path d="M19 52 L6 58 L6 70 L20 70"  stroke={emerald} fill="none" strokeWidth="8"  strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M39 52 L52 58 L52 70 L38 70" stroke={emerald} fill="none" strokeWidth="8"  strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// ── Prayer type icons (small SVG) ──────────────────────────────────────────
function PrayerIcon({ id }: { id: string }) {
  const g = "currentColor"
  if (id === "bomdod") return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path d="M12 3 A9 9 0 0 0 3 12 A9 9 0 0 1 12 3 Z" fill={g} opacity=".9"/>
      <circle cx="19" cy="5" r="2" fill={g} opacity=".7"/>
      <line x1="6" y1="20" x2="18" y2="20" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
  if (id === "peshin") return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <circle cx="12" cy="12" r="5" fill={g}/>
      <line x1="12" y1="2"  x2="12" y2="4"  stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="12" y1="20" x2="12" y2="22" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="2"  y1="12" x2="4"  y2="12" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="12" x2="22" y2="12" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5"  y1="5"  x2="6.5" y2="6.5" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="17.5" y1="17.5" x2="19" y2="19" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="19" y1="5"  x2="17.5" y2="6.5" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6.5" y1="17.5" x2="5" y2="19" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
  if (id === "asr") return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <circle cx="12" cy="10" r="5" fill={g}/>
      <line x1="12" y1="2"  x2="12" y2="4"  stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="4"  y1="10" x2="6"  y2="10" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="10" x2="20" y2="10" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6"  y1="4"  x2="7.5" y2="5.5" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="18" y1="4"  x2="16.5" y2="5.5" stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="4" y1="20" x2="20" y2="20" stroke={g} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
  if (id === "shom") return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path d="M3 14 Q12 6 21 14" fill={g} opacity=".3"/>
      <path d="M3 14 Q12 5 21 14 L21 20 L3 20 Z" fill={g} opacity=".55"/>
      <line x1="12" y1="2"  x2="12" y2="5"  stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="4"  y1="6"  x2="6"  y2="8"  stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="20" y1="6"  x2="18" y2="8"  stroke={g} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
  // xufton - moon
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path d="M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z" fill={g} opacity=".9"/>
      <circle cx="19" cy="5"  r="1.2" fill={g} opacity=".6"/>
      <circle cx="17" cy="9"  r="0.8" fill={g} opacity=".5"/>
      <circle cx="21" cy="9"  r="0.7" fill={g} opacity=".4"/>
    </svg>
  )
}

// ── Tasbeh / prayer beads SVG ──────────────────────────────────────────────
function TasbehSVG() {
  const cx = 56, cy = 52, rx = 38, ry = 28
  const count = 33
  const beads = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    return {
      x: Math.round((cx + rx * Math.cos(angle)) * 100) / 100,
      y: Math.round((cy + ry * Math.sin(angle)) * 100) / 100,
      big: i === 0 || i === 11 || i === 22,
    }
  })
  return (
    <svg viewBox="0 0 120 112" width={120} height={112} aria-hidden className="text-yellow-400/80">
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="currentColor" strokeWidth="1" opacity=".25"/>
      {beads.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={b.big ? 5 : 3.5}
          fill="currentColor" opacity={b.big ? 0.95 : 0.65}/>
      ))}
      {/* Tassel string from bottom */}
      <line x1={cx} y1={cy + ry} x2={cx} y2={cy + ry + 14} stroke="currentColor" strokeWidth="1.5" opacity=".4"/>
      <circle cx={cx} cy={cy + ry + 18} r={4.5} fill="currentColor" opacity=".9"/>
      <line x1={cx} y1={cy + ry + 22.5} x2={cx} y2={cy + ry + 30} stroke="currentColor" strokeWidth="1.5" opacity=".35"/>
    </svg>
  )
}

// ── Rakat structure guide ──────────────────────────────────────────────────
function RakatGuide({ prayer }: { prayer: PrayerType }) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      {Array.from({ length: prayer.rakats }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center text-yellow-300 text-sm font-bold">
            {i + 1}
          </div>
          <div className="text-[9px] text-white/40 tracking-wide">ракаат</div>
        </div>
      ))}
      <div className="text-white/30 text-xs ml-2">
        {prayer.rakats === 2 ? "2 ракаат фарз" : prayer.rakats === 3 ? "3 ракаат фарз" : "4 ракаат фарз"}
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
      <button className="w-full flex items-center gap-4 px-5 py-4 text-left" onClick={() => setOpen(o => !o)}>
        <div className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
          open ? "bg-yellow-500 text-black" : "bg-white/8 text-white/50"
        )}>
          {step.num}
        </div>
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
        {/* Position illustration — shown always */}
        <div className={cn("flex-shrink-0 transition-opacity", open ? "opacity-100" : "opacity-40")}>
          <PosIllustration pos={step.pos} />
        </div>
        <div className={cn("text-white/30 transition-colors flex-shrink-0", open && "text-yellow-400")}>
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Big illustration in expanded view */}
          <div className="flex justify-center py-2">
            <div className="opacity-90 scale-125">
              <PosIllustration pos={step.pos} />
            </div>
          </div>

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

          {step.trans && (
            <div className="space-y-1">
              <div className="text-[10px] text-emerald-400/60 uppercase tracking-widest font-semibold">Талаффуз</div>
              <div className="text-emerald-200/90 text-sm leading-relaxed italic">{step.trans}</div>
            </div>
          )}

          {step.uzbek && (
            <div className="space-y-1">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Маъноси</div>
              <div className="text-white/70 text-sm leading-relaxed">{step.uzbek}</div>
            </div>
          )}

          <div className="flex gap-3 rounded-xl bg-emerald-900/20 border border-emerald-500/15 p-4">
            <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-white/65 text-sm leading-relaxed">{step.action}</div>
          </div>

          {step.note && (
            <div className="flex gap-2 items-start text-yellow-300/60 text-xs">
              <span className="mt-0.5">💡</span>
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
  const prayer = prayers.find(p => p.id === selectedPrayer)!

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 namoz-bg-pattern opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-background pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />Бош саҳифа
          </Link>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
                <path d="M32 4 L44 16 L60 16 L60 48 L4 48 L4 16 L20 16 Z" fill="rgb(52 211 153 / 0.25)" stroke="rgb(52 211 153 / 0.6)" strokeWidth="1.5"/>
                <path d="M20 16 Q32 4 44 16" fill="rgb(52 211 153 / 0.18)" stroke="rgb(52 211 153 / 0.5)" strokeWidth="1.5"/>
                <path d="M24 48 L24 32 Q32 26 40 32 L40 48" fill="rgb(52 211 153 / 0.3)" stroke="rgb(52 211 153 / 0.5)" strokeWidth="1"/>
                <path d="M28 48 L28 34 Q32 31 36 34 L36 48" fill="rgb(52 211 153 / 0.4)"/>
                <circle cx="32" cy="2"  r="2.5" fill="rgb(253 224 71 / 0.8)"/>
                <line x1="32" y1="4.5" x2="32" y2="8" stroke="rgb(253 224 71 / 0.6)" strokeWidth="1.2"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Намоз ўқиш тартиби</h1>
            <p className="text-white/40 font-arabic text-xl">كيفية أداء الصلاة</p>
            <p className="text-white/35 text-sm mt-1">Ҳанафий мазҳаби бўйича</p>
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
                <span className={selectedPrayer === p.id ? "text-black/70" : "text-emerald-400"}>
                  <PrayerIcon id={p.id} />
                </span>
                <span>{p.name}</span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                  selectedPrayer === p.id ? "bg-black/20 text-black/70" : "bg-white/10 text-white/40"
                )}>{p.rakats}р</span>
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

      {/* Rakat structure info */}
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

      {/* Steps */}
      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-2">
        <div className="text-white/30 text-xs uppercase tracking-widest font-semibold px-1 mb-3">
          Намоз қадамлари — {STEPS.length} та босқич
        </div>
        {STEPS.map((step, i) => (
          <StepCard key={step.id} step={step} defaultOpen={i === 0} />
        ))}

        {/* Tasbeh / zikr section */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-yellow-500/8 to-transparent border border-yellow-500/15 p-6">
          <div className="flex flex-col items-center gap-4">
            <TasbehSVG />
            <div className="text-center">
              <div className="text-yellow-300/80 text-sm font-semibold mb-3">Намоздан кейинги тасбеҳ зикри</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-xl bg-white/4 border border-white/8 px-4 py-2.5">
                  <span className="text-white/50">سُبْحَانَ اللّٰهِ</span>
                  <span className="text-white/70 font-arabic text-base">Субҳаналлоҳ</span>
                  <span className="text-yellow-300 font-bold text-xs px-2 py-1 rounded-full bg-yellow-500/12 border border-yellow-500/20">× 33</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-white/4 border border-white/8 px-4 py-2.5">
                  <span className="text-white/50">اَلْحَمْدُ لِلّٰهِ</span>
                  <span className="text-white/70 font-arabic text-base">Алҳамдулиллоҳ</span>
                  <span className="text-yellow-300 font-bold text-xs px-2 py-1 rounded-full bg-yellow-500/12 border border-yellow-500/20">× 33</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-white/4 border border-white/8 px-4 py-2.5">
                  <span className="text-white/50">اَللّٰهُ أَكْبَرُ</span>
                  <span className="text-white/70 font-arabic text-base">Аллоҳу Акбар</span>
                  <span className="text-yellow-300 font-bold text-xs px-2 py-1 rounded-full bg-yellow-500/12 border border-yellow-500/20">× 34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
