"use client"

import { useState } from "react"
import Link from "next/link"

// Arc from 180° (left) to 90° (up), radius 140px — items spaced evenly
const ITEMS = [
  { label: "Намоз",  icon: "🕌", href: "/namoz",    tx: -140, ty: 0    },
  { label: "Тасбеҳ", icon: "📿", href: "/#tasbih",  tx: -129, ty: -54  },
  { label: "Қуръон", icon: "📖", href: "/quran",    tx: -99,  ty: -99  },
  { label: "Макка",  icon: "🕋", href: "/#makkah",  tx: -54,  ty: -129 },
  { label: "Ҳадис",  icon: "📜", href: "/#hadith",  tx: 0,    ty: -140 },
]

export function FloatingMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-5 z-50">
      {ITEMS.map((item, i) => (
        <div
          key={item.href}
          className="absolute bottom-0 right-0"
          style={{
            transform: open ? `translate(${item.tx}px, ${item.ty}px)` : "translate(0,0)",
            opacity: open ? 1 : 0,
            transition: `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${open ? i * 0.06 : (4 - i) * 0.045}s, opacity 0.25s ease ${open ? i * 0.04 : 0}s`,
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <Link
            href={item.href}
            onClick={() => setOpen(false)}
            className="group block"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300/50 shadow-xl shadow-black/60 flex items-center justify-center gap-1 group-hover:scale-115 active:scale-90 transition-transform duration-200">
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="font-sans font-bold text-emerald-900 text-[10px] leading-tight select-none">{item.label}</span>
            </div>
          </Link>
        </div>
      ))}

      {/* Main button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`relative w-14 h-14 rounded-full shadow-xl shadow-black/50 transition-all duration-300 flex items-center justify-center ${
          open
            ? "bg-emerald-900 border-2 border-yellow-400/60 rotate-12"
            : "bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-300/40"
        }`}
        aria-label={open ? "Yopish" : "Menu ochish"}
      >
        {!open && (
          <span
            className="absolute inset-0 rounded-full bg-yellow-400/25 animate-ping pointer-events-none"
            style={{ animationDuration: "2.8s" }}
          />
        )}
        {open ? (
          <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-emerald-900" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
            {/* Crescent */}
            <path d="M24 7C14.6 7 7 14.6 7 24C7 33.4 14.6 41 24 41C18.2 38.4 14 32.7 14 26C14 19.3 18.2 13.6 24 11C24 11 24 7 24 7Z" />
            {/* Star */}
            <path d="M36 9L37.5 13.7L42 13.7L38.5 16.6L40 21.3L36 18.4L32 21.3L33.5 16.6L30 13.7L34.5 13.7Z" />
          </svg>
        )}
      </button>
    </div>
  )
}
