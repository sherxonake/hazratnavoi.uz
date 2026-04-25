"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Droplets, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface TStep {
  num: number; title: string; titleAr?: string
  text: string; text2?: string; arabic?: string; trans?: string; uzbek?: string
  repeat?: number; icon: string; image: string
}

function GifPlayer({ src, alt }: { src: string; alt: string }) {
  const [active, setActive] = useState(false)
  const [seed, setSeed] = useState(0)
  const isGif = src.endsWith(".gif")
  if (!isGif) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className="mx-auto max-h-48 rounded-xl object-contain" />
  }
  return (
    <div className="flex flex-col items-center gap-2">
      {active
        // eslint-disable-next-line @next/next/no-img-element
        ? <img key={seed} src={src} alt={alt} className="mx-auto max-h-48 rounded-xl object-contain" draggable={false} />
        : <button onClick={() => { setActive(true); setSeed(s => s + 1) }}
            className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95">
            <Play className="w-7 h-7 text-emerald-400" />
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

const STEPS: TStep[] = [
  {
    num: 1, icon: "🤲", title: "Ният қилиш", titleAr: "النية",
    image: "/namoz/images/w1.gif",
    text: "Таҳорат олиш учун, иложи бўлса, қиблага юзланилади.",
    text2: "«Бисмиллаҳир роҳманир роҳийм» деб, ният қилинади.",
    arabic: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    trans: "Бисмиллаҳир роҳманир роҳийм",
    uzbek: "Меҳрибон ва раҳмли Аллоҳ номи билан бошлайман",
  },
  {
    num: 2, icon: "🖐", title: "Қўлларни ювиш", titleAr: "غسل اليدين",
    image: "/namoz/images/w2.gif", repeat: 3,
    text: "Қўллар бандигача уч марта ювилади. Бармоғида узуги бор киши уни қимирлатиб, остига сув етказади. Бармоқларни бир-бирининг орасига киргизилади.",
  },
  {
    num: 3, icon: "💧", title: "Оғиз чайиш", titleAr: "المضمضة",
    image: "/namoz/images/w3.gif", repeat: 3,
    text: "Тишлар мисвок ёки тиш ювиш пастаси билан, ёки қўл билан ишқалаб ювилади.",
    text2: "Ўнг қўлга сув олиб, оғиз уч марта ғарғара қилиб чайилади.",
  },
  {
    num: 4, icon: "💨", title: "Бурунни чайиш", titleAr: "الاستنشاق",
    image: "/namoz/images/w4.gif", repeat: 3,
    text: "Ўнг қўлга сув олиб, бурунга уч марта тортиб, чап қўл билан қоқиб тозаланади.",
  },
  {
    num: 5, icon: "😊", title: "Юзни ювиш", titleAr: "غسل الوجه",
    image: "/namoz/images/w5.gif", repeat: 3,
    text: "Юз ювилади – уч марта. Юзнинг чегараси узунасига соч чиққан жойдан жағнинг остигача, кенглиги эса икки қулоқ юмшоғининг орасигача бўлган ўриндир.",
  },
  {
    num: 6, icon: "💪", title: "Қўлларни тирсаккача ювиш", titleAr: "غسل اليدين إلى المرفقين",
    image: "/namoz/images/w6.gif", repeat: 3,
    text: "Аввал ўнг қўл, сўнг чап қўл тирсак билан қўшиб уч марта ювилади.",
  },
  {
    num: 7, icon: "✋", title: "Масҳ тортиш", titleAr: "مسح الرأس",
    image: "/namoz/images/w7.gif", repeat: 1,
    text: "Ҳовучга сув олиб тўкиб ташлаб, қўли билан бошнинг ҳамма қисмига бир марта масҳ тортилади.",
    text2: "Кўрсаткич бармоқ билан қулоқ ичига масҳ тортиб, бош бармоқ билан эса қулоқ ташқарисига масҳ тортилади.",
  },
  {
    num: 8, icon: "🦶", title: "Оёқларни ювиш", titleAr: "غسل الرجلين",
    image: "/namoz/images/w8.gif", repeat: 3,
    text: "Чап қўл билан ўнг оёқни ошиқ (тўпиқ) билан қўшиб ва бармоқлар орасини (ишқалаб) уч марта ювилади.",
    text2: "Чап оёқ ҳам шу тарзда уч марта ювилади.",
  },
  {
    num: 9, icon: "🤍", title: "Дуо", titleAr: "الدعاء",
    image: "/namoz/images/w9.jpg",
    text: "Таҳорат қилиб бўлгандан кейин шаҳодат калимасини ва ривоятда келган дуо ўқилади.",
    arabic: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    trans: "Ашҳаду алла илаҳа иллаллоҳу ваҳдаҳу ла шарийка лаҳ, ва ашҳаду анна Муҳаммадан абдуҳу ва расулуҳ.",
    uzbek: "Гувоҳлик бераманки, Аллоҳдан бошқа илоҳ йўқ, У ягона, шериги йўқ. Яна гувоҳлик бераманки, Муҳаммад Унинг бандаси ва Расулидир.",
  },
]

function TahoratStep({ step, defaultOpen }: { step: TStep; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className={cn("rounded-2xl border transition-all overflow-hidden",
      open ? "border-yellow-400/50 bg-card" : "border-[var(--border)] bg-card/60 hover:border-yellow-400/30")}>
      <button className="w-full flex items-center gap-3 px-5 py-4 text-left" onClick={() => setOpen(o => !o)}>
        <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors",
          open ? "bg-yellow-400/20 border border-yellow-400/50" : "bg-white/5 border border-white/10")}>
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-semibold", open ? "text-yellow-300" : "text-foreground")}>{step.title}</span>
            {step.titleAr && <span className="text-muted-foreground text-sm font-arabic">{step.titleAr}</span>}
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {step.num}-қадам
            </span>
          </div>
          {!open && step.repeat && step.repeat > 1 && (
            <div className="text-muted-foreground text-xs mt-0.5">× {step.repeat} марта</div>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-yellow-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[var(--border)] px-5 pb-5 pt-4 space-y-4">
          <GifPlayer src={step.image} alt={step.title} />
          <p className="text-foreground/80 text-sm leading-relaxed">{step.text}</p>
          {step.text2 && <p className="text-foreground/70 text-sm leading-relaxed">{step.text2}</p>}
          {step.repeat && step.repeat > 1 && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300 text-xs font-semibold">× {step.repeat} марта</span>
            </div>
          )}
          {step.arabic && (
            <div className="rounded-xl bg-yellow-400/5 border border-yellow-400/20 p-4 text-right">
              <div className="font-arabic text-xl leading-[2] text-yellow-200 namoz-arabic">{step.arabic}</div>
            </div>
          )}
          {step.trans && (
            <div className="space-y-0.5">
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold">Талаффуз</div>
              <div className="text-foreground/70 text-sm italic">{step.trans}</div>
            </div>
          )}
          {step.uzbek && (
            <div className="space-y-0.5">
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Маъноси</div>
              <div className="text-foreground/60 text-sm leading-relaxed">{step.uzbek}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function TabTahorat() {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-6">
        <div className="flex gap-3 items-start">
          <div className="text-2xl">💡</div>
          <div>
            <div className="text-emerald-300 font-semibold text-sm mb-1">Таҳорат ҳақида</div>
            <div className="text-foreground/60 text-xs leading-relaxed">
              Таҳорат — намоздан олдин бажариладиган диний тозаланиш. Ҳанафий мазҳабида 9 қадамдан иборат. Ниятдан бошланиб дуо билан тугайди.
            </div>
          </div>
        </div>
      </div>
      {STEPS.map((s, i) => <TahoratStep key={s.num} step={s} defaultOpen={i === 0} />)}
    </div>
  )
}
