"use client"

import { useState, useEffect } from "react"
import { Menu, X, Phone, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AuthModal } from "./auth-modal"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { label: "Bosh sahifa", labelCyrillic: "Бош саҳифа", href: "#bosh" },
  { label: "Yangiliklar", labelCyrillic: "Янгиликлар", href: "#yangiliklar" },
  { label: "Ma'ruzalar", labelCyrillic: "Маърузалар", href: "#maruzalar" },
  { label: "Savol-javob", labelCyrillic: "Савол-жавоб", href: "#savol" },
  { label: "Makka", labelCyrillic: "Макка", href: "#makkah" },
]

interface SiteUser { id: string; phone: string; name: string }

export function Header({ lang, onToggleLang }: { lang: "latin" | "cyrillic"; onToggleLang: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, setUser, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleAuthSuccess(u: SiteUser) {
    setUser(u)
    setShowAuth(false)
  }

  function handleLogout() {
    logout()
    setUserMenuOpen(false)
  }

  const label = (l: string, c: string) => (lang === "latin" ? l : c)

  // Crescent + star icon (Islamic style)
  const AuthIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )

  const userInitials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.phone?.slice(-4) || "?"

  return (
    <>
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
            <a href="#bosh" className="flex items-center gap-3 group" aria-label="Hazratnavoi.uz">
              <div className={cn(
                "w-14 h-14 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300 ring-2 ring-yellow-500/30",
                scrolled ? "bg-emerald-950" : "bg-emerald-950/80"
              )}>
                <Image
                  src="/images/mosque-logo.png"
                  alt="Ҳазрат Навоий масжиди"
                  width={56} height={56}
                  className="object-cover w-full h-full scale-[1.15]"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className={cn(
                  "font-serif font-bold text-sm sm:text-base tracking-wide transition-colors duration-300",
                  scrolled ? "text-yellow-400" : "text-white"
                )}>HAZRATNAVOI</span>
                <span className="text-xs tracking-widest text-emerald-300">.UZ</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href}
                  className="text-sm font-medium text-white/90 hover:text-yellow-400 transition-colors duration-200 relative group">
                  {label(link.label, link.labelCyrillic)}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Language toggle */}
              <button onClick={onToggleLang}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30 text-white/80 hover:border-yellow-400/60 hover:text-yellow-400 transition-all duration-200">
                {lang === "latin" ? "Кирилл" : "Lotin"}
              </button>

              {/* Auth button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-full pl-2 pr-3 py-1.5 transition-all duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-emerald-950 text-xs font-bold">
                      {userInitials}
                    </div>
                    <span className="text-yellow-300 text-xs font-medium max-w-[80px] truncate">
                      {user.name || user.phone}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-emerald-950 border border-yellow-500/20 rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-white text-xs font-semibold truncate">{user.name || "Фойдаланувчи"}</p>
                        <p className="text-white/40 text-xs truncate">{user.phone}</p>
                      </div>
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 text-sm transition-colors">
                        <LogOut className="w-4 h-4" />
                        {label("Chiqish", "Чиқиш")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 hover:from-yellow-500/30 hover:to-yellow-600/20 border border-yellow-500/40 hover:border-yellow-500/70 text-yellow-300 hover:text-yellow-200 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 group"
                >
                  <AuthIcon />
                  {label("Kirish", "Кириш")}
                </button>
              )}

              {/* Bog'lanish */}
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 shadow-md" asChild>
                <a href="#aloqa">
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  {label("Bog'lanish", "Боғланиш")}
                </a>
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? "Менюни ёпиш" : "Менюни очиш"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <nav className="bg-emerald-950/98 backdrop-blur-xl border-t border-emerald-800 px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white font-medium py-2 border-b border-emerald-800/50 hover:text-yellow-400 transition-colors">
                {label(link.label, link.labelCyrillic)}
              </a>
            ))}

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <button onClick={onToggleLang}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/40 text-white hover:border-yellow-400 hover:text-yellow-400 transition-all">
                {lang === "latin" ? "Кирилл" : "Lotin"}
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full pl-2 pr-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-emerald-950 text-xs font-bold">{userInitials}</div>
                    <span className="text-yellow-300 text-xs">{user.name || user.phone}</span>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 text-xs px-3 py-1.5 rounded-full border border-red-400/30">
                    <LogOut className="w-3.5 h-3.5" />
                    {label("Chiqish", "Чиқиш")}
                  </button>
                </div>
              ) : (
                <button onClick={() => { setShowAuth(true); setMobileOpen(false) }}
                  className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/40 text-yellow-300 rounded-full px-4 py-1.5 text-sm font-medium">
                  <User className="w-3.5 h-3.5" />
                  {label("Kirish", "Кириш")}
                </button>
              )}

              <Button size="sm" className="bg-primary text-primary-foreground rounded-full px-4" asChild>
                <a href="#aloqa" onClick={() => setMobileOpen(false)}>
                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                  {label("Bog'lanish", "Боғланиш")}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
      )}

      {/* Close user menu on outside click */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </>
  )
}
