"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Play, Pause, BookOpen, ChevronLeft, Volume2, Loader2, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Surah {
  number: number
  name: string           // Arabic
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation?: string
}

const UZ_NAMES: Record<number, string> = {
  1:"Фотиҳа",2:"Бақара",3:"Оли Имрон",4:"Нисо",5:"Моида",6:"Анъом",7:"Аъроф",8:"Анфол",9:"Тавба",10:"Юнус",
  11:"Ҳуд",12:"Юсуф",13:"Раъд",14:"Иброҳим",15:"Ҳижр",16:"Наҳл",17:"Исро",18:"Каҳф",19:"Марям",20:"Тоҳо",
  21:"Анбиё",22:"Ҳаж",23:"Мўминун",24:"Нур",25:"Фурқон",26:"Шуаро",27:"Намл",28:"Қасас",29:"Анкабут",30:"Рум",
  31:"Луқмон",32:"Сажда",33:"Аҳзоб",34:"Сабаъ",35:"Фотир",36:"Ёсин",37:"Соффот",38:"Сод",39:"Зумар",40:"Ғофир",
  41:"Фуссилат",42:"Шуро",43:"Зухруф",44:"Духон",45:"Жосия",46:"Аҳқоф",47:"Муҳаммад",48:"Фатҳ",49:"Ҳужурот",50:"Қоф",
  51:"Зориёт",52:"Тур",53:"Нажм",54:"Қамар",55:"Раҳмон",56:"Воқиа",57:"Ҳадид",58:"Мужодала",59:"Ҳашр",60:"Мумтаҳана",
  61:"Саф",62:"Жумъа",63:"Мунофиқун",64:"Тағобун",65:"Талоқ",66:"Таҳрим",67:"Мулк",68:"Қалам",69:"Ҳоққа",70:"Маориж",
  71:"Нуҳ",72:"Жин",73:"Муззаммил",74:"Муддассир",75:"Қиёмат",76:"Инсон",77:"Мурсалот",78:"Набаъ",79:"Нозиот",80:"Абаса",
  81:"Таквир",82:"Инфитор",83:"Мутаффифин",84:"Иншиқоқ",85:"Буруж",86:"Ториқ",87:"Аъло",88:"Ғошия",89:"Фажр",90:"Балад",
  91:"Шамс",92:"Лайл",93:"Зуҳо",94:"Шарҳ",95:"Тин",96:"Алақ",97:"Қадр",98:"Баййина",99:"Залзала",100:"Одиёт",
  101:"Қориа",102:"Такосур",103:"Аср",104:"Ҳумаза",105:"Фил",106:"Қурайш",107:"Моун",108:"Кавсар",109:"Кофирун",110:"Наср",
  111:"Масад",112:"Ихлос",113:"Фалақ",114:"Нос"
}

