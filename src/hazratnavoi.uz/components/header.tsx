"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Bosh sahifa", labelCyrillic: "Бош саҳифа", href: "#bosh" },
  { label: "Yangiliklar", labelCyrillic: "Янгиликлар", href: "#yangiliklar" },
  { label: "Ma'ruzalar", labelCyrillic: "Маърузалар", href: "#maruzalar" },
  { label: "Savol-javob", labelCyrillic: "Савол-жавоб", href: "#savol" },
]

export function Header({ lang, onToggleLang }: { lang: "latin" | "cyrillic"; onToggleLang: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const label = (l: string, c: string) => (lang === "latin" ? l : c)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-emerald-950/95 backdrop-blur-xl shadow-sm border-b border-emerald-800"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#bosh"
            className="flex items-center gap-3 group"
            aria-label="Hazratnavoi.uz — Бош саҳифага қайтиш"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4.5 5.5h9l-1 7h-7l-1-7z" fill="white" />
                <path d="M7.5 9.5h7M8 12.5h6M8.5 15.5h5" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
                {/* Simplified minaret icon */}
                <rect x="10" y="3" width="2" height="5" rx="1" fill="white" opacity="0.9" />
                <rect x="7" y="5" width="1.5" height="4" rx="0.75" fill="white" opacity="0.7" />
                <rect x="13.5" y="5" width="1.5" height="4" rx="0.75" fill="white" opacity="0.7" />
                <rect x="5.5" y="9" width="11" height="1" rx="0.5" fill="white" />
                <rect x="5.5" y="10" width="11" height="7" rx="1" fill="white" opacity="0.2" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={cn(
                  "font-serif font-bold text-sm sm:text-base tracking-wide transition-colors duration-300",
                  scrolled ? "text-yellow-400" : "text-white"
                )}
              >
                HAZRATNAVOI
              </span>
              <span
                className={cn(
                  "text-xs tracking-widest transition-colors duration-300",
                  scrolled ? "text-emerald-300" : "text-emerald-300"
                )}
              >
                .UZ
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Асосий навигация">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 hover:text-primary relative group",
                  scrolled ? "text-white/90" : "text-white/90"
                )}
              >
                {label(link.label, link.labelCyrillic)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right: Language + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={onToggleLang}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-300",
                scrolled
                  ? "border-white/40 text-white hover:border-yellow-400 hover:text-yellow-400"
                  : "border-white/40 text-white hover:border-white hover:bg-white/10"
              )}
              aria-label="Тилни алмаштириш"
            >
              {lang === "latin" ? "Кирилл" : "Lotin"}
            </button>

            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 shadow-md"
              asChild
            >
              <a href="#aloqa">
                <Phone className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                {label("Bog'lanish", "Боғланиш")}
              </a>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors duration-300",
              scrolled ? "text-white hover:bg-white/10" : "text-white hover:bg-white/10"
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Менюни ёпиш" : "Менюни очиш"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-400",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="bg-emerald-950/95 backdrop-blur-xl border-t border-emerald-800 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-white font-medium py-2 border-b border-emerald-800/50 hover:text-yellow-400 transition-colors duration-200"
            >
              {label(link.label, link.labelCyrillic)}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onToggleLang}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/40 text-white hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200"
            >
              {lang === "latin" ? "Кирилл" : "Lotin"}
            </button>
            <Button size="sm" className="bg-primary text-primary-foreground rounded-full px-5" asChild>
              <a href="#aloqa" onClick={() => setMobileOpen(false)}>
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                {label("Bog'lanish", "Боғланиш")}
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
