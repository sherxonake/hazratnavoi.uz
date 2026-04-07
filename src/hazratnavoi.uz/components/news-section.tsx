"use client"

import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNews } from "@/hooks/use-news"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function NewsSection({ lang }: { lang: Lang }) {
  const { news, loading, error } = useNews()
  return (
    <section id="yangiliklar" className="relative py-24 lg:py-32 bg-emerald-deep overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-yellow-500/60" />
              <span className="text-yellow-400/80 text-xs font-semibold uppercase tracking-widest">
                {label(lang, "So'nggi yangiliklar", "Сўнгги янгиликлар")}
              </span>
            </div>
            <h2 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance">
              {label(lang, "Masjid yangiliklari", "Масжид янгиликлари")}
            </h2>
          </div>
          <a
            href="#yangiliklar"
            className="flex items-center gap-2 text-yellow-400 font-medium text-sm hover:gap-3 transition-all duration-300 group flex-shrink-0"
          >
            {label(lang, "Barcha yangiliklar", "Барча янгиликлар")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
          </a>
        </div>

        {/* News Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="col-span-full text-center py-12 text-white/50">
              {label(lang, "Yangiliklar yuklanmoqda...", "Янгиликлар юкланмоқда...")}
            </div>
          )}

          {error && (
            <div className="col-span-full text-center py-12 text-red-400">
              {label(lang, "Xatolik: ", "Хатолик: ")} {error}
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/50">
              {label(lang, "Hozircha yangiliklar yo'q", "Ҳозирча янгиликлар йўқ")}
            </div>
          )}

          {!loading && !error && news.map((item) => (
            <article
              key={item.id}
              className="group bg-white/5 border border-yellow-500/15 rounded-2xl overflow-hidden hover:bg-white/8 hover:border-yellow-500/30 hover:-translate-y-1 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={label(lang, item.title, item.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-yellow-500/10 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-yellow-400/40" aria-hidden="true" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-3">
                {/* Date */}
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                  <span>
                    {new Date(item.created_at).toLocaleDateString(lang === "latin" ? "uz-Latn-UZ" : "uz-Cyrl-UZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-white font-bold text-base sm:text-lg leading-snug text-balance group-hover:text-yellow-400 transition-colors duration-300">
                  {label(lang, item.title, item.title)}
                </h3>

                {/* Excerpt */}
                <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                  {item.content}
                </p>

                {/* Link */}
                <a
                  href="#yangiliklar"
                  className="flex items-center gap-1.5 text-yellow-400/80 text-sm font-semibold mt-auto hover:gap-2.5 hover:text-yellow-400 transition-all duration-300 group/link"
                >
                  {label(lang, "Batafsil o'qish", "Батафсил ўқиш")}
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
