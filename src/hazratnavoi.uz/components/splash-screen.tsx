"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface SplashScreenProps {
  children: React.ReactNode
}

export function SplashScreen({ children }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showLogo, setShowLogo] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    // Шаг 1: Показываем Бисмиллях (уже видно по умолчанию)
    
    // Шаг 2: Через 1.5 секунды скрываем Бисмиллях и показываем логотип
    const timer1 = setTimeout(() => {
      setIsFadingOut(true)
      
      setTimeout(() => {
        setShowLogo(true)
        setIsFadingOut(false)
      }, 500) // Ждём завершения fade-out Бисмиллях
    }, 1500)

    // Шаг 3: Через 3 секунды (1.5 + 1.5) скрываем весь splash screen
    const timer2 = setTimeout(() => {
      setIsFadingOut(true)
      
      setTimeout(() => {
        setIsVisible(false)
      }, 500) // Ждём завершения fade-out
    }, 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  // Если splash screen скрыт, рендерим только children
  if (!isVisible) {
    return children
  }

  return (
    <>
      {/* Splash Screen Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
          isFadingOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Бисмиллях */}
        {!showLogo && (
          <div
            className={`transition-all duration-500 ${
              isFadingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <p className="text-4xl sm:text-5xl md:text-6xl font-serif text-emerald-800 animate-pulse">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-center text-sm sm:text-base text-emerald-600 mt-4 font-medium tracking-wide">
              Бисмилляҳир Роҳманир Роҳийм
            </p>
          </div>
        )}

        {/* Логотип */}
        {showLogo && (
          <div
            className={`transition-all duration-500 ${
              isFadingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 animate-pulse">
              <Image
                src="/images/mosque-logo.png"
                alt="Hazrat Navoiy masjidi logotipi"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
              />
            </div>
            <p className="text-center text-emerald-800 font-serif font-bold text-lg sm:text-xl mt-4">
              Ҳазрат Навоий
            </p>
            <p className="text-center text-emerald-600 text-xs sm:text-sm mt-1">
              Жоме масжиди
            </p>
          </div>
        )}
      </div>

      {/* Основной контент */}
      <div className={`transition-opacity duration-500 ${isVisible ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
    </>
  )
}
