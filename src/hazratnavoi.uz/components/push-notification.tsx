"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff, X, Smartphone } from "lucide-react"

export function PushNotification() {
  const [state, setState] = useState<"idle" | "subscribed" | "denied" | "unsupported">("idle")
  const [loading, setLoading] = useState(false)
  const [showIosHint, setShowIosHint] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported")
      return
    }
    if (Notification.permission === "denied") {
      setState("denied")
      return
    }
    // Check existing subscription
    navigator.serviceWorker.ready.then(reg =>
      reg.pushManager.getSubscription().then(sub => {
        if (sub) setState("subscribed")
      })
    )
  }, [])

  // iOS detection
  const isIOS = typeof navigator !== "undefined"
    && /iPad|iPhone|iPod/.test(navigator.userAgent)
  const isStandalone = typeof window !== "undefined"
    && window.matchMedia("(display-mode: standalone)").matches

  async function subscribe() {
    if (isIOS && !isStandalone) {
      setShowIosHint(true)
      return
    }
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: sub.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(sub.getKey("p256dh")!),
            auth:   arrayBufferToBase64(sub.getKey("auth")!),
          },
          userAgent: navigator.userAgent,
        }),
      })
      setState("subscribed")
    } catch {
      if (Notification.permission === "denied") setState("denied")
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setState("idle")
    } finally {
      setLoading(false)
    }
  }

  if (state === "unsupported" || dismissed) return null

  return (
    <>
      {/* iOS hint modal */}
      {showIosHint && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-emerald-950 border border-yellow-500/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white font-bold text-base">iPhone учун созлаш</h3>
              </div>
              <button onClick={() => setShowIosHint(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p>Намоз эслатмалари учун сайтни <span className="text-yellow-300 font-semibold">иловага айлантиринг:</span></p>
              <div className="space-y-2">
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <span className="text-lg">1️⃣</span>
                  <p>Safari'да <span className="text-white font-medium">↑ Улашиш</span> тугмасини босинг</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <span className="text-lg">2️⃣</span>
                  <p><span className="text-white font-medium">"Бош экранга қўшиш"</span> ни танланг</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                  <span className="text-lg">3️⃣</span>
                  <p>Иловани очиб, <span className="text-white font-medium">рухсат беринг</span></p>
                </div>
              </div>
              <p className="text-white/40 text-xs">iOS 16.4 ва ундан юқори версия талаб қилинади</p>
            </div>
            <button
              onClick={() => setShowIosHint(false)}
              className="mt-4 w-full py-2.5 bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 rounded-xl text-sm font-medium transition-colors"
            >
              Тушундим
            </button>
          </div>
        </div>
      )}

      {/* Notification button */}
      {state === "subscribed" ? (
        <button
          onClick={unsubscribe}
          disabled={loading}
          title="Эслатмаларни ўчириш"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yellow-500/40
            bg-yellow-500/15 text-yellow-300 text-xs font-medium transition-all hover:bg-yellow-500/25"
        >
          <BellOff className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Эслатма ёқиқ</span>
        </button>
      ) : state === "denied" ? (
        <button
          onClick={() => setDismissed(true)}
          title="Браузер рухсат бермади"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15
            text-white/30 text-xs cursor-default"
        >
          <BellOff className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Блокланган</span>
        </button>
      ) : (
        <button
          onClick={subscribe}
          disabled={loading}
          title="Намоз эслатмаларини ёқиш"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20
            text-white/60 text-xs font-medium hover:border-yellow-500/40 hover:text-yellow-300
            hover:bg-yellow-500/10 transition-all"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{loading ? "..." : "Эслатма"}</span>
        </button>
      )}
    </>
  )
}

// Helpers
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw     = window.atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
