"use client"

import { useState, useRef } from "react"
import { ChevronDown, ChevronUp, Info, Play, Pause, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Gender = "erkak" | "ayol"
interface Step {
  id: string; num: number; name: string; nameAr: string
  action?: string; arabic?: string; trans?: string; uzbek?: string
  repeat?: number; note?: string; rakatNote?: string
  imageM: string; imageW: string; audio?: string; womenNote?: string
}
interface PrayerType { id: string; name: string; nameAr: string; rakats: number }

const I = (f: string) => `/namoz/images/${f}`
const A = (f: string) => `/namoz/audio/${encodeURIComponent(f)}`

const M = {
  niyat:    I("m_niyat.png"),
  takbir:   I("m2.gif"),
  qiyam:    I("m3.gif"),
  ruku:     I("m6.gif"),
  sajda:    I("m8.gif"),
  jalsa:    I("m9.gif"),
  qada:     I("m11.gif"),
  salam:    I("m1.gif"),
}
const W = {
  niyat:    I("niyat_woman.svg"),
  takbir:   I("takbir_woman.svg"),
  qiyam:    I("qiyom_woman.svg"),
  ruku:     I("ruku_woman.svg"),
  sajda:    I("sajda_woman.png"),
  jalsa:    I("sajdadan_woman.svg"),
  qada:     I("salom_woman.svg"),
  salam:    I("salom2_woman.svg"),
}

const prayers: PrayerType[] = [
  { id: "bomdod", name: "Бомдод", nameAr: "الفجر",  rakats: 2 },
  { id: "peshin", name: "Пешин",  nameAr: "الظهر",  rakats: 4 },
  { id: "asr",    name: "Аср",    nameAr: "العصر",  rakats: 4 },
  { id: "shom",   name: "Шом",    nameAr: "المغرب", rakats: 3 },
  { id: "xufton", name: "Хуфтон", nameAr: "العشاء", rakats: 4 },
]

const STEPS: Step[] = [
  {
    id: "niyat", num: 1, name: "Ният қилиш", nameAr: "النية",
    imageM: M.niyat, imageW: W.niyat,
    action: "Намоз вақти киргач, таҳорат билан, пок кийим билан, покиза жойда туриб, қиблага юзланамиз ва ният қиламиз. Масалан, «Холис Аллоҳ учун бомдод намозининг икки ракъат фарзини ўқишга ният қилдим» деган мазмунда ният қиламиз.",
    note: "Ниятни дилда тутиш фарз, тил билан айтиш суннат.",
  },
  {
    id: "takbir", num: 2, name: "Такбири таҳрима", nameAr: "تكبيرة الإحرام",
    imageM: M.takbir, imageW: W.takbir, audio: A("Allohu Akbar.mp3"),
    action: "«Аллоҳу акбар» деб, қўлнинг бармоқларини ўз ҳолида очиқ тутиб, қулоқ баробарида кўтарамиз. Кейин ўнг қўлни чап қўлнинг устига қўйиб, киндик остида боғлаймиз.",
    arabic: "اللَّهُ أَكْبَرُ",
    trans: "Аллоҳу Акбар", uzbek: "Аллоҳ буюкдир",
    womenNote: "Аёллар қўлларини елка баробарида кўтаради (қулоқ юмшоқларига эмас). Аллоҳу акбар дегандан сўнг ўнг қўл чап қўл устига қилиниб, кўкрак устига боғланади.",
  },
  {
    id: "sano", num: 3, name: "Қиём — Сано", nameAr: "سبحانك",
    imageM: M.qiyam, imageW: W.qiyam, audio: A("Sano.mp3"),
    action: "Такбиридан кейин дарҳол ўқилади. Агар имомга иқтидо қилган бўлсак, «сано»дан бошқа нарсани айтмаймиз.",
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ.",
    trans: "Субҳанакаллоҳумма ва биҳамдик, ва табаракасмук, ва таъала жаддук, ва ла илаҳа ғайрук.",
    uzbek: "Аллоҳим! Сени поклаб ҳамдинг билан ёд этаман. Сенинг номинг табаррукдир, кибриёинг улуғдир, Сендан ўзга илоҳ йўқдир.",
    rakatNote: "Фақат 1-ракаатда",
  },
  {
    id: "fatiha", num: 4, name: "Қиём — Фотиҳа", nameAr: "سورة الفاتحة",
    imageM: M.qiyam, imageW: W.qiyam, audio: A("Fotiha.mp3"),
    action: "Сўнгра ичимизда «Аъузу биллаҳи минаш шайтонир рожийм. Бисмиллаҳир роҳманир роҳийм»ни айтамиз.",
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۝ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    trans: "Аъузу биллаҳи минаш шайтонир рожийм. Бисмиллаҳир роҳманир роҳийм. Алҳамду лиллаҳи роббил-оламийн. Ар-роҳманир-роҳийм. Малики йавмид-дийн. Иyyака наъбуду ва иyyака настаъийн. Иҳдинас-сироталмустақийм. Сироталлазийна анъамта алайҳим, ғайрил-мағдуби алайҳим ва лад-доллийн.",
    uzbek: "Қувилган шайтондан Аллоҳнинг паноҳини сўрайман. Меҳрибон ва раҳмли Аллоҳ номи ила. Ҳамд оламларнинг Робби – Аллоҳгадир. У Роҳман ва Роҳиймдир. Жазо-мукофот кунининг эгасидир. Фақат Сенгагина ибодат қиламиз ва фақат Сендангина ёрдам сўраймиз. Бизни тўғри йўлга ҳидоят қилгин.",
  },
  {
    id: "sura", num: 5, name: "Қиём — Зам сура", nameAr: "السورة الزائدة",
    imageM: M.qiyam, imageW: W.qiyam, audio: A("Nas surasi.mp3"),
    action: "Фотиҳадан кейин қисқа сура ёки уч оят ўқилади. Мисол учун Нас сураси.",
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    trans: "Бисмиллаҳир роҳманир роҳийм. Қул аъузу бироббин-наас. Маликин-наас. Илаҳин-наас. Мин шаррил васвасил-ханнас. Аллазий йувасвису фий судурин-наас. Минал жиннати ван-наас.",
    uzbek: "Одамлар Роббидан, одамлар Подшоҳидан, одамлар Илоҳидан беркиниб-кўриниб турувчи васвасачининг ёмонлигидан паноҳ сўрайман. У одамларнинг кўксларига васваса солади — жинлардан ҳам, одамлардан ҳам.",
    note: "1-2-ракаатларда фақат. Мисол: Ихлос, Кавсар, Нас сурасини.",
    rakatNote: "1–2-ракаатларда",
  },
  {
    id: "ruku", num: 6, name: "Рукуъ", nameAr: "الركوع",
    imageM: M.ruku, imageW: W.ruku, audio: A("Ruku2.mp3"),
    action: "Фотиҳа ёки зам сурадан кейин такбир айтиб, рукуъга эгиламиз. Рукуъда болдирлар тик туради, икки қўл билан тиззаларни чангаллаб турамиз, тиззани букмаймиз, бошни эгмаймиз. Орқамиз ҳам текис туриши керак.",
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    trans: "Субҳана Роббиял Азийм", uzbek: "Улуғ Роббим нуқсонлардан покдир.", repeat: 3,
    womenNote: "Аёллар рукуъда кам эгилади. Қўл бармоқлари ёпилган ҳолда тиззага қўйилади (тиззани ушламайди). Тиззалар бироз эгилган ҳолатда бўлади.",
  },
  {
    id: "qawma", num: 7, name: "Қавма", nameAr: "القومة",
    imageM: M.qiyam, imageW: W.qiyam, audio: A("Ruku.mp3"),
    action: "Намозни ёлғиз ўқиётган бўлсак, «Самиъаллоҳу лиман ҳамидаҳ» деб, қаддимизни тиклаймиз ва «Роббанаа, лакал ҳамд» деймиз.",
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ",
    trans: "Самиаллоҳу лиман ҳамидаҳ. Роббана ва лакал ҳамд.",
    uzbek: "Ким ҳамд айтса, Аллоҳ уни эшитади. Роббимиз, Сенга ҳамд бўлсин.",
  },
  {
    id: "sajda1", num: 8, name: "Биринчи сажда", nameAr: "السجدة الأولى",
    imageM: M.sajda, imageW: W.sajda, audio: A("Sajda.mp3"),
    action: "Қаддимизни тўлиқ тиклаб, тик туриб олгач, такбир айтиб, саждага кетамиз. Саждага бораётганида аввал тиззани, кейин қўлни ерга қўямиз, кейин эса икки қўлнинг орасига бошимизни қўямиз.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    trans: "Субҳана Роббиял Аъла", uzbek: "Олий Роббим нуқсонлардан покдир.", repeat: 3,
    womenNote: "Аёллар саждада тирсакларини ерга теккизади. Оёқ ва тиззалар бир-бирига ёпишган бўлади. Бадан йиғилган, ихчам ҳолатда бўлади.",
  },
  {
    id: "jalsa", num: 9, name: "Жалса", nameAr: "الجلسة",
    imageM: M.jalsa, imageW: W.jalsa,
    action: "Кейин такбир айтиб, саждадан бошни кўтарамиз ва чап оёқни ётқизиб, унинг устига ўтирамиз. Ўнг оёқ тик ҳолатда қолади, бармоқлари қиблага қараб туради. Икки қўлимиз икки тиззанинг устида бўлади.",
    note: "Бир «Субҳаналлоҳ» айтадиган вақт ўтирилади.",
    womenNote: "Аёллар икки оёқларини ўнг томонга йўналтириб чап сонлари устига ўтирадилар. Қўл бармоқлари жипс ҳолатда икки сонга қўйилади.",
  },
  {
    id: "sajda2", num: 10, name: "Иккинчи сажда", nameAr: "السجدة الثانية",
    imageM: M.sajda, imageW: W.sajda, audio: A("Sajda.mp3"),
    action: "Кейин такбир айтиб, иккинчи саждага борамиз ва камида уч марта «Субҳаана роббиял аъла» деймиз.",
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    trans: "Субҳана Роббиял Аъла", uzbek: "Олий Роббим нуқсонлардан покдир.", repeat: 3,
  },
  {
    id: "rakat2", num: 11, name: "Иккинчи ракаат", nameAr: "الركعة الثانية",
    imageM: M.qiyam, imageW: W.qiyam,
    action: "Яна такбир айтиб, кейинги ракъатга турамиз. Саждадан туришда аввал бошни, кейин қўлларни, кейин тиззани кўтарамиз. Иккинчи ракъат ҳам худди биринчи ракъатга ўхшаб ўқилади. Фақат бошида такбири таҳрима, сано ва «аъузу» айтилмайди.",
    rakatNote: "2–4-ракаатларда",
  },
  {
    id: "qada", num: 12, name: "Қаъда — Ташаҳҳуд", nameAr: "التشهد",
    imageM: M.qada, imageW: W.qada, audio: A("Attahiyat.mp3"),
    action: "Иккинчи ракъатнинг иккинчи саждасини қилиб бўлгандан кейин чап оёқ устига ўтирамиз. Ташаҳҳуд ўқилади.",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.",
    trans: "Аттаҳиyyату лиллаҳи вас-салавату ват-тоyyибату. Ассаламу алайка аyyуҳан-набиyyу ва роҳматуллоҳи ва барокатуҳу. Ассаламу алайна ва ала ибадиллаҳис-солиҳийн. Ашҳаду алла илаҳа иллаллоҳу ва ашҳаду анна Муҳаммадан абдуҳу ва расулуҳ.",
    uzbek: "Барокатли табриклар ва покиза салавотлар Аллоҳ учундир. Эй Набий! Сенга салом, Аллоҳнинг раҳмати ва баракаси бўлсин. Бизларга ва Аллоҳнинг солиҳ бандаларига салом бўлсин.",
    rakatNote: "2-ракаат ва охирги ракаатда",
    womenNote: "Аёллар икки оёқларини ўнг томонга йўналтириб чап сонлари устига ўтирадилар. Ўнг қўл ўнг тизза устига, чап қўл чап тизза устига, бармоқлари жипс ҳолатда қўйилади.",
  },
  {
    id: "salawat", num: 13, name: "Саловот ва Дуо", nameAr: "الصلاة الإبراهيمية",
    imageM: M.qada, imageW: W.qada, audio: A("Salovat.mp3"),
    action: "Агар намози икки ракъатли бўлса, ташаҳҳуддан кейин салавотлар ўқийди. Сўнгра ихтиёрий дуо ўқиш мумкин.",
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ.",
    trans: "Аллоҳумма солли ала Муҳаммадив ва ала али Муҳаммад, кама соллайта ала Иброҳийма ва ала али Иброҳийм, иннака ҳамидум мажийд.",
    uzbek: "Аллоҳим! Иброҳимга ва Иброҳимнинг аҳли байтларига Ўз раҳматингни нозил қилганингдек, Муҳаммадга ва Муҳаммаднинг оила аъзоларига Ўзингнинг зиёда раҳматларингни нозил қилгин!",
    rakatNote: "Охирги ракаатда",
  },
  {
    id: "salam", num: 14, name: "Салом", nameAr: "السلام",
    imageM: M.salam, imageW: W.salam, audio: A("Salom.mp3"),
    action: "Дастлаб ўнг томонга, кейин чап томонга юзни буриб салом берилади.",
    arabic: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ",
    trans: "Ассалому алайкум ва роҳматуллоҳ.",
    uzbek: "Сизга тинчлик-омонлик, Аллоҳнинг раҳмати бўлсин.",
    note: "Аввал ўнг томонга, кейин чап томонга айтилади.",
  },
]

// ── Audio Player ───────────────────────────────────────────────────────────────
function AudioPlayer({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const ref = useRef<HTMLAudioElement>(null)
  const toggle = () => {
    if (!ref.current) return
    if (playing) { ref.current.pause(); setPlaying(false) }
    else { ref.current.play().catch(() => {}); setPlaying(true) }
  }
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !duration) return
    const r = e.currentTarget.getBoundingClientRect()
    ref.current.currentTime = ((e.clientX - r.left) / r.width) * duration
  }
  const fmt = (s: number) => isNaN(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
  return (
    <div className="flex items-center gap-3 rounded-xl bg-emerald-950/70 border border-emerald-500/25 px-4 py-3">
      <button onClick={toggle} className="w-10 h-10 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 flex items-center justify-center text-emerald-300 transition-all active:scale-95 flex-shrink-0">
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
      </button>
      <div className="flex-1 space-y-1.5">
        <div className="h-2 bg-white/8 rounded-full overflow-hidden cursor-pointer" onClick={seek}>
          <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>{fmt(current)}</span>
          <span className="flex items-center gap-1"><Volume2 className="w-2.5 h-2.5" />тиловат</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
      <audio ref={ref} src={src}
        onTimeUpdate={() => { const a = ref.current; if (a) { setCurrent(a.currentTime); setProgress((a.currentTime / a.duration) * 100 || 0) } }}
        onLoadedMetadata={() => { if (ref.current) setDuration(ref.current.duration) }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0) }} />
    </div>
  )
}

