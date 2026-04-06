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

// ── Prayer position illustrations — куфи + соқол + тўн ────────────────────
function PosIllustration({ pos, scale = 1 }: { pos: Step["pos"]; scale?: number }) {
  const c1 = "rgb(52 211 153 / 0.92)"   // бош, куфи, чизиқлар
  const c2 = "rgb(52 211 153 / 0.72)"   // тўн/гавда
  const c3 = "rgb(52 211 153 / 0.55)"   // соқол
  const W  = (n: number) => Math.round(n * scale)
  const H  = (n: number) => Math.round(n * scale)

  if (pos === "intent") return (
    // Такбир — қўллар қулоқ баробарига кўтарилган
    <svg viewBox="0 0 56 120" width={W(56)} height={H(120)} aria-hidden>
      {/* Куфи */}
      <ellipse cx="28" cy="6" rx="13" ry="7" fill={c1}/>
      {/* Бош */}
      <circle cx="28" cy="17" r="12" fill={c1}/>
      {/* Соқол */}
      <path d="M21 27 Q24 36 28 38 Q32 36 35 27 Q29 32 28 31 Q27 32 21 27 Z" fill={c3}/>
      {/* Тўн — елкадан товонгача кенгайиб боради */}
      <path d="M18 33 C16 55 11 84 8 117 L48 117 C45 84 40 55 38 33 Z" fill={c2}/>
      {/* Иккала қўл қулоқ баробарида */}
      <path d="M18 37 L3 26 L4 37" stroke={c1} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38 37 L53 26 L52 37" stroke={c1} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  if (pos === "standing") return (
    // Қиём — қўллар кўкрак остида боғлиқ
    <svg viewBox="0 0 56 120" width={W(56)} height={H(120)} aria-hidden>
      <ellipse cx="28" cy="6" rx="13" ry="7" fill={c1}/>
      <circle cx="28" cy="17" r="12" fill={c1}/>
      <path d="M21 27 Q24 36 28 38 Q32 36 35 27 Q29 32 28 31 Q27 32 21 27 Z" fill={c3}/>
      <path d="M18 33 C16 55 11 84 8 117 L48 117 C45 84 40 55 38 33 Z" fill={c2}/>
      {/* Боғлиқ қўллар — кўкрак остида */}
      <path d="M18 54 L7 61 L18 64 L25 65" stroke={c1} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M38 54 L49 61 L38 64 L31 65" stroke={c1} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  if (pos === "bowing") return (
    // Руку — гавда 90° эгилган, қўллар тиззада
    <svg viewBox="0 0 114 78" width={W(114)} height={H(78)} aria-hidden>
      {/* Бош ён томондан (олдинга қараган) */}
      <circle cx="14" cy="36" r="12" fill={c1}/>
      {/* Куфи (ён томонда, тик турибди) */}
      <ellipse cx="7" cy="28" rx="6" ry="13" fill={c1}/>
      {/* Соқол (ён томон) */}
      <path d="M14 47 Q18 53 23 49 Q18 51 14 47 Z" fill={c3} opacity=".8"/>
      {/* Тўн горизонтал */}
      <path d="M24 26 C30 26 66 19 76 19 L78 32 L77 44 C67 44 30 51 24 51 Z" fill={c2}/>
      {/* Оёқлар тик */}
      <rect x="59" y="42" width="13" height="32" rx="6.5" fill={c2}/>
      <rect x="76" y="40" width="13" height="32" rx="6.5" fill={c2}/>
      {/* Қўллар тиззагача тушган */}
      <path d="M50 33 L56 63" stroke={c1} fill="none" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M64 31 L70 63" stroke={c1} fill="none" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Товонлар */}
      <rect x="53" y="72" width="22" height="5" rx="2.5" fill={c1} opacity=".48"/>
      <rect x="70" y="72" width="22" height="5" rx="2.5" fill={c1} opacity=".48"/>
    </svg>
  )

  if (pos === "prostration") return (
    // Сажда — пешона, бурун, иккала кафт, тизза, оёқ бармоқлари ерга
    <svg viewBox="0 0 122 68" width={W(122)} height={H(68)} aria-hidden>
      {/* Ер */}
      <rect x="0" y="58" width="122" height="2" rx="1" fill={c1} opacity=".15"/>
      {/* Бош ён томондан */}
      <circle cx="16" cy="44" r="12" fill={c1}/>
      {/* Куфи ён томон */}
      <ellipse cx="9" cy="35" rx="6" ry="14" fill={c1}/>
      {/* Соқол */}
      <path d="M16 55 Q21 61 26 56 Q21 58 16 55 Z" fill={c3} opacity=".7"/>
      {/* Тўн қия юқорига */}
      <path d="M27 41 L84 14 L88 27 L31 54 Z" fill={c2}/>
      {/* Чап кафт ерда */}
      <ellipse cx="8"  cy="57" rx="10" ry="6" fill={c2} opacity=".85"/>
      {/* Ўнг кафт ерда */}
      <ellipse cx="28" cy="57" rx="10" ry="6" fill={c2} opacity=".85"/>
      {/* Тиззалар */}
      <ellipse cx="88"  cy="52" rx="12" ry="8.5" fill={c2}/>
      <ellipse cx="106" cy="52" rx="12" ry="8.5" fill={c2}/>
      {/* Оёқлар */}
      <path d="M80 18 L80 58" stroke={c2} fill="none" strokeWidth="9" strokeLinecap="round" opacity=".72"/>
      <path d="M96 14 L96 58" stroke={c2} fill="none" strokeWidth="9" strokeLinecap="round" opacity=".72"/>
    </svg>
  )

  // Ўтириш — жалса / таҳиятту
  return (
    <svg viewBox="0 0 68 92" width={W(68)} height={H(92)} aria-hidden>
      <ellipse cx="34" cy="6" rx="13" ry="7" fill={c1}/>
      <circle cx="34" cy="17" r="12" fill={c1}/>
      <path d="M27 27 Q30 36 34 38 Q38 36 41 27 Q35 32 34 31 Q33 32 27 27 Z" fill={c3}/>
      {/* Тик тўн */}
      <path d="M24 33 C23 45 21 55 20 64 L48 64 C47 55 45 45 44 33 Z" fill={c2}/>
      {/* Чап қўл чап тиззага */}
      <path d="M24 48 L11 64" stroke={c1} fill="none" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Ўнг қўл ўнг тиззага */}
      <path d="M44 48 L57 64" stroke={c1} fill="none" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Чап оёқ букилган */}
      <path d="M20 64 L5 71 L5 85 L22 85"  stroke={c1} fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Ўнг оёқ букилган */}
      <path d="M48 64 L63 71 L63 85 L46 85" stroke={c1} fill="none" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div className="flex justify-center py-4 overflow-hidden">
            <PosIllustration pos={step.pos} scale={1.6} />
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