const RECITER = "ar.alafasy" // Mishary Rashid Al-Afasy

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Surah | null>(null)
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [ayahsLoading, setAyahsLoading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(true)
  const [playingAyah, setPlayingAyah] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(r => r.json())
      .then(d => { setSurahs(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function openSurah(surah: Surah) {
    setSelected(surah)
    setAyahs([])
    setPlayingAyah(null)
    audioRef.current?.pause()
    setAyahsLoading(true)

    try {
      const [arabicRes, uzRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/uz.musayev`),
      ])
      const arabicData = await arabicRes.json()
      const uzData = await uzRes.json()

      const combined: Ayah[] = arabicData.data.ayahs.map((a: Ayah, i: number) => ({
        ...a,
        translation: uzData.data?.ayahs?.[i]?.text || "",
      }))
      setAyahs(combined)
    } catch {
      setAyahs([])
    }
    setAyahsLoading(false)
  }

  function playAyah(ayah: Ayah) {
    if (!selected) return
    const paddedSurah = String(selected.number).padStart(3, "0")
    const paddedAyah = String(ayah.numberInSurah).padStart(3, "0")
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`

    if (playingAyah === ayah.numberInSurah) {
      audioRef.current?.pause()
      setPlayingAyah(null)
      return
    }

    audioRef.current?.pause()
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play()
    setPlayingAyah(ayah.numberInSurah)
    audio.onended = () => setPlayingAyah(null)
  }

  function playSurah(surah: Surah, e: React.MouseEvent) {
    e.stopPropagation()
    const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.number}.mp3`
    audioRef.current?.pause()
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play()
  }

  const filtered = surahs.filter(s => {
    const q = search.toLowerCase()
    return (
      UZ_NAMES[s.number]?.toLowerCase().includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      String(s.number).includes(q)
    )
  })

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(160deg, #021a0f 0%, #041208 50%, #020e08 100%)" }}>
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-[0.06]" />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-yellow-500/10 bg-black/30 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
            <ChevronLeft className="w-4 h-4" />
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-yellow-500/30">
              <Image src="/images/mosque-logo.png" alt="Logo" width={32} height={32} className="object-cover scale-110" />
            </div>
          </Link>

          <div className="flex-1">
            <h1 className="text-yellow-400 font-serif font-bold text-base leading-none">Қуръони Карим</h1>
            <p className="text-white/30 text-[10px] mt-0.5">114 сура · Мишари Рашид тиловати</p>
          </div>

          <p className="text-yellow-500/40 font-serif text-lg hidden sm:block" dir="rtl">بِسْمِ اللَّهِ</p>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-4 py-6">
        {!selected ? (
          <>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Сура номи ёки рақами..."
                className="w-full bg-white/5 border border-yellow-500/15 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/20 text-sm focus:outline-none focus:border-yellow-500/35 focus:bg-white/8 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Surah grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-yellow-500/40 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filtered.map(s => (
                  <div
                    key={s.number}
                    onClick={() => openSurah(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && openSurah(s)}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/8 bg-white/3 hover:border-yellow-500/25 hover:bg-white/5 transition-all text-left group cursor-pointer"
                  >
                    {/* Number badge */}
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 text-xs font-bold">{s.number}</span>
                    </div>

                    {/* Names */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-white font-semibold text-sm">{UZ_NAMES[s.number] || s.englishName}</p>
                        <p className="text-white/30 text-xs">{s.numberOfAyahs} оят</p>
                      </div>
                      <p className="text-white/25 text-[10px] mt-0.5">{s.revelationType === "Meccan" ? "Маккий" : "Мадиний"}</p>
                    </div>

                    {/* Arabic name */}
                    <div className="flex items-center gap-2">
                      <p className="text-yellow-400/60 font-serif text-base" dir="rtl">{s.name}</p>
                      <button
                        onClick={e => playSurah(s, e)}
                        className="w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 text-yellow-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Surah reader */
          <div>
            {/* Surah header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => { setSelected(null); setAyahs([]); audioRef.current?.pause(); setPlayingAyah(null) }}
                className="w-9 h-9 rounded-full border border-white/10 hover:border-yellow-500/30 flex items-center justify-center text-white/40 hover:text-yellow-400 transition-all flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-white font-serif font-bold text-lg">{UZ_NAMES[selected.number]}</h2>
                  <span className="text-yellow-400/60 font-serif text-base" dir="rtl">{selected.name}</span>
                </div>
                <p className="text-white/30 text-xs">{selected.numberOfAyahs} оят · {selected.revelationType === "Meccan" ? "Маккий" : "Мадиний"}</p>
              </div>

              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${showTranslation ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400" : "border-white/10 text-white/30"}`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Таржима
              </button>
            </div>

            {/* Bismillah */}
            {selected.number !== 9 && (
              <div className="text-center py-6 mb-4 border border-yellow-500/15 rounded-2xl bg-yellow-500/5">
                <p className="text-yellow-400/80 font-serif text-2xl" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <p className="text-white/30 text-xs mt-2">Меҳрибон ва раҳмли Аллоҳ номи билан</p>
              </div>
            )}

            {/* Ayahs */}
            {ayahsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-yellow-500/40 animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {ayahs.map(ayah => (
                  <div key={ayah.numberInSurah}
                    className="rounded-xl border border-white/8 bg-white/3 p-4 hover:border-yellow-500/15 transition-all">
                    <div className="flex items-start gap-3">
                      {/* Ayah number + play */}
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                          <span className="text-yellow-400/80 text-[10px] font-bold">{ayah.numberInSurah}</span>
                        </div>
                        <button
                          onClick={() => playAyah(ayah)}
                          className="w-7 h-7 rounded-full bg-white/5 hover:bg-yellow-500/15 flex items-center justify-center transition-all"
                        >
                          {playingAyah === ayah.numberInSurah
                            ? <Pause className="w-3 h-3 text-yellow-400" />
                            : <Volume2 className="w-3 h-3 text-white/30 hover:text-yellow-400" />
                          }
                        </button>
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <p className="text-white font-serif text-xl leading-loose text-right mb-3" dir="rtl">
                          {ayah.text}
                        </p>
                        {showTranslation && ayah.translation && (
                          <p className="text-white/50 text-sm leading-relaxed border-t border-white/8 pt-2">
                            {ayah.translation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
