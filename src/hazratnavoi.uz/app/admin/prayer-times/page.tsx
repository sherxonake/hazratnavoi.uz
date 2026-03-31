"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Clock, Calendar } from "lucide-react"
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
  jamaat_fajr?: string
  jamaat_dhuhr?: string
  jamaat_asr?: string
  jamaat_maghrib?: string
  jamaat_isha?: string
}

export default function AdminPrayerTimesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([])
  
  const today = new Date().toISOString().split('T')[0]
  
  // Намоз вақтлари (шаҳар)
  const [formData, setFormData] = useState<PrayerTime>({
    date: today,
    fajr: '',
    sunrise: '',
    dhuhr: '',
    asr: '',
    maghrib: '',
    isha: ''
  })
  
  // Жамоат намози вақтлари (масжид)
  const [jamaatData, setJamaatData] = useState({
    fajr: '',
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
        jamaat_fajr: jamaatData.fajr ? jamaatData.fajr + ':00' : null,
        jamaat_dhuhr: jamaatData.dhuhr ? jamaatData.dhuhr + ':00' : null,
        jamaat_asr: jamaatData.asr ? jamaatData.asr + ':00' : null,
        jamaat_maghrib: jamaatData.maghrib ? jamaatData.maghrib + ':00' : null,
        jamaat_isha: jamaatData.isha ? jamaatData.isha + ':00' : null,
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
          Навоий шаҳри ва Алишер Навоий масжиди учун
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

      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Дата */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Сана
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Шаҳар вақтлари */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏙</span>
              Навоий шаҳрида намоз кириш вақтлари:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Бомдод (Fajr)</label>
                <input
                  type="time"
                  value={formData.fajr}
                  onChange={(e) => handleInputChange('fajr', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Қуёш (Sunrise)</label>
                <input
                  type="time"
                  value={formData.sunrise}
                  onChange={(e) => handleInputChange('sunrise', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Пешин (Dhuhr)</label>
                <input
                  type="time"
                  value={formData.dhuhr}
                  onChange={(e) => handleInputChange('dhuhr', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Аср (Asr)</label>
                <input
                  type="time"
                  value={formData.asr}
                  onChange={(e) => handleInputChange('asr', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Шом (Maghrib)</label>
                <input
                  type="time"
                  value={formData.maghrib}
                  onChange={(e) => handleInputChange('maghrib', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Хуфтон (Isha)</label>
                <input
                  type="time"
                  value={formData.isha}
                  onChange={(e) => handleInputChange('isha', e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Жамоат вақтлари */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-4 flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              Алишер Навоий масжидида жамоат вақтлари:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Бомдод</label>
                <input
                  type="time"
                  value={jamaatData.fajr}
                  onChange={(e) => setJamaatData(prev => ({ ...prev, fajr: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Пешин</label>
                <input
                  type="time"
                  value={jamaatData.dhuhr}
                  onChange={(e) => setJamaatData(prev => ({ ...prev, dhuhr: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Аср</label>
                <input
                  type="time"
                  value={jamaatData.asr}
                  onChange={(e) => setJamaatData(prev => ({ ...prev, asr: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Шом</label>
                <input
                  type="time"
                  value={jamaatData.maghrib}
                  onChange={(e) => setJamaatData(prev => ({ ...prev, maghrib: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Хуфтон</label>
                <input
                  type="time"
                  value={jamaatData.isha}
                  onChange={(e) => setJamaatData(prev => ({ ...prev, isha: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Тугма */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold px-8 py-4 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            {loading && <Loader2 className="w-6 h-6 animate-spin" />}
            {loading ? 'Сақланмоқда...' : '💾 Сақлаш'}
          </button>
        </form>
      </div>

      {/* Рўйхат */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-emerald-600" />
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
                className="border border-gray-200 rounded-xl p-5 hover:border-emerald-300 transition-colors"
              >
                <p className="font-bold text-gray-800 mb-4 text-lg">
                  {new Date(pt.date).toLocaleDateString('uz-UZ', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                
                {/* Шаҳар вақтлари */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                    <span>🏙</span> Навоий шаҳри:
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Бомдод</p>
                      <p className="font-semibold text-gray-800">{pt.fajr.substring(0, 5)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Қуёш</p>
                      <p className="font-semibold text-gray-800">{pt.sunrise.substring(0, 5)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Пешин</p>
                      <p className="font-semibold text-gray-800">{pt.dhuhr.substring(0, 5)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Аср</p>
                      <p className="font-semibold text-gray-800">{pt.asr.substring(0, 5)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Шом</p>
                      <p className="font-semibold text-gray-800">{pt.maghrib.substring(0, 5)}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Хуфтон</p>
                      <p className="font-semibold text-gray-800">{pt.isha.substring(0, 5)}</p>
                    </div>
                  </div>
                </div>

                {/* Жамоат вақтлари */}
                {(pt.jamaat_fajr || pt.jamaat_dhuhr || pt.jamaat_asr || pt.jamaat_maghrib || pt.jamaat_isha) && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <span>⏰</span> Масжид жамоати:
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {pt.jamaat_fajr && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Бомдод</p>
                          <p className="font-bold text-emerald-800">{pt.jamaat_fajr.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.jamaat_dhuhr && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Пешин</p>
                          <p className="font-bold text-emerald-800">{pt.jamaat_dhuhr.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.jamaat_asr && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Аср</p>
                          <p className="font-bold text-emerald-800">{pt.jamaat_asr.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.jamaat_maghrib && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Шом</p>
                          <p className="font-bold text-emerald-800">{pt.jamaat_maghrib.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.jamaat_isha && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Хуфтон</p>
                          <p className="font-bold text-emerald-800">{pt.jamaat_isha.substring(0, 5)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
