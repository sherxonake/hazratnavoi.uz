"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Play, Pause, BookOpen, ChevronLeft, Volume2, Loader2, X, Repeat } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Surah {
  number: number
  name: string
  englishName: string
  numberOfAyahs: number
  revelationType: string
}

interface Ayah {
  number: number         // global ayah number (for audio URL)
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

const QC_BASE = "https://verses.quran.com/"

export default function QuranPage() {
  // ── List ────────────────────────────────────────────────
  const [surahs,    setSurahs]    = useState<Surah[]>([])
  const [listLoad,  setListLoad]  = useState(true)
  const [search,    setSearch]    = useState("")

  // ── Reader ──────────────────────────────────────────────
  const [selected,  setSelected]  = useState<Surah | null>(null)
  const [ayahs,     setAyahs]     = useState<Ayah[]>([])
  const [ayahLoad,  setAyahLoad]  = useState(false)
  const [showTrans, setShowTrans] = useState(true)

  // ── Playback ────────────────────────────────────────────
  const [playNum,   setPlayNum]   = useState<number | null>(null) // ayah.numberInSurah
  const [hlWord,    setHlWord]    = useState<number | null>(null) // 0-indexed word
  const [autoNext,  setAutoNext]  = useState(true)

  // ── Refs (stable across renders, safe in callbacks) ─────
  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const animRef     = useRef<number | null>(null)
  const ayahsRef    = useRef<Ayah[]>([])
  const autoNextRef = useRef(true)

  useEffect(() => { ayahsRef.current    = ayahs    }, [ayahs])
  useEffect(() => { autoNextRef.current = autoNext }, [autoNext])

  // ── Load surah list ─────────────────────────────────────
  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(r => r.json())
      .then(d => { setSurahs(d.data); setListLoad(false) })
      .catch(() => setListLoad(false))
  }, [])

  // ── Stop everything ─────────────────────────────────────
  function stopPlayback() {
    audioRef.current?.pause()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = null
    setPlayNum(null)
    setHlWord(null)
  }

  // ── Open surah ──────────────────────────────────────────
  async function openSurah(surah: Surah) {
    stopPlayback()
setSelected(surah)
    setAyahs([])
    setAyahLoad(true)

    try {
      const [arabicRes, uzRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/uz.sodik`),
      ])
      const arabicData = await arabicRes.json()
      const uzData     = await uzRes.json()

      const combined: Ayah[] = arabicData.data.ayahs.map((a: Ayah, i: number) => ({
        ...a,
        translation: uzData.data?.ayahs?.[i]?.text ?? "",
      }))
      setAyahs(combined)
    } catch {
      setAyahs([])
    }
    setAyahLoad(false)
  }

  // ── Play single ayah (also called recursively for auto-next) ─
  function playAyah(ayah: Ayah) {
    // Stop previous
    audioRef.current?.pause()
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setHlWord(null)

    const s   = String(selected?.number ?? 1).padStart(3, "0")
    const a   = String(ayah.numberInSurah).padStart(3, "0")
    const url = `${QC_BASE}Alafasy/mp3/${s}${a}.mp3`
    const audio = new Audio(url)
    audioRef.current = audio
    setPlayNum(ayah.numberInSurah)

    const wordCount = ayah.text.split(" ").length

    // Smooth scroll to this ayah
    setTimeout(() =>
      document.getElementById(`ayah-${ayah.numberInSurah}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" }), 80)

    // RAF loop — proportional word highlight
    function tick() {
      if (!audioRef.current || audioRef.current !== audio) return
      const dur = audio.duration
      if (dur && !isNaN(dur) && dur > 0) {
        const idx = Math.min(
          Math.floor((audio.currentTime / dur) * wordCount),
          wordCount - 1
        )
        setHlWord(idx)
      }
      if (!audio.paused && !audio.ended)
        animRef.current = requestAnimationFrame(tick)
    }

    audio.onplay  = () => { animRef.current = requestAnimationFrame(tick) }
    audio.onerror = () => { setPlayNum(null); setHlWord(null) }
    audio.onended = () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      setHlWord(null)
      setPlayNum(null)
      if (autoNextRef.current) {
        const all = ayahsRef.current
        const idx = all.findIndex(a => a.numberInSurah === ayah.numberInSurah)
        if (idx >= 0 && idx + 1 < all.length)
          setTimeout(() => playAyah(all[idx + 1]), 350)
      }
    }
    audio.play().catch(() => {})
  }

  function togglePlay(ayah: Ayah) {
    if (playNum === ayah.numberInSurah) stopPlayback()
    else playAyah(ayah)
  }

  // ── Surah list play (full mp3) ───────────────────────────
  function playSurah(surah: Surah, e: React.MouseEvent) {
    e.stopPropagation()
    stopPlayback()
    const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah.number}.mp3`
    const audio = new Audio(url)
    audioRef.current = audio
    audio.play().catch(() => {})
  }

  const filtered = surahs.filter(s => {
    const q = search.toLowerCase()
    return UZ_NAMES[s.number]?.toLowerCase().includes(q)
      || s.englishName.toLowerCase().includes(q)
      || String(s.number).includes(q)
  })

  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen text-white"
      style={{ background: "linear-gradient(160deg, #021a0f 0%, #041208 50%, #020e08 100%)" }}>
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none opacity-[0.06]" />

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-yellow-500/10 bg-black/30 backdrop-blur-xl">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/"
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors flex-shrink-0">
            <ChevronLeft className="w-4 h-4" />
            <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-yellow-500/30">
              <Image src="/images/mosque-logo.png" alt="Logo" width={28} height={28} className="object-cover scale-110" />
            </div>
          </Link>

          <div className="flex-1">
            <h1 className="text-yellow-400 font-serif font-bold text-sm leading-none">Қуръони Карим</h1>
            <p className="text-white/25 text-[10px] mt-0.5">114 сура · Мишари Рашид тиловати</p>
          </div>

          {selected && (
            <div className="flex items-center gap-1.5">
              {/* Translation toggle */}
              <button
                onClick={() => setShowTrans(v => !v)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all ${
                  showTrans
                    ? "border-yellow-500/50 bg-yellow-500/15 text-yellow-300"
                    : "border-white/15 text-white/30 hover:border-white/30 hover:text-white/50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Таржима</span>
              </button>

              {/* Auto-next toggle */}
              <button
                onClick={() => setAutoNext(v => !v)}
                title={autoNext ? "Автоматик давом: ёқиқ" : "Автоматик давом: ўчиқ"}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                  autoNext
                    ? "border-yellow-500/50 bg-yellow-500/15 text-yellow-300"
                    : "border-white/15 text-white/30 hover:border-white/30"
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <p className="text-yellow-500/35 font-serif text-lg flex-shrink-0" dir="rtl">بِسْمِ اللَّهِ</p>
        </div>
      </header>

      <div className="relative max-w-5xl mx-auto px-4 py-6">

        {/* ════════ SURAH LIST ════════ */}
        {!selected ? (
          <>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Сура номи ёки рақами..."
                className="w-full bg-white/5 border border-yellow-500/15 rounded-xl pl-11 pr-4 py-3.5 text-white
                  placeholder-white/20 text-sm focus:outline-none focus:border-yellow-500/35 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {listLoad ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-yellow-500/40 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filtered.map(s => (
                  <div key={s.number}
                    onClick={() => openSurah(s)} role="button" tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && openSurah(s)}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-white/8 bg-white/3
                      hover:border-yellow-500/25 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20
                      flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 text-xs font-bold">{s.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <p className="text-white font-semibold text-sm">{UZ_NAMES[s.number] || s.englishName}</p>
                        <p className="text-white/30 text-xs">{s.numberOfAyahs} оят</p>
                      </div>
                      <p className="text-white/25 text-[10px] mt-0.5">
                        {s.revelationType === "Meccan" ? "Маккий" : "Мадиний"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-yellow-400/60 font-serif text-base" dir="rtl">{s.name}</p>
                      <button onClick={e => playSurah(s, e)}
                        className="w-8 h-8 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20
                          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Play className="w-3.5 h-3.5 text-yellow-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>

        ) : (
          /* ════════ SURAH READER ════════ */
          <div>
            {/* Back + title */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => { stopPlayback(); setSelected(null); setAyahs([]) }}
                className="w-9 h-9 rounded-full border border-white/10 hover:border-yellow-500/30
                  flex items-center justify-center text-white/40 hover:text-yellow-400 transition-all flex-shrink-0">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h2 className="text-white font-serif font-bold text-lg">{UZ_NAMES[selected.number]}</h2>
                  <span className="text-yellow-400/60 font-serif text-base" dir="rtl">{selected.name}</span>
                </div>
                <p className="text-white/30 text-xs">
                  {selected.numberOfAyahs} оят · {selected.revelationType === "Meccan" ? "Маккий" : "Мадиний"}
                </p>
              </div>
            </div>

            {/* Bismillah */}
            {selected.number !== 9 && (
              <div className="text-center py-5 mb-4 border border-yellow-500/15 rounded-2xl bg-yellow-500/5">
                <p className="text-yellow-400/80 font-serif text-2xl" dir="rtl">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-white/30 text-xs mt-1.5">Меҳрибон ва раҳмли Аллоҳ номи билан</p>
              </div>
            )}

            {ayahLoad ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-yellow-500/40 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2 pb-10">
                {ayahs.map(ayah => {
                  const isPlaying = playNum === ayah.numberInSurah
                  const words     = ayah.text.split(" ")

                  return (
                    <div key={ayah.numberInSurah} id={`ayah-${ayah.numberInSurah}`}
                      className={`rounded-xl border p-4 transition-all duration-300 ${
                        isPlaying
                          ? "border-yellow-500/40 bg-yellow-500/8 shadow-lg shadow-yellow-500/5"
                          : "border-white/8 bg-white/3 hover:border-white/12"
                      }`}
                    >
                      <div className="flex items-start gap-3">

                        {/* Ayah number + play button */}
                        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 pt-1">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                            isPlaying
                              ? "bg-yellow-500/20 border-yellow-500/50"
                              : "bg-yellow-500/10 border-yellow-500/20"
                          }`}>
                            <span className="text-yellow-400/80 text-[10px] font-bold">
                              {ayah.numberInSurah}
                            </span>
                          </div>
                          <button onClick={() => togglePlay(ayah)}
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isPlaying
                                ? "bg-yellow-500/25 text-yellow-300"
                                : "bg-white/5 hover:bg-yellow-500/15 text-white/30 hover:text-yellow-400"
                            }`}
                          >
                            {isPlaying
                              ? <Pause  className="w-3 h-3" />
                              : <Volume2 className="w-3 h-3" />
                            }
                          </button>
                        </div>

                        {/* Text block */}
                        <div className="flex-1 min-w-0">

                          {/* ── Arabic karaoke ── */}
                          <p className="font-serif text-xl leading-loose text-right mb-3 select-text"
                            dir="rtl">
                            {words.map((word, wi) => (
                              <span key={wi}
                                className={`mx-px ${
                                  isPlaying && hlWord === wi
                                    ? "quran-word-active"
                                    : isPlaying
                                    ? "quran-word-dim"
                                    : "inline-block text-white"
                                }`}
                              >
                                {word}
                              </span>
                            ))}
                          </p>

                          {/* ── Uzbek translation ── */}
                          {showTrans && ayah.translation && (
                            <p className="text-white/45 text-sm leading-relaxed border-t border-white/8 pt-2.5">
                              {ayah.translation}
                            </p>
                          )}
                        </div>

                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
