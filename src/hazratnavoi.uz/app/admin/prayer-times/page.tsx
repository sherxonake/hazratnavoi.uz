"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Clock, Calendar, MessageSquare } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/server"

interface PrayerTime {
  id?: string
  date: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export default function AdminPrayerTimesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  
  const today = new Date().toISOString().split('T')[0]
  
  // Автоматик парсер учун матн майдони
  const [telegramText, setTelegramText] = useState("")
  
  // Намоз вақтлари
  const [formData, setFormData] = useState<PrayerTime>({
    date: today,
    fajr: '',
    sunrise: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: ''
  })

  useEffect(() => {
    loadPrayerTimes()
  }, [])

  async function loadPrayerTimes() {
    try {
      const { data, error } = await supabaseAdmin
        .from('prayer_times')
        .select('*')
        .order('date', { ascending: false })
        .limit(7)

      if (error) throw error
      setPrayerTimes(data || [])
    } catch (error) {
      console.error('Error loading prayer times:', error)
    }
  }

  // Telegram текстдан намоз вақтларини автоматик ажратиш
  const parseTelegramText = () => {
    const text = telegramText
    
    // Бомдод
    const fajrMatch = text.match(/🏙\s*Бомдод\s*[-–—]?\s*(\d{1,2}:\d{2})/)
    // Қуёш
    const sunriseMatch = text.match(/🌅\s*Куёш\s*[-–—]?\s*(\d{1,2}:\d{2})/)
    // Пешин
    const dhuhrMatch = text.match(/🏞\s*Пешин\s*[-–—]?\s*(\d{1,2}:\d{2})/)
    // Аср
    const asrMatch = text.match(/🌇\s*Аср\s*[-–—]?\s*(\d{1,2}:\d{2})/)
    // Шом
    const maghribMatch = text.match(/🌆\s*Шом\s*[-–—]?\s*(\d{1,2}:\d{2})/)
    // Хуфтон
    const ishaMatch = text.match(/🌃\s*Хуфтон\s*[-–—]?\s*(\d{1,2}:\d{2})/)
    
    if (fajrMatch) setFormData(prev => ({ ...prev, fajr: fajrMatch[1] }))
    if (sunriseMatch) setFormData(prev => ({ ...prev, sunrise: sunriseMatch[1] }))
    if (dhuhrMatch) setFormData(prev => ({ ...prev, dhuhr: dhuhrMatch[1] }))
    if (asrMatch) setFormData(prev => ({ ...prev, asr: asrMatch[1] }))
    if (maghribMatch) setFormData(prev => ({ ...prev, maghrib: maghribMatch[1] }))
    if (ishaMatch) setFormData(prev => ({ ...prev, isha: ishaMatch[1] }))
    
    // Санани ҳам ажратиш
    const dateMatch = text.match(/(\d{2}\.\d{2}\.\d{4})/)
    if (dateMatch) {
      const [day, month, year] = dateMatch[1].split('.')
      const formattedDate = `${year}-${month}-${day}`
      setFormData(prev => ({ ...prev, date: formattedDate }))
    }
    
    setMessage({ type: 'success', text: '✅ Намоз вақтлари автоматик ажратилди!' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabaseAdmin.from('prayer_times').upsert({
        date: formData.date,
        fajr: formData.fajr + ':00',
        sunrise: formData.sunrise + ':00',
        dhuhr: formData.dhuhr + ':00',
        asr: formData.asr + ':00',
        maghrib: formData.maghrib + ':00',
        isha: formData.isha + ':00',
      })

      if (error) throw error

      setMessage({ type: 'success', text: '✅ Намоз вақтлари муваффақиятли янгиланди!' })
      
      loadPrayerTimes()

    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: '❌ Хатолик юз берди! Илтимос, қайта урининг.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof PrayerTime, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
          Намоз вақтлари
        </h1>
        <p className="text-gray-600">
          Навоий шаҳри учун намоз вақтларини янгилаш
        </p>
      </div>

      {/* Сообщение */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Telegram текст парсер */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            Автоматик ажратиш
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Telegram'дан келган хабарни нусхалаб, қуйидаги майдонга ташланг:
          </p>
          <textarea
            value={telegramText}
            onChange={(e) => setTelegramText(e.target.value)}
            placeholder="31.03.2026 йил, (1447 ҳижрий йил 12 Шаввол ) Сешанба Навоийда намоз кириш вақтлари:
🏙  Бомдод - 05:05
🌅  Куёш -06:24
🏞  Пешин - 12:42
🌇  Аср -17:10
🌆  Шом - 19:05
🌃  Хуфтон - 20:16..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm mb-4"
          />
          <button
            onClick={parseTelegramText}
            className="w-full bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Автоматик ажратиш
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Тизим намоз вақтларини автоматик тўлдиради
          </p>
        </div>

        {/* Форма */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            Қўлда тўлдириш
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Дата */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Сана
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Вақтлар */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бомдод (Fajr)
                </label>
                <input
                  type="time"
                  value={formData.fajr}
                  onChange={(e) => handleInputChange('fajr', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Қуёш (Sunrise)
                </label>
                <input
                  type="time"
                  value={formData.sunrise}
                  onChange={(e) => handleInputChange('sunrise', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Пешин (Dhuhr)
                </label>
                <input
                  type="time"
                  value={formData.dhuhr}
                  onChange={(e) => handleInputChange('dhuhr', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Аср (Asr)
                </label>
                <input
                  type="time"
                  value={formData.asr}
                  onChange={(e) => handleInputChange('asr', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Шом (Maghrib)
                </label>
                <input
                  type="time"
                  value={formData.maghrib}
                  onChange={(e) => handleInputChange('maghrib', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Хуфтон (Isha)
                </label>
                <input
                  type="time"
                  value={formData.isha}
                  onChange={(e) => handleInputChange('isha', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Тугма */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Сақланмоқда...' : 'Сақлаш'}
            </button>
          </form>
        </div>
      </div>

      {/* Рўйхат */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          Охирги 7 кун
        </h2>

        <div className="space-y-3">
          {prayerTimes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Ҳали маълумот йўқ
            </p>
          ) : (
            prayerTimes.map((pt) => (
              <div
                key={pt.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
              >
                <p className="font-semibold text-gray-800 mb-2">
                  {new Date(pt.date).toLocaleDateString('uz-UZ', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-gray-600">
                    <span className="text-xs text-gray-400">Бомдод:</span>
                    <br />
                    {pt.fajr.substring(0, 5)}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-xs text-gray-400">Пешин:</span>
                    <br />
                    {pt.dhuhr.substring(0, 5)}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-xs text-gray-400">Аср:</span>
                    <br />
                    {pt.asr.substring(0, 5)}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-xs text-gray-400">Шом:</span>
                    <br />
                    {pt.maghrib.substring(0, 5)}
                  </div>
                  <div className="text-gray-600">
                    <span className="text-xs text-gray-400">Хуфтон:</span>
                    <br />
                    {pt.isha.substring(0, 5)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
