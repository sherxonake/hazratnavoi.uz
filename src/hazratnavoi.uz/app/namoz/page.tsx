"use client"

import { useState, useRef } from "react"
import { ChevronDown, ChevronUp, ArrowLeft, BookOpen, Info, Play, Pause, Volume2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────
interface Step {
  id: string; num: number; name: string; nameAr: string
  pos: "standing" | "bowing" | "prostration" | "sitting" | "intent"
  action: string; arabic?: string; trans?: string; uzbek?: string
  repeat?: number; note?: string; rakatNote?: string
  image: string;  audio?: string
}
interface PrayerType { id: string; name: string; nameAr: string; rakats: number }

// ── Data ───────────────────────────────────────────────────────────────────
const prayers: PrayerType[] = [
  { id: "bomdod", name: "Бомдод", nameAr: "الفجر",  rakats: 2 },
  { id: "peshin", name: "Пешин",  nameAr: "الظهر",  rakats: 4 },
  { id: "asr",    name: "Аср",    nameAr: "العصر",  rakats: 4 },
  { id: "shom",   name: "Шом",    nameAr: "المغرب", rakats: 3 },
  { id: "xufton", name: "Хуфтон", nameAr: "العشاء", rakats: 4 },
]

const I = (f: string) => `/namoz/images/${f}`
const A = (f: string) => `/namoz/audio/${f}`

const STEPS: Step[] = [
  {
    id:"niyat", num:1, name:"Ният", nameAr:"النية", pos:"intent",
    image: I("niet.png"),
    action:"Дилда намоз ўқишга ният тутилади. Оғиз билан айтилмайди.",
    note:"«Мен [намоз номи] намозини Аллоҳ учун ўқишга ният қилдим»",
  },
  {
    id:"takbir", num:2, name:"Такбири таҳрима", nameAr:"تكبيرة الإحرام", pos:"intent",
    image: I("takbir.png"), audio: A("takbir.mp3"),
    action:"Иккала қўлни қулоқ юмшоқларига тегадиган қилиб кўтариб, «Аллоҳу Акбар» дейилади. Кейин қўллар кўкрак остида боғланади.",
    arabic:"اَللّٰهُ أَكْبَرُ", trans:"Аллоҳу Акбар", uzbek:"Аллоҳ улуғдир",
  },
  {
    id:"subhanaka", num:3, name:"Субҳанака", nameAr:"سبحانك", pos:"standing",
    image: I("qyam-qyraat.png"), audio: A("subhanaka.mp3"),
    action:"Такбиридан кейин дарҳол ўқилади. Фақат биринчи ракаатда.",
    arabic:"سُبْحَانَكَ اللّٰهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالٰى جَدُّكَ، وَلاَ إِلٰهَ غَيْرُكَ",
    trans:"Субҳанакаллоҳумма ва биҳамдик, ва табаракасмук, ва таъала жаддук, ва ла илаҳа ғайрук",
    uzbek:"Эй Аллоҳ! Сен покдирсан, Ҳамд Сенгадир. Исминг муборакдир, улуғлиғинг олийдир. Сендан бошқа илоҳ йўқ.",
    rakatNote:"Фақат 1-ракаатда",
  },
  {
    id:"fatiha", num:4, name:"Фотиҳа сураси", nameAr:"سورة الفاتحة", pos:"standing",
    image: I("qyam-qyraat.png"), audio: A("fatiha.mp3"),
    action:"Аввал «Аъузу басмала» ўқилиб, Фотиҳа сураси ўқилади. Охирида «Омийн» тин овозда айтилади.",
    arabic:"ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ۝ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ۝ مَٰلِكِ يَوۡمِ ٱلدِّينِ ۝ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ۝ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ۝ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ",
    trans:"Алҳамду лиллаҳи Роббил-аламийн. Ар-Роҳманир-Роҳийм. Малики йавмид-дийн. Иyyака наъбуду ва иyyака настаъийн. Иҳдинас-сиротол мустақийм. Сироталлазийна анъамта алайҳим, ғайрил-мағдуби алайҳим ва лод-дооллийн.",
    uzbek:"Барча ҳамдлар — оламлар Парвардигори Аллоҳга хосдир. У Меҳрибон ва Раҳмлидир. Ҳисоб-китоб куни Мулкидир. Сенгагина ибодат қиламиз ва Сендангина мадад сўраймиз. Бизни тўғри йўлга бошла.",
  },
  {
    id:"sura", num:5, name:"Зам сура", nameAr:"السورة الزائدة", pos:"standing",
    image: I("qyam-qyraat.png"), audio: A("fatiha-kausar.mp3"),
    action:"Фотиҳадан кейин қисқа сура ёки 3 та оят ўқилади.",
    arabic:"قُلۡ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ ۝ وَلَمۡ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
    trans:"Қул ҳуваллоҳу аҳад. Аллоҳус-Самад. Лам йалид ва лам йулад. Ва лам йакун лаҳу куфуван аҳад.",
    uzbek:"Айтинг: У Аллоҳ — Якка ва Ягонадир. Аллоҳ — бениёздир. У туғмаган ва туғилмаган. Унга тенг бўлгувчи биронта ҳам йўқдир.",
    note:"Мисол: Ихлос сураси (112-сура).",
    rakatNote:"1-2-ракаатларда",
  },
  {
    id:"ruku", num:6, name:"Руку", nameAr:"الركوع", pos:"bowing",
    image: I("ruku.png"), audio: A("ruku.mp3"),
    action:"«Аллоҳу Акбар» деб белни тўғри букиш. Иккала қўл билан тиззаларни ушлаш. Бош, бел ва думба бир текис бўлсин.",
    arabic:"سُبْحَانَ رَبِّيَ الْعَظِيمِ", trans:"Субҳана Рабийял-Азийм",
    uzbek:"Буюк Парвардигорим покдир", repeat:3,
  },
  {
    id:"qawma", num:7, name:"Қавма", nameAr:"القومة", pos:"standing",
    image: I("qyam-qyraat.png"), audio: A("qawma.mp3"),
    action:"«Самиаллоҳу лиман ҳамидаҳ» деб рукудан тик туриш. Тўлиқ тик турилгач «Рабийана ва лакал-ҳамд» дейилади.",
    arabic:"سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ ۗ رَبَّنَا وَلَكَ الْحَمْدُ",
    trans:"Самиаллоҳу лиман ҳамидаҳ. Рабийана ва лакал-ҳамд.",
    uzbek:"Аллоҳ ўзини мақтаганни эшитади. Парвардигоримиз, Ҳамд Сенгадир.",
  },
  {
    id:"sajda1", num:8, name:"Биринчи сажда", nameAr:"السجدة الأولى", pos:"prostration",
    image: I("sajda.png"), audio: A("sajda.mp3"),
    action:"«Аллоҳу Акбар» деб тизза → кафт → бурун → пешона тартибида сажда қилинади. Бурун ва пешона ерга тегиши фарз.",
    arabic:"سُبْحَانَ رَبِّيَ الْأَعْلٰى", trans:"Субҳана Рабийял-Аъла",
    uzbek:"Юксак Парвардигорим покдир", repeat:3,
  },
  {
    id:"jalsa", num:9, name:"Жалса", nameAr:"الجلسة", pos:"sitting",
    image: I("tashahud.png"),
    action:"«Аллоҳу Акбар» деб икки сажда орасида ўтирилади. Чап оёқ ётиб, унинг устига ўтирилади. Ўнг оёқ бармоқлари Қиблага қаратилади.",
    note:"Бир «Субҳаналлоҳ» айтадиган вақт ўтирилади",
  },
  {
    id:"sajda2", num:10, name:"Иккинчи сажда", nameAr:"السجدة الثانية", pos:"prostration",
    image: I("sajda.png"), audio: A("sajda.mp3"),
    action:"Жалсадан «Аллоҳу Акбар» деб иккинчи саждага тушилади. Биринчи сажда каби адо этилади.",
    arabic:"سُبْحَانَ رَبِّيَ الْأَعْلٰى", trans:"Субҳана Рабийял-Аъла",
    uzbek:"Юксак Парвардигорим покдир", repeat:3,
  },
  {
    id:"tahiyyat", num:11, name:"Таҳиятту", nameAr:"التشهد", pos:"sitting",
    image: I("tashahud.png"), audio: A("tahiyyat.mp3"),
    action:"Иккинчи ракаат охирида (ва охирги ракаатда) ўтирилади. «Ашҳаду» сўзида кўрсаткич бармоқ кўтарилади.",
    arabic:"اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، اَلسَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلاَمُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لاَّ إِلٰهَ إِلاَّ اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    trans:"Аттаҳиятту лиллаҳи вас-салавату ват-тоyyибату. Ассаламу алайка аyyуҳан-набиyyу ва роҳматуллоҳи ва барокатуҳу. Ассаламу алайна ва ала ибадиллаҳис-солиҳийн. Ашҳаду алла илаҳа иллаллоҳу ва ашҳаду анна Муҳаммадан абдуҳу ва расулуҳ.",
    uzbek:"Барча таъзимлар, намозлар ва покликлар Аллоҳники. Сенга салом, эй Пайғамбар. Бизга ҳам, Аллоҳнинг солиҳ бандаларига ҳам салом. Гувоҳлик бераман: Аллоҳдан бошқа илоҳ йўқ; Муҳаммад Унинг бандаси ва элчисидир.",
    rakatNote:"2-ракаат ва охирги ракаатда",
  },
  {
    id:"salawat", num:12, name:"Саловот Иброҳим", nameAr:"الصلاة الإبراهيمية", pos:"sitting",
    image: I("tashahud.png"), audio: A("tahiyyat-full.mp3"),
    action:"Охирги ракаатда Таҳиятттудан кейин ўқилади.",
    arabic:"اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيمَ وَعَلٰى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. وَبَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلٰى إِبْرَاهِيمَ وَعَلٰى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
    trans:"Аллоҳумма салли ала Муҳаммадив ва ала али Муҳаммад, кама саллайта ала Иброҳийма ва ала али Иброҳийм, иннака ҳамийдум мажийд. Ва барик ала Муҳаммадив...",
    uzbek:"Эй Аллоҳ! Муҳаммад ва унинг аҳлига раҳматингни юбор, Иброҳим ва унинг аҳлига юборганинг каби. Муҳаммад ва унинг аҳлига баракотингни бер. Сен мақталгувчи ва улуғсан.",
    rakatNote:"Фақат охирги ракаатда",
  },
  {
    id:"dua", num:13, name:"Дуои маъсура", nameAr:"الدعاء المأثور", pos:"sitting",
    image: I("tashahud.png"), audio: A("tahiyyat-full.mp3"),
    action:"Саловотдан кейин ихтиёрий дуо ўқилади.",
    arabic:"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    trans:"Рабийана атина фид-дунйа ҳасанатан ва фил-аҳирати ҳасанатан ва қийна азабан-нар.",
    uzbek:"Парвардигоримиз! Бизга дунёда яхшилик бер, охиратда ҳам яхшилик бер ва бизни дўзах азобидан асра.",
    rakatNote:"Фақат охирги ракаатда",
  },
  {
    id:"salam", num:14, name:"Салом", nameAr:"السلام", pos:"sitting",
    image: I("salam-right.png"), audio: A("salam.mp3"),
    action:"Дастлаб ўнг томонга, кейин чап томонга юзни буриб салом берилади. Бу намозни тугатади.",
    arabic:"اَلسَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ", trans:"Ассалому алайкум ва роҳматуллоҳ",
    uzbek:"Сизга тинчлик ва Аллоҳнинг раҳмати бўлсин",
    note:"Аввал ўнг томонга, кейин чап томонга айтилади",
  },
]

// ── Custom Audio Player ────────────────────────────────────────────────────
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

  const fmt = (s: number) => isNaN(s) ? "0:00" : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`

  return (
    <div className="flex items-center gap-3 rounded-xl bg-emerald-950/70 border border-emerald-500/25 px-4 py-3">
      <button onClick={toggle}
        className="w-10 h-10 rounded-full bg-emerald-500/20 hover:bg-emerald-500/35 flex items-center justify-center text-emerald-300 transition-all active:scale-95 flex-shrink-0">
        {playing
          ? <Pause className="w-4 h-4"/>
          : <Play  className="w-4 h-4 translate-x-0.5"/>}
      </button>
      <div className="flex-1 space-y-1.5">
        <div className="h-2 bg-white/8 rounded-full overflow-hidden cursor-pointer group" onClick={seek}>
          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-100
                          group-hover:from-yellow-400 group-hover:to-yellow-300"
               style={{ width: `${progress}%` }}/>
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
          <span>{fmt(current)}</span>
          <span className="flex items-center gap-1"><Volume2 className="w-2.5 h-2.5"/>صوت</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
      <audio ref={ref} src={src}
        onTimeUpdate={() => { const a = ref.current; if(a) { setCurrent(a.currentTime); setProgress((a.currentTime/a.duration)*100||0) }}}
        onLoadedMetadata={() => { if(ref.current) setDuration(ref.current.duration) }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrent(0) }}/>
    </div>
  )
}

// ── Prayer type icons ──────────────────────────────────────────────────────
function PrayerIcon({ id }: { id: string }) {
  const g = "currentColor"
  if (id === "bomdod") return <svg viewBox="0 0 24 24" width={18} height={18}><path d="M12 3 A9 9 0 0 0 3 12 A9 9 0 0 1 12 3 Z" fill={g}/><circle cx="19" cy="5" r="2" fill={g} opacity=".7"/></svg>
  if (id === "peshin") return <svg viewBox="0 0 24 24" width={18} height={18}><circle cx="12" cy="12" r="5" fill={g}/>{["0","45","90","135","180","225","270","315"].map((deg,i)=><line key={i} x1="12" y1="2" x2="12" y2="4" stroke={g} strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${deg} 12 12)`}/>)}</svg>
  if (id === "asr") return <svg viewBox="0 0 24 24" width={18} height={18}><circle cx="12" cy="10" r="5" fill={g}/><line x1="4" y1="20" x2="20" y2="20" stroke={g} strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="2" x2="12" y2="4" stroke={g} strokeWidth="1.5" strokeLinecap="round"/></svg>
  if (id === "shom") return <svg viewBox="0 0 24 24" width={18} height={18}><path d="M3 16 Q12 6 21 16 L21 20 L3 20 Z" fill={g} opacity=".7"/><line x1="12" y1="3" x2="12" y2="6" stroke={g} strokeWidth="1.5" strokeLinecap="round"/></svg>
  return <svg viewBox="0 0 24 24" width={18} height={18}><path d="M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z" fill={g}/><circle cx="19" cy="5" r="1.2" fill={g} opacity=".6"/></svg>
}

