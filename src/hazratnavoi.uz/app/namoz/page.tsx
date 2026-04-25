"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { TabTahorat } from "./_tab-tahorat"
import { TabNamoz } from "./_tab-namoz"
import { TabSuralar } from "./_tab-suralar"
import { TabSavollar } from "./_tab-savollar"

type Tab = "tahorat" | "namoz" | "suralar" | "savollar"

const TABS: { id: Tab; label: string; icon: string; desc: string }[] = [
  { id: "tahorat",  label: "Таҳорат",  icon: "💧", desc: "9 қадам" },
  { id: "namoz",    label: "Намоз",    icon: "🕌", desc: "5 вақт" },
  { id: "suralar",  label: "Суралар",  icon: "📖", desc: "6 сура" },
  { id: "savollar", label: "Саволлар", icon: "❓", desc: "10 савол" },
]

export default function NamozPage() {
  const [tab, setTab] = useState<Tab>("tahorat")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[var(--emerald-deep)]">
        <div className="absolute inset-0 hn-islamic pointer-events-none opacity-60" />
        <div className="relative max-w-2xl mx-auto px-4 pt-10 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />Бош саҳифа
          </Link>
          <div className="text-center">
            {/* Mosque SVG */}
            <div className="flex justify-center mb-3">
              <svg viewBox="0 0 64 64" width={56} height={56} aria-hidden>
                <path d="M32 4 L44 16 L60 16 L60 48 L4 48 L4 16 L20 16 Z" fill="rgb(255 255 255 / 0.15)" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.5" />
                <path d="M20 16 Q32 4 44 16" fill="rgb(255 255 255 / 0.1)" stroke="rgb(255 255 255 / 0.4)" strokeWidth="1.5" />
                <path d="M24 48 L24 32 Q32 26 40 32 L40 48" fill="rgb(255 255 255 / 0.2)" stroke="rgb(255 255 255 / 0.4)" strokeWidth="1" />
                <circle cx="32" cy="2" r="2.5" fill="rgb(253 224 71 / 0.9)" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Намоз ўқиш қўлланмаси</h1>
            <p className="text-foreground/40 font-arabic text-lg">دليل أداء الصلاة</p>
            <p className="text-foreground/40 text-xs mt-1">Ҳанафий мазҳаби бўйича</p>
          </div>
        </div>
      </div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-[var(--border)] shadow-lg shadow-black/20">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 px-1 text-center transition-all relative",
                  tab === t.id ? "text-yellow-300" : "text-muted-foreground hover:text-foreground/70"
                )}>
                {tab === t.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-yellow-400" />
                )}
                <span className="text-base">{t.icon}</span>
                <span className="text-xs font-semibold leading-none">{t.label}</span>
                <span className="text-[9px] leading-none opacity-60">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-20">
        {tab === "tahorat"  && <TabTahorat />}
        {tab === "namoz"    && <TabNamoz />}
        {tab === "suralar"  && <TabSuralar />}
        {tab === "savollar" && <TabSavollar />}
      </div>
    </div>
  )
}
