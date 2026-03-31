"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ImamSection } from "@/components/imam-section"
import { HeritageSection } from "@/components/heritage-section"
import { NewsSection } from "@/components/news-section"
import { QASection } from "@/components/qa-section"
import { Footer } from "@/components/footer"

type Lang = "latin" | "cyrillic"

export default function Home() {
  const [lang, setLang] = useState<Lang>("latin")

  const toggleLang = () => setLang((prev) => (prev === "latin" ? "cyrillic" : "latin"))

  return (
    <main className="min-h-screen bg-background">
      <Header lang={lang} onToggleLang={toggleLang} />
      <HeroSection lang={lang} />
      <ImamSection lang={lang} />
      <HeritageSection lang={lang} />
      <NewsSection lang={lang} />
      <QASection lang={lang} />
      <Footer lang={lang} />
    </main>
  )
}