// ── GIF Player ────────────────────────────────────────────────────────────────
function GifPlayer({ src, alt }: { src: string; alt: string }) {
  const [active, setActive] = useState(false)
  const [seed, setSeed] = useState(0)
  const isGif = src.endsWith(".gif")
  if (!isGif) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="max-h-52 w-auto object-contain rounded-lg mx-auto" draggable={false} />
  }
  return (
    <div className="flex flex-col items-center gap-2">
      {active
        // eslint-disable-next-line @next/next/no-img-element
        ? <img key={seed} src={src} alt={alt} className="max-h-52 w-auto object-contain rounded-lg" draggable={false} />
        : <button onClick={() => { setActive(true); setSeed(s => s + 1) }}
            className="w-36 h-36 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95">
            <Play className="w-8 h-8 text-emerald-400" />
            <span className="text-xs text-muted-foreground">Анимация кўриш</span>
          </button>
      }
      {active && (
        <button onClick={() => setSeed(s => s + 1)} className="text-[11px] text-emerald-400/70 hover:text-emerald-300 transition-colors">
          ↺ Қайта бошлаш
        </button>
      )}
    </div>
  )
}

// ── Prayer Icon ────────────────────────────────────────────────────────────────
function PrayerIcon({ id }: { id: string }) {
  const g = "currentColor"
  if (id === "bomdod") return <svg viewBox="0 0 24 24" width={16} height={16}><path d="M12 3 A9 9 0 0 0 3 12 A9 9 0 0 1 12 3 Z" fill={g} /><circle cx="19" cy="5" r="2" fill={g} opacity=".7" /></svg>
  if (id === "peshin") return <svg viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="12" r="5" fill={g} />{["0","45","90","135","180","225","270","315"].map((deg, i) => <line key={i} x1="12" y1="2" x2="12" y2="4" stroke={g} strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${deg} 12 12)`} />)}</svg>
  if (id === "asr") return <svg viewBox="0 0 24 24" width={16} height={16}><circle cx="12" cy="10" r="5" fill={g} /><line x1="4" y1="20" x2="20" y2="20" stroke={g} strokeWidth="2" strokeLinecap="round" /></svg>
  if (id === "shom") return <svg viewBox="0 0 24 24" width={16} height={16}><path d="M3 16 Q12 6 21 16 L21 20 L3 20 Z" fill={g} opacity=".7" /></svg>
  return <svg viewBox="0 0 24 24" width={16} height={16}><path d="M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z" fill={g} /></svg>
}

// ── Step Card ─────────────────────────────────────────────────────────────────
function StepCard({ step, gender }: { step: Step; gender: Gender }) {
  const [open, setOpen] = useState(false)
  const img = gender === "erkak" ? step.imageM : step.imageW
  return (
    <div className={cn("rounded-2xl border transition-all overflow-hidden",
      open ? "border-yellow-400/50 bg-card" : "border-[var(--border)] bg-card/60 hover:border-yellow-400/30")}>
      <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left" onClick={() => setOpen(o => !o)}>
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
          open ? "bg-yellow-400 text-black" : "bg-white/10 text-muted-foreground")}>
          {step.num}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-semibold text-sm", open ? "text-yellow-300" : "text-foreground")}>{step.name}</span>
            <span className="text-muted-foreground text-xs font-arabic">{step.nameAr}</span>
            {step.rakatNote && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">{step.rakatNote}</span>
            )}
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-yellow-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[var(--border)]">
          <div className="flex justify-center py-5 bg-black/30">
            <GifPlayer src={img} alt={step.name} />
          </div>
          <div className="px-4 pb-4 pt-3 space-y-3">
            {gender === "ayol" && step.womenNote && (
              <div className="flex gap-2 rounded-xl bg-rose-400/10 border border-rose-400/25 p-3">
                <span className="text-rose-300 text-lg flex-shrink-0">♀</span>
                <div className="text-rose-200 text-sm leading-relaxed">{step.womenNote}</div>
              </div>
            )}
            {step.action && (
              <div className="flex gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-foreground/70 text-sm leading-relaxed">{step.action}</div>
              </div>
            )}
            {step.arabic && (
              <div className="rounded-xl bg-yellow-400/5 border border-yellow-400/20 p-4 text-right">
                <div className="font-arabic text-xl md:text-2xl leading-[2.2] text-yellow-100 namoz-arabic">{step.arabic}</div>
                {step.repeat && (
                  <div className="mt-2 text-right">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-300 border border-yellow-400/30">× {step.repeat} марта</span>
                  </div>
                )}
              </div>
            )}
            {step.audio && <AudioPlayer src={step.audio} />}
            {step.trans && (
              <div className="space-y-0.5">
                <div className="text-[10px] text-yellow-400/70 uppercase tracking-widest font-semibold">Талаффуз</div>
                <div className="text-foreground/70 text-sm italic">{step.trans}</div>
              </div>
            )}
            {step.uzbek && (
              <div className="space-y-0.5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Маъноси</div>
                <div className="text-foreground/60 text-sm leading-relaxed">{step.uzbek}</div>
              </div>
            )}
            {step.note && (
              <div className="flex gap-2 items-start text-yellow-400/70 text-xs">
                <span>💡</span><span>{step.note}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function TabNamoz() {
  const [gender, setGender] = useState<Gender>("erkak")
  const [prayer, setPrayer] = useState("peshin")
  const sel = prayers.find(p => p.id === prayer)!

  const prayerDesc: Record<string, string> = {
    bomdod: "2 ракаат фарз. Фотиҳа + Зам сура. Охирида Таҳиyyату + Саловот + Дуо + Салом.",
    peshin: "4 ракаат фарз. 1–2-ракаатда Фотиҳа + Зам сура. 3–4-ракаатда фақат Фотиҳа. Охирида Таҳиyyату + Саловот + Дуо + Салом.",
    asr: "4 ракаат фарз. 1–2-ракаатда Фотиҳа + Зам сура. 3–4-ракаатда фақат Фотиҳа. Охирида Таҳиyyату + Саловот + Дуо + Салом.",
    shom: "3 ракаат фарз. 1–2-ракаатда Фотиҳа + Зам сура. 3-ракаатда фақат Фотиҳа. Охирида Таҳиyyату + Саловот + Дуо + Салом.",
    xufton: "4 ракаат фарз. 1–2-ракаатда Фотиҳа + Зам сура. 3–4-ракаатда фақат Фотиҳа. Охирида Таҳиyyату + Саловот + Дуо + Салом.",
  }

  return (
    <div className="space-y-4">
      {/* Gender Toggle */}
      <div className="flex rounded-2xl bg-white/5 border border-[var(--border)] p-1 gap-1">
        <button onClick={() => setGender("erkak")}
          className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all",
            gender === "erkak" ? "bg-emerald-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground")}>
          🧔 Эркак намози
        </button>
        <button onClick={() => setGender("ayol")}
          className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all",
            gender === "ayol" ? "bg-rose-500 text-white shadow-lg" : "text-muted-foreground hover:text-foreground")}>
          🧕 Аёл намози
        </button>
      </div>

      {/* Women's note */}
      {gender === "ayol" && (
        <div className="rounded-2xl bg-rose-400/10 border border-rose-400/20 p-4">
          <div className="flex gap-3 items-start">
            <span className="text-2xl">🧕</span>
            <div>
              <div className="text-rose-300 font-semibold text-sm mb-1">Аёллар намозидаги фарқлар</div>
              <div className="text-foreground/60 text-xs leading-relaxed">
                Аёлларнинг намози эркакларникидан баъзи ҳолатларда фарқ қилади: такбирда қўлни кўтариш, рукунинг чуқурлиги, саждада тана ҳолати ва ўтириш усули. Ҳар бир қадамда аёлларга хос изоҳ <span className="text-rose-300 font-bold">♀ белги</span> билан кўрсатилган.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prayer selector */}
      <div className="grid grid-cols-2 gap-2">
        {prayers.map(p => (
          <button key={p.id} onClick={() => setPrayer(p.id)}
            className={cn("flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all border",
              prayer === p.id
                ? gender === "ayol" ? "bg-rose-500 text-white border-rose-500 shadow-md" : "bg-emerald-500 text-white border-emerald-500 shadow-md"
                : "bg-white/5 border-[var(--border)] text-muted-foreground hover:text-foreground hover:border-white/20")}>
            <PrayerIcon id={p.id} />
            <span>{p.name}</span>
            <span className={cn("ml-auto text-xs px-1.5 py-0.5 rounded-full",
              prayer === p.id ? "bg-white/20" : "bg-white/10")}>{p.rakats}р</span>
          </button>
        ))}
      </div>

      {/* Prayer info */}
      <div className={cn("rounded-2xl p-4 border text-sm",
        gender === "ayol" ? "bg-rose-500/10 border-rose-500/25" : "bg-emerald-500/10 border-emerald-500/20")}>
        <div className={cn("font-semibold mb-1", gender === "ayol" ? "text-rose-300" : "text-emerald-300")}>
          🕌 {sel.name} тузилмаси — {sel.rakats} ракаат
        </div>
        <div className="text-foreground/60 text-xs leading-relaxed">{prayerDesc[prayer]}</div>
      </div>

      {/* Steps */}
      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-widest px-1 pb-1">
        {STEPS.length} ТА БОСҚИЧ
      </div>
      <div className="space-y-2">
        {STEPS.map(s => <StepCard key={s.id} step={s} gender={gender} />)}
      </div>
    </div>
  )
}