// ── Tasbeh SVG ─────────────────────────────────────────────────────────────
function TasbehSVG() {
  const beads = Array.from({length:33},(_,i)=>{
    const a = (i/33)*Math.PI*2 - Math.PI/2
    return { x: Math.round((52+38*Math.cos(a))*100)/100, y: Math.round((44+28*Math.sin(a))*100)/100, big: i===0||i===11||i===22 }
  })
  return (
    <svg viewBox="0 0 120 108" width={120} height={108} className="text-yellow-400/80">
      <ellipse cx="52" cy="44" rx="38" ry="28" fill="none" stroke="currentColor" strokeWidth="1" opacity=".25"/>
      {beads.map((b,i)=><circle key={i} cx={b.x} cy={b.y} r={b.big?5:3.5} fill="currentColor" opacity={b.big?.95:.65}/>)}
      <line x1="52" y1="72" x2="52" y2="85" stroke="currentColor" strokeWidth="1.5" opacity=".4"/>
      <circle cx="52" cy="89" r="4.5" fill="currentColor" opacity=".9"/>
      <line x1="52" y1="93.5" x2="52" y2="100" stroke="currentColor" strokeWidth="1.5" opacity=".35"/>
    </svg>
  )
}

// ── Rakat guide ────────────────────────────────────────────────────────────
function RakatGuide({ prayer }: { prayer: PrayerType }) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      {Array.from({length:prayer.rakats},(_,i)=>(
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center text-yellow-300 text-sm font-bold">{i+1}</div>
          <div className="text-[9px] text-white/40">ракаат</div>
        </div>
      ))}
      <div className="text-white/30 text-xs ml-1">{prayer.rakats===2?"2 ракаат фарз":prayer.rakats===3?"3 ракаат фарз":"4 ракаат фарз"}</div>
    </div>
  )
}

