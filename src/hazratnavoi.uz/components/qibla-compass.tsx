"use client"

import { useState, useEffect, useCallback } from "react"
import { Compass, Navigation, RotateCcw, Moon } from "lucide-react"
import { calculateQiblaFromNavoiy } from "@/lib/prayer-calculations"
import { cn } from "@/lib/utils"

type Lang = "latin" | "cyrillic"

const label = (lang: Lang, l: string, c: string) => (lang === "latin" ? l : c)

export function QiblaCompass({ lang }: { lang: Lang }) {
  const [qiblaAngle, setQiblaAngle] = useState<number>(252)
  const [deviceAngle, setDeviceAngle] = useState<number | null>(null)
  const [hasCompassSupport, setHasCompassSupport] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [isCalibrating, setIsCalibrating] = useState(false)

  useEffect(() => {
    const angle = calculateQiblaFromNavoiy()
    setQiblaAngle(Math.round(angle))
  }, [])

  const requestCompassPermission = useCallback(async () => {
    // @ts-ignore - DeviceOrientationEvent for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && 
        // @ts-ignore
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission()
        if (permission === 'granted') {
          setPermissionGranted(true)
          setHasCompassSupport(true)
        }
      } catch (error) {
        console.error('Compass permission denied:', error)
      }
    } else {
      // Non-iOS 13+ devices
      setHasCompassSupport(true)
      setPermissionGranted(true)
    }
  }, [])

  useEffect(() => {
    if (!permissionGranted) return

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Alpha is the rotation around z-axis (compass direction)
        setDeviceAngle(Math.round(360 - event.alpha))
      }
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation)
    window.addEventListener('deviceorientation', handleOrientation)
    
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [permissionGranted])

  // Calculate relative angle to Qibla
  const relativeAngle = deviceAngle !== null 
    ? ((qiblaAngle - deviceAngle) % 360 + 360) % 360 
    : null

  // Check if pointing to Qibla (within 10 degrees)
  const isPointingToQibla = relativeAngle !== null && (relativeAngle < 10 || relativeAngle > 350)

  const getDirectionName = (angle: number): string => {
    if (angle >= 337.5 || angle < 22.5) return label(lang, "Шимол", "Shimol")
    if (angle >= 22.5 && angle < 67.5) return label(lang, "Шимол-Шарқ", "Shimol-Sharq")
    if (angle >= 67.5 && angle < 112.5) return label(lang, "Шарқ", "Sharq")
    if (angle >= 112.5 && angle < 157.5) return label(lang, "Жануб-Шарқ", "Janub-Sharq")
    if (angle >= 157.5 && angle < 202.5) return label(lang, "Жануб", "Janub")
    if (angle >= 202.5 && angle < 247.5) return label(lang, "Жануб-Ғарб", "Janub-G'arb")
    if (angle >= 247.5 && angle < 292.5) return label(lang, "Ғарб", "G'arb")
    if (angle >= 292.5 && angle < 337.5) return label(lang, "Шимол-Ғарб", "Shimol-G'arb")
    return ""
  }

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-emerald-deep via-sapphire to-emerald-deep overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 rub-el-hizb-pattern opacity-20 animate-pulse" aria-hidden="true" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center gap-3 mb-4 justify-center">
            <Moon className="w-8 h-8 text-yellow-400" aria-hidden="true" />
            <span className="text-yellow-400/80 text-xs font-semibold uppercase tracking-widest">
              {label(lang, "Қибла компаси", "Qibla kompasi")}
            </span>
          </div>
          <h2 className="font-serif text-white text-3xl sm:text-4xl font-bold mb-3">
            {label(lang, "Қиблага томон", "Qiblaga tomon")}
          </h2>
          <p className="text-white/60 text-sm max-w-md mx-auto">
            {label(
              lang,
              "Навоий шаҳридан Макка шаҳри томон йўналиш",
              "Navoiy shahridan Makka shahri tomon yo'nalish"
            )}
          </p>
        </div>

        {/* Main Compass Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 lg:p-12 shadow-2xl">
          <div className="flex flex-col items-center gap-8">
            {/* Qibla Angle Display */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-3 mb-4">
                <Navigation className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                <span className="text-white font-mono text-2xl font-bold">{qiblaAngle}°</span>
              </div>
              <p className="text-white/70 text-sm">
                {getDirectionName(qiblaAngle)}
              </p>
            </div>

            {/* Compass Visualization */}
            <div className="relative w-72 h-72 lg:w-96 lg:h-96">
              {/* Outer ring with glow */}
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400/30 shadow-[0_0_60px_rgba(250,204,21,0.3)]" />
              
              {/* Rotating compass dial */}
              <div
                className="absolute inset-4 rounded-full border-2 border-white/30 transition-transform duration-300"
                style={{ transform: `rotate(${deviceAngle ?? 0}deg)` }}
              >
                {/* Cardinal directions */}
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-white font-bold text-lg">N</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white font-bold text-lg">S</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold text-lg">W</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-bold text-lg">E</span>
                
                {/* Degree markers */}
                {[...Array(36)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-px bg-white",
                      i % 9 === 0 ? "h-4" : "h-2",
                      i % 9 === 0 ? "opacity-60" : "opacity-30"
                    )}
                    style={{
                      top: '8px',
                      left: '50%',
                      transformOrigin: `0 ${136}px`,
                      transform: `translateX(-50%) rotate(${i * 10}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Fixed Qibla indicator */}
              <div
                className="absolute inset-0 transition-transform duration-500"
                style={{ transform: `rotate(${relativeAngle ?? qiblaAngle}deg)` }}
              >
                <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full transition-all duration-300",
                    isPointingToQibla 
                      ? "bg-yellow-400 animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.8)]" 
                      : "bg-yellow-400/50"
                  )} />
                  <div className="w-1 h-32 bg-gradient-to-b from-yellow-400 to-transparent opacity-60" />
                  <Navigation className={cn(
                    "w-12 h-12 transition-all duration-300",
                    isPointingToQibla ? "text-yellow-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "text-yellow-400/60"
                  )} />
                </div>
              </div>

              {/* Center decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent flex items-center justify-center">
                    <Navigation className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Accuracy indicator */}
              {isPointingToQibla && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full rounded-full border-4 border-yellow-400/50 animate-ping" />
                </div>
              )}
            </div>

            {/* Information */}
            <div className="text-center space-y-4 w-full max-w-md">
              <div className="flex items-center justify-center gap-4 text-white/80">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{qiblaAngle}°</p>
                  <p className="text-xs text-white/60">
                    {label(lang, "Қибла", "Qibla")}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                {deviceAngle !== null ? (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{deviceAngle}°</p>
                    <p className="text-xs text-white/60">
                      {label(lang, "Жорий", "Joriy")}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">—</p>
                    <p className="text-xs text-white/60">
                      {label(lang, "Компас ўчиқ", "Kompas o'chiq")}
                    </p>
                  </div>
                )}
              </div>

              {!hasCompassSupport || !permissionGranted ? (
                <button
                  onClick={requestCompassPermission}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-emerald-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Compass className="w-5 h-5" aria-hidden="true" />
                  {label(lang, "Компасни ёқиш", "Kompasni yoqish")}
                </button>
              ) : (
                <div className="space-y-2">
                  {isPointingToQibla ? (
                    <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-300 px-6 py-3 rounded-full">
                      <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-semibold">
                        {label(
                          lang,
                          "✅ Сиз Қибла томонга қарадингиз!",
                          "✅ Siz Qibla tomonga qaradingiz!"
                        )}
                      </span>
                    </div>
                  ) : (
                    <p className="text-white/60 text-sm">
                      {label(
                        lang,
                        "Телефонни Қибла томонга буринг",
                        "Telefonni Qibla tomonga buring"
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Calibration button */}
              {deviceAngle !== null && (
                <button
                  onClick={() => {
                    setIsCalibrating(true)
                    setTimeout(() => setIsCalibrating(false), 2000)
                  }}
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  <RotateCcw className={cn("w-4 h-4", isCalibrating && "animate-spin")} aria-hidden="true" />
                  {label(lang, "Калибровка", "Kalibrovka")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-white/40 text-xs mt-6 max-w-md mx-auto">
          {label(
            lang,
            "Эслатма: Аниқ йўналиш учун телефонни текис юзада ушланг ва калибровка қилинг.",
            "Eslatma: Aniq yo'nalish uchun telefonni tekis yuzada ushlang va kalibrovka qiling."
          )}
        </p>
      </div>
    </section>
  )
}
