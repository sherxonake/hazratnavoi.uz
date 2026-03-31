import { MapPin, Phone, Send, Instagram } from "lucide-react"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer id="aloqa" className="relative bg-emerald-deep overflow-hidden">
      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-gold opacity-60 pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/60 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <rect x="10" y="3" width="2" height="5" rx="1" fill="white" opacity="0.9" />
                  <rect x="7" y="5" width="1.5" height="4" rx="0.75" fill="white" opacity="0.7" />
                  <rect x="13.5" y="5" width="1.5" height="4" rx="0.75" fill="white" opacity="0.7" />
                  <rect x="5.5" y="9" width="11" height="1" rx="0.5" fill="white" />
                  <rect x="5.5" y="10" width="11" height="7" rx="1" fill="white" opacity="0.25" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-serif font-bold text-white text-base tracking-wide">HAZRATNAVOI.UZ</span>
                <span className="text-yellow-400/70 text-xs">
                  {label(lang, "Rasmiy veb-sayt", "Расмий веб-сайт")}
                </span>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              {label(
                lang,
                "Navoiy viloyati Hazrat Navoiy jome masjidi — din, ilm va ma'naviyat markazi. Har bir qalb uchun ochiq makon.",
                "Навоий вилояти Ҳазрат Навоий жоме масжиди — дин, илм ва маьнавият маркази. Ҳар бир қалб учун очиқ макон."
              )}
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/hazratnavoi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Telegram kanaliga o'tish"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com/hazratnavoi_uz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram sahifasiga o'tish"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">
              {label(lang, "Bo'limlar", "Бўлимлар")}
            </h3>
            <nav className="flex flex-col gap-2.5" aria-label="Qo'shimcha navigatsiya">
              {[
                { l: "Bosh sahifa", c: "Бош саҳифа", href: "#bosh" },
                { l: "Yangiliklar", c: "Янгиликлар", href: "#yangiliklar" },
                { l: "Ma'ruzalar", c: "Маърузалар", href: "#maruzalar" },
                { l: "Savol-javob", c: "Савол-жавоб", href: "#savol" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  {label(lang, link.l, link.c)}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest">
              {label(lang, "Aloqa", "Алоқа")}
            </h3>
            <address className="not-italic flex flex-col gap-3">
              <div className="flex items-start gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-400/70" aria-hidden="true" />
                <span>
                  {label(
                    lang,
                    "Navoiy shahri, Hazrat Navoiy ko'chasi, 1",
                    "Навоий шаҳри, Ҳазрат Навоий кўчаси, 1"
                  )}
                </span>
              </div>
              <a
                href="tel:+998762000001"
                className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                <Phone className="w-4 h-4 flex-shrink-0 text-yellow-400/70" aria-hidden="true" />
                +998 76 200 00 01
              </a>
              <a
                href="mailto:info@hazratnavoi.uz"
                className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors duration-200 break-all"
              >
                <Send className="w-4 h-4 flex-shrink-0 text-yellow-400/70" aria-hidden="true" />
                info@hazratnavoi.uz
              </a>
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            {label(
              lang,
              "© 2026 Hazratnavoi.uz. Barcha huquqlar himoyalangan.",
              "© 2026 Hazratnavoi.uz. Барча ҳуқуқлар ҳимояланган."
            )}
          </p>
          <p className="text-white/30 text-xs">
            {label(lang, "Navoiy, O'zbekiston", "Навоий, Ўзбекистон")}
          </p>
        </div>
      </div>
    </footer>
  )
}
