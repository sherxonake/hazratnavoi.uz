"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, Loader2 } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Простая проверка (в production лучше использовать Supabase Auth)
      if (username === 'admin' && password === 'xazrat123') {
        // Устанавливаем куку
        document.cookie = `admin-auth=${btoa(`${username}:${password}`)}; path=/; max-age=${60 * 60 * 24 * 7}`

        // Перезагружаем страницу для применения middleware
        window.location.href = '/admin'
      } else {
        setError('❌ Логин ёки парол нотўғри!')
      }
    } catch (err) {
      setError('❌ Хатолик юз берди!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 flex items-center justify-center p-4">
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            HazratNavoi Admin
          </h1>
          <p className="text-emerald-100">
            Тизимга кириш
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Логин */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Логин
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Парол */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Парол
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Хатолик */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Тугма */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Кириш...' : 'Кириш'}
            </button>
          </form>

          {/* Қайтиш */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
            >
              ← Сайтга қайтиш
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-emerald-100/60 text-sm mt-6">
          © 2026 Hazratnavoi.uz — Барча ҳуқуқлар ҳимояланган
        </p>
      </div>
    </div>
  )
}
