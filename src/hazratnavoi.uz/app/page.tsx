"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ImamSection } from "@/components/imam-section"
import { IslamicCalendar } from "@/components/islamic-calendar"
import { QiblaCompass } from "@/components/qibla-compass"
import { TasbihCounter } from "@/components/tasbih-counter"
import { HadithSection } from "@/components/hadith-section"
import { VideoSection } from "@/components/video-section"
import { HeritageSection } from "@/components/heritage-section"
import { NewsSection } from "@/components/news-section"
import { QASection } from "@/components/qa-section"
import { MakkahSection } from "@/components/makkah-section"
import { ForumSection } from "@/components/forum-section"
import { PrayerTimesSection } from "@/components/prayer-times-section"
import { Footer } from "@/components/footer"

type Lang = "latin" | "cyrillic"

export default function Home() {
  const [lang, setLang] = useState<Lang>("cyrillic") // Кирилл по умолчанию

  const toggleLang = () => setLang((prev) => (prev === "latin" ? "cyrillic" : "latin"))

  return (
    <main className="min-h-screen bg-background">
      <Header lang={lang} onToggleLang={toggleLang} />
      <HeroSection lang={lang} />
      <PrayerTimesSection lang={lang} />
      <HadithSection lang={lang} />
      <MakkahSection lang={lang} />
      <ImamSection lang={lang} />
      <IslamicCalendar lang={lang} />
      <QiblaCompass lang={lang} />
      <TasbihCounter lang={lang} />
      <VideoSection lang={lang} />
      <HeritageSection lang={lang} />
      <NewsSection lang={lang} />
      <QASection lang={lang} />
      <ForumSection lang={lang} />
      <Footer lang={lang} />
    </main>
  )
}
