"use client"

import { Youtube, Send, Instagram, Phone, MapPin, Clock, Mail } from "lucide-react"
import Link from "next/link"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

interface SocialLinks {
  youtube: string
  telegram: string
  instagram: string
}

// Социал тармоқлар (Ҳазрат Навоий жоме масжиди)
const SOCIAL_LINKS: SocialLinks = {
  youtube: "https://www.youtube.com/@hazratnavoiuz",
  telegram: "https://t.me/hazratnavoiuz", // Ўзгартириш керак
  instagram: "https://instagram.com/hazratnavoiuz", // Ўзгартириш керак
}

export function Footer({ lang }: { lang: Lang }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-emerald-deep text-white overflow-hidden">
      {/* Islamic geometric pattern overlay — gold toned */}
      <div className="absolute inset-0 islamic-pattern-gold pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0,20,10,0.4) 100%)" }}
        aria-hidden="true"
      />
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Column 1: Masjid Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="font-serif text-2xl lg:text-3xl font-bold text-yellow-400 mb-3">
                  {label(
                    lang,
                    "Ҳазрат Навоий жоме масжиди",
                    "Ҳазрат Навоий жоме масжиди"
                  )}
                </h3>
                <p className="text-emerald-100 text-sm leading-relaxed mb-4">
                  {label(
                    lang,
                    "Навоий вилоятининг бош жоме масжиди. Диний маърифат, ибодат ва яхшилик макони.",
                    "Навоий вилоятининг бош жоме масжиди. Диний маърифат, ибодат ва яхшилик макони."
                  )}
                </p>
              </div>

              {/* Social Media Links */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-widest mb-4">
                  {label(lang, "Ижтимоий тармоқлар", "Ижтимоий тармоқлар")}
                </h4>
                <div className="flex gap-3">
                  {/* YouTube */}
                  <Link
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-6 h-6 text-white" />
                  </Link>

                  {/* Telegram */}
                  <Link
                    href={SOCIAL_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label="Telegram"
                  >
                    <Send className="w-6 h-6 text-white" />
                  </Link>

                  {/* Instagram */}
                  <Link
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-white" />
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-emerald-100">
                  <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <a href="tel:+998762000001" className="hover:text-yellow-400 transition-colors">
                    +998 76 200 00 01
                  </a>
                </div>
                <div className="flex items-center gap-3 text-emerald-100">
                  <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <a href="mailto:info@hazratnavoi.uz" className="hover:text-yellow-400 transition-colors">
                    info@hazratnavoi.uz
                  </a>
                </div>
                <div className="flex items-start gap-3 text-emerald-100">
                  <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {label(
                      lang,
                      "Навоий шаҳри, Марказий майдон",
                      "Навоий шаҳри, Марказий майдон"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-widest mb-4">
                {label(lang, "Тезкор ҳаволалар", "Тезкор ҳаволалар")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-emerald-100 hover:text-yellow-400 transition-colors">
                    {label(lang, "Бош саҳифа", "Бош саҳифа")}
                  </Link>
                </li>
                <li>
                  <Link href="#yangiliklar" className="text-emerald-100 hover:text-yellow-400 transition-colors">
                    {label(lang, "Янгиликлар", "Янгиликлар")}
                  </Link>
                </li>
                <li>
                  <Link href="#maruzalar" className="text-emerald-100 hover:text-yellow-400 transition-colors">
                    {label(lang, "Маърузалар", "Маърузалар")}
                  </Link>
                </li>
                <li>
                  <Link href="#savol" className="text-emerald-100 hover:text-yellow-400 transition-colors">
                    {label(lang, "Савол-жавоб", "Савол-жавоб")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Prayer Times Widget */}
            <div>
              <h4 className="text-sm font-semibold text-emerald-200 uppercase tracking-widest mb-4">
                {label(lang, "Намоз вақтлари", "Намоз вақтлари")}
              </h4>
              <div className="bg-emerald-800/50 backdrop-blur rounded-xl p-4 border border-yellow-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-semibold text-emerald-100">
                    {label(lang, "Навоий шаҳри", "Навоий шаҳри")}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Бомдод:</span>
                    <span className="text-yellow-400 font-semibold">05:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Қуёш:</span>
                    <span className="text-yellow-400 font-semibold">06:30</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Пешин:</span>
                    <span className="text-yellow-400 font-semibold">12:45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Аср:</span>
                    <span className="text-yellow-400 font-semibold">16:15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Шом:</span>
                    <span className="text-yellow-400 font-semibold">18:45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-200">Хуфтон:</span>
                    <span className="text-yellow-400 font-semibold">20:15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-emerald-300 text-sm text-center md:text-left">
                © {currentYear} Hazratnavoi.uz — {label(lang, "Барча ҳуқуқлар ҳимояланган", "Барча ҳуқуқлар ҳимояланган")}
              </p>
              <p className="text-emerald-400 text-xs">
                {label(
                  lang,
                  "Темуржон домла Атоев — Бош имом-хатиб",
                  "Темуржон домла Атоев — Бош имом-хатиб"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