// ── Step Card ──────────────────────────────────────────────────────────────
function StepCard({ step, defaultOpen }: { step: Step; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)

  return (
    <div className={cn(
      "rounded-2xl border transition-all duration-300 overflow-hidden",
      open ? "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-emerald-900/20 shadow-xl shadow-yellow-500/5"
           : "border-white/8 bg-white/3 hover:border-emerald-500/25 hover:bg-white/5"
    )}>
      {/* Header */}
      <button className="w-full flex items-center gap-3 px-5 py-4 text-left" onClick={()=>setOpen(o=>!o)}>
        <div className={cn("flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
          open?"bg-yellow-500 text-black":"bg-white/8 text-white/50")}>
          {step.num}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-semibold text-base",open?"text-yellow-200":"text-white/85")}>{step.name}</span>
            <span className="text-white/30 text-sm font-arabic">{step.nameAr}</span>
            {step.rakatNote && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{step.rakatNote}</span>}
          </div>
          {!open && step.trans && <div className="text-white/30 text-xs mt-0.5 truncate">{step.trans}</div>}
        </div>
        {/* Thumbnail image */}
        <div className={cn("flex-shrink-0 transition-opacity h-14 flex items-center", open?"opacity-100":"opacity-35")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={step.image} alt={step.name} className="h-14 w-auto object-contain" draggable={false}/>
        </div>
        <div className={cn("text-white/30 flex-shrink-0",open&&"text-yellow-400")}>
          {open?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-white/5">
          {/* Large illustration */}
          <div className="flex justify-center py-6 bg-gradient-to-b from-white/3 to-transparent">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={step.image} alt={step.name}
              className="max-h-64 w-auto object-contain drop-shadow-[0_0_24px_rgba(52,211,153,0.25)]"
              draggable={false}/>
          </div>

          <div className="px-5 pb-5 space-y-4">
            {/* Arabic text */}
            {step.arabic && (
              <div className="rounded-xl bg-gradient-to-br from-black/50 to-emerald-950/40 border border-yellow-500/15 p-5 text-right">
                <div className="font-arabic text-2xl md:text-3xl leading-[2.2] text-yellow-200 namoz-arabic">{step.arabic}</div>
                {step.repeat && <div className="mt-2 text-right"><span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/20">× {step.repeat} марта</span></div>}
              </div>
            )}
            {/* Audio player */}
            {step.audio && <AudioPlayer src={step.audio}/>}
            {/* Transliteration */}
            {step.trans && (
              <div className="space-y-1">
                <div className="text-[10px] text-emerald-400/60 uppercase tracking-widest font-semibold">Талаффуз</div>
                <div className="text-emerald-200/90 text-sm leading-relaxed italic">{step.trans}</div>
              </div>
            )}
            {/* Translation */}
            {step.uzbek && (
              <div className="space-y-1">
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Маъноси</div>
                <div className="text-white/70 text-sm leading-relaxed">{step.uzbek}</div>
              </div>
            )}
            {/* Action */}
            <div className="flex gap-3 rounded-xl bg-emerald-900/25 border border-emerald-500/15 p-4">
              <Info className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5"/>
              <div className="text-white/65 text-sm leading-relaxed">{step.action}</div>
            </div>
            {step.note && <div className="flex gap-2 items-start text-yellow-300/60 text-xs"><span>💡</span><span>{step.note}</span></div>}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function NamazPage() {
  const [selectedPrayer, setSelectedPrayer] = useState("peshin")
  const prayer = prayers.find(p=>p.id===selectedPrayer)!

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 namoz-bg-pattern opacity-20 pointer-events-none"/>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-transparent to-background pointer-events-none"/>
        <div className="relative max-w-2xl mx-auto px-4 pt-12 pb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4"/>Бош саҳифа
          </Link>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 64 64" width={64} height={64} aria-hidden>
                <path d="M32 4 L44 16 L60 16 L60 48 L4 48 L4 16 L20 16 Z" fill="rgb(52 211 153 / 0.25)" stroke="rgb(52 211 153 / 0.6)" strokeWidth="1.5"/>
                <path d="M20 16 Q32 4 44 16" fill="rgb(52 211 153 / 0.18)" stroke="rgb(52 211 153 / 0.5)" strokeWidth="1.5"/>
                <path d="M24 48 L24 32 Q32 26 40 32 L40 48" fill="rgb(52 211 153 / 0.3)" stroke="rgb(52 211 153 / 0.5)" strokeWidth="1"/>
                <circle cx="32" cy="2" r="2.5" fill="rgb(253 224 71 / 0.8)"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Намоз ўқиш тартиби</h1>
            <p className="text-white/40 font-arabic text-xl">كيفية أداء الصلاة</p>
            <p className="text-white/35 text-sm mt-1">Ҳанафий мазҳаби бўйича</p>
          </div>
          {/* Prayer selector */}
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            {prayers.map(p=>(
              <button key={p.id} onClick={()=>setSelectedPrayer(p.id)}
                className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all",
                  selectedPrayer===p.id?"bg-yellow-500 text-black shadow-lg shadow-yellow-500/25":"bg-white/8 text-white/60 hover:bg-white/12 border border-white/8")}>
                <span className={selectedPrayer===p.id?"text-black/70":"text-emerald-400"}><PrayerIcon id={p.id}/></span>
                <span>{p.name}</span>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-bold",
                  selectedPrayer===p.id?"bg-black/20 text-black/70":"bg-white/10 text-white/40")}>{p.rakats}р</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/4 border border-white/8">
              <BookOpen className="w-4 h-4 text-emerald-400"/>
              <span className="text-white/50 text-sm">{prayer.name} намози —</span>
              <RakatGuide prayer={prayer}/>
            </div>
          </div>
        </div>
      </div>

      {/* Structure info */}
      <div className="max-w-2xl mx-auto px-4 mb-4">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-900/30 to-emerald-950/30 border border-emerald-500/15 p-4">
          <div className="text-emerald-300 text-sm font-semibold mb-1">📋 {prayer.name} тузилмаси</div>
          <div className="text-white/50 text-xs leading-relaxed">
            {prayer.id==="bomdod"&&"2 ракаат фарз. Ҳар ракаатда Фотиҳа + Зам сура. Охирида Таҳиятту + Саловот + Дуо + Салом."}
            {prayer.id==="shom"&&"3 ракаат фарз. 1-2-ракаатда Фотиҳа + Зам сура. 3-ракаатда фақат Фотиҳа. Иккинчи ракаатда Таҳиятту. Охирида Таҳиятту + Саловот + Дуо + Салом."}
            {(prayer.id==="peshin"||prayer.id==="asr"||prayer.id==="xufton")&&"4 ракаат фарз. 1-2-ракаатда Фотиҳа + Зам сура. 3-4-ракаатда фақат Фотиҳа. Иккинчи ракаатда Таҳиятту. Охирида Таҳиятту + Саловот + Дуо + Салом."}
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-2xl mx-auto px-4 pb-20 space-y-2">
        <div className="text-white/30 text-xs uppercase tracking-widest font-semibold px-1 mb-3">
          Намоз қадамлари — {STEPS.length} та босқич
        </div>
        {STEPS.map((step,i)=><StepCard key={step.id} step={step} defaultOpen={i===0}/>)}

        {/* Tasbeh / zikr */}
        <div className="mt-10 rounded-2xl bg-gradient-to-br from-yellow-500/8 to-transparent border border-yellow-500/15 p-6">
          <div className="flex flex-col items-center gap-4">
            <TasbehSVG/>
            <div className="text-center w-full">
              <div className="text-yellow-300/80 text-sm font-semibold mb-3">Намоздан кейинги тасбеҳ зикри</div>
              <div className="space-y-2 text-sm">
                {[
                  { ar:"سُبْحَانَ اللّٰهِ", uz:"Субҳаналлоҳ", n:33 },
                  { ar:"اَلْحَمْدُ لِلّٰهِ", uz:"Алҳамдулиллоҳ", n:33 },
                  { ar:"اَللّٰهُ أَكْبَرُ", uz:"Аллоҳу Акбар", n:34 },
                ].map(z=>(
                  <div key={z.uz} className="flex items-center justify-between gap-4 rounded-xl bg-white/4 border border-white/8 px-4 py-2.5">
                    <span className="text-white/50 font-arabic text-lg">{z.ar}</span>
                    <span className="text-white/70">{z.uz}</span>
                    <span className="text-yellow-300 font-bold text-xs px-2 py-1 rounded-full bg-yellow-500/12 border border-yellow-500/20">× {z.n}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <div className="text-white/30 text-xs mb-2">Намоздан кейинги дуо</div>
                <AudioPlayer src={A("dua-after.mp3")}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
