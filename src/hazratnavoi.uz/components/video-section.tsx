"use client"

import { useState } from "react"
import { PlayCircle, Youtube, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

// Имом Темуржон домла Атоевнинг YouTube видео маърузалари
const VIDEOS = [
  {
    id: "videos", // Каналдаги сўнгги видео
    titleLatin: "Жума маърузаси — Рамазон ойининг фазилати",
    titleCyrillic: "Жума маърузаси — Рамазон ойининг фазилати",
    date: "2026-03-27",
    views: "12,453",
  },
  {
    id: "videos", // Каналдаги сўнгги видео
    titleLatin: "Закот ва унинг ҳукми",
    titleCyrillic: "Закот ва унинг ҳукми",
    date: "2026-03-20",
    views: "8,234",
  },
  {
    id: "videos", // Каналдаги сўнгги видео
    titleLatin: "Намоз — диннинг устуни",
    titleCyrillic: "Намоз — диннинг устуни",
    date: "2026-03-13",
    views: "15,678",
  },
]

export function VideoSection({ lang }: { lang: Lang }) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 relative overflow-hidden">
      <div className="absolute inset-0 islamiy-pattern opacity-25" aria-hidden="true" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-emerald-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg">
              <Youtube className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-red-400 text-sm font-bold uppercase tracking-widest">
              {label(lang, "VIDEO MA'RUZALAR", "ВИДЕО МАЪРУЗАЛАР")}
            </span>
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {label(
              lang,
              "Imom ma'ruzalari",
              "Имом маърузалари"
            )}
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto">
            {label(
              lang,
              "Temurjon domla Atoevning juma va boshqa ma'ruzalari",
              "Темуржон домла Атоевнинг жума ва бошқа маърузалари"
            )}
          </p>
        </div>

        {/* YouTube Channel Link */}
        <div className="text-center">
          <a
            href="https://www.youtube.com/@hazratnavoiuz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Youtube className="w-6 h-6" aria-hidden="true" />
            {label(
              lang,
              "YouTube kanalga o'tish",
              "YouTube каналга ўтиш"
            )}
          </a>
          <p className="text-emerald-200 text-sm mt-4">
            {label(
              lang,
              "Barcha video ma'ruzalarni ko'rish uchun tugmani bosing",
              "Барча видео маърузаларни кўриш учун тугмани босинг"
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
