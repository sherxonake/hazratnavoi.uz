"use client"

import { useState } from "react"
import { PlayCircle, Youtube, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

// Имом Темуржон домла Атоевнинг YouTube видео маърузалари
const VIDEOS = [
  {
    id: "dQw4w9WgXcQ", // Ўзгартириш керак (реал YouTube video ID)
    titleLatin: "Жума маърузаси — Рамазон ойининг фазилати",
    titleCyrillic: "Жума маърузаси — Рамазон ойининг фазилати",
    date: "2026-03-27",
    views: "12,453",
  },
  {
    id: "dQw4w9WgXcQ", // Ўзгартириш керак
    titleLatin: "Закот ва унинг ҳукми",
    titleCyrillic: "Закот ва унинг ҳукми",
    date: "2026-03-20",
    views: "8,234",
  },
  {
    id: "dQw4w9WgXcQ", // Ўзгартириш керак
    titleLatin: "Намоз — диннинг устуни",
    titleCyrillic: "Намоз — диннинг устуни",
    date: "2026-03-13",
    views: "15,678",
  },
]

export function VideoSection({ lang }: { lang: Lang }) {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)

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
              {label(lang, "ВИДЕО МАЪРУЗАЛАР", "VIDEO MA'RUZALAR")}
            </span>
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {label(
              lang,
              "Имом маърузалари",
              "Имом маърузалари"
            )}
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto">
            {label(
              lang,
              "Темуржон домла Атоевнинг жума ва бошқа маърузалари",
              "Темуржон домла Атоевнинг жума ва бошқа маърузалари"
            )}
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {VIDEOS.map((video, i) => (
            <div
              key={i}
              className="bg-emerald-800/60 backdrop-blur-xl rounded-2xl border-2 border-yellow-500/30 overflow-hidden shadow-2xl hover:border-yellow-400/50 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedVideo(i)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-emerald-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <PlayCircle className="w-8 h-8 text-white ml-1" aria-hidden="true" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  45:00
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-serif text-white text-lg font-bold mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {label(lang, video.titleLatin, video.titleCyrillic)}
                </h3>
                
                <div className="flex items-center justify-between text-xs text-emerald-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(video.date).toLocaleDateString(lang === "latin" ? "uz-Latn-UZ" : "uz-Cyrl-UZ", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{video.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YouTube Channel Link */}
        <div className="text-center">
          <a
            href="https://youtube.com/@hazratnavoi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Youtube className="w-6 h-6" aria-hidden="true" />
            {label(
              lang,
              "YouTube каналга обуна бўлинг",
              "YouTube каналга обуна бўлинг"
            )}
          </a>
        </div>

        {/* Video Modal */}
        {selectedVideo !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative w-full max-w-4xl aspect-video">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
                aria-label="Ёпиш"
              >
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${VIDEOS[selectedVideo].id}?autoplay=1`}
                title="YouTube video player"
                className="w-full h-full rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
