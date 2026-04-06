"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Clock, Calendar, Sparkles, ClipboardPaste, ChevronDown, ChevronUp } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface PrayerTime {
  id?: string
  date: string
  fajr: string
  sunrise: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
  mosque_fajr?: string
  mosque_dhuhr?: string
  mosque_asr?: string
  mosque_maghrib?: string
  mosque_isha?: string
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
      const { data, error } = await supabase
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
      const payload = {
        date: formData.date,
        fajr:    formData.fajr    + ':00',
        sunrise: formData.sunrise + ':00',
        dhuhr:   formData.dhuhr   + ':00',
        asr:     formData.asr     + ':00',
        maghrib: formData.maghrib + ':00',
        isha:    formData.isha    + ':00',
        mosque_fajr:    jamaatData.fajr    ? jamaatData.fajr    + ':00' : null,
        mosque_dhuhr:   jamaatData.dhuhr   ? jamaatData.dhuhr   + ':00' : null,
        mosque_asr:     jamaatData.asr     ? jamaatData.asr     + ':00' : null,
        mosque_maghrib: jamaatData.maghrib ? jamaatData.maghrib + ':00' : null,
        mosque_isha:    jamaatData.isha    ? jamaatData.isha    + ':00' : null,
      }

      const res  = await fetch('/api/admin/prayer-times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`)

      setMessage({ type: 'success', text: '✅ Намоз вақтлари муваффақиятли янгиланди!' })
      loadPrayerTimes()

    } catch (error: unknown) {
      const e = error as { message?: string; code?: string; details?: string }
      const msg = e?.message || e?.details || e?.code || JSON.stringify(error)
      console.error('Save error detail:', msg)
      setMessage({ type: 'error', text: `❌ Хатолик: ${msg}` })
    } finally {
      setLoading(false)
    }
  }

  const [smartText, setSmartText] = useState("")
  const [smartOpen, setSmartOpen] = useState(false)
  const [smartMsg, setSmartMsg]   = useState<string | null>(null)

  function parseAndFill() {
    const text = smartText
    if (!text.trim()) return

    // Extract date: DD.MM.YYYY
    const dateMatch = text.match(/(\d{2})\.(\d{2})\.(\d{4})/)
    const date = dateMatch
      ? `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`
      : today

    // Find time after keyword within 60 chars
    function findTime(src: string, keywords: string[]): string {
      for (const kw of keywords) {
        const re = new RegExp(kw + '[^\\d]{0,30}?(\\d{1,2}:\\d{2})', 'i')
        const m = src.match(re)
        if (m) {
          const [h, min] = m[1].split(':')
          return `${h.padStart(2, '0')}:${min}`
        }
      }
      return ''
    }

    // Split city vs. congregation section
    const splitIdx = text.search(/жамоат/i)
    const cityPart   = splitIdx >= 0 ? text.slice(0, splitIdx) : text
    const jamaatPart = splitIdx >= 0 ? text.slice(splitIdx)    : ''

    const fajr    = findTime(cityPart, ['Бомдод', 'бомдод', 'Fajr'])
    const sunrise = findTime(cityPart, ['Қуёш', 'Куёш', 'қуёш', 'куёш'])
    const dhuhr   = findTime(cityPart, ['Пешин', 'пешин', 'Dhuhr'])
    const asr     = findTime(cityPart, ['Аср', 'аср', 'Asr'])
    const maghrib = findTime(cityPart, ['Шом', 'шом', 'Maghrib'])
    const isha    = findTime(cityPart, ['Хуфтон', 'хуфтон', 'Isha'])

    const jFajr    = findTime(jamaatPart, ['Бомдод', 'бомдод'])
    const jDhuhr   = findTime(jamaatPart, ['Пешин', 'пешин'])
    const jAsr     = findTime(jamaatPart, ['Аср', 'аср'])
    const jMaghrib = findTime(jamaatPart, ['Шом', 'шом'])
    const jIsha    = findTime(jamaatPart, ['Хуфтон', 'хуфтон'])

    const found = [fajr, sunrise, dhuhr, asr, maghrib, isha].filter(Boolean).length
    if (found === 0) {
      setSmartMsg('❌ Ҳеч нарса топилмади — матнни текширинг')
      return
    }

    setFormData({ date, fajr, sunrise, dhuhr, asr, maghrib, isha })
    setJamaatData({ fajr: jFajr, dhuhr: jDhuhr, asr: jAsr, maghrib: jMaghrib, isha: jIsha })
    setSmartMsg(`✅ ${found} та вақт аниқланди — текшириб сақланг`)
    setSmartOpen(false)
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

      {/* ── Smart Paste ── */}
      <div className="mb-6 rounded-xl border-2 border-emerald-400 bg-emerald-50 overflow-hidden shadow-md text-gray-900">
        <button
          type="button"
          onClick={() => { setSmartOpen(v => !v); setSmartMsg(null) }}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-emerald-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪄</span>
            <div className="text-left">
              <p className="font-bold text-emerald-800 text-base">Матндан автоматик тўлдириш</p>
              <p className="text-emerald-600 text-xs">Телеграм матнини ёпиштиринг — ўзи тушунади</p>
            </div>
          </div>
          {smartOpen
            ? <ChevronUp className="w-5 h-5 text-emerald-700" />
            : <ChevronDown className="w-5 h-5 text-emerald-700" />
          }
        </button>

        {smartOpen && (
          <div className="px-6 pb-5 border-t border-emerald-200">
            <p className="text-emerald-700 text-sm mt-4 mb-2 font-medium">
              Телеграмдан кўчириб олган матнни ёпиштиринг:
            </p>
            <textarea
              value={smartText}
              onChange={e => { setSmartText(e.target.value); setSmartMsg(null) }}
              placeholder={`Масалан:\n06.04.2026 йил Навоийда намоз вақтлари:\nБомдод - 04:55\nҚуёш - 06:15\nПешин - 12:41\nАср - 17:14\nШом - 19:12\nХуфтон - 20:24\n\nЖамоат:\nБомдод - 05:40\nПешин - 13:00 ...`}
              rows={8}
              className="w-full px-4 py-3 border border-emerald-300 rounded-xl text-sm font-mono
                focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white resize-none"
            />
            <button
              type="button"
              onClick={parseAndFill}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600
                hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors text-base shadow"
            >
              <Sparkles className="w-5 h-5" />
              Тушуниб, тўлдириш
            </button>
          </div>
        )}

        {smartMsg && (
          <div className={`px-6 py-3 text-sm font-medium border-t ${
            smartMsg.startsWith('✅')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {smartMsg}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-gray-900">
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
                {(pt.mosque_fajr || pt.mosque_dhuhr || pt.mosque_asr || pt.mosque_maghrib || pt.mosque_isha) && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                      <span>⏰</span> Масжид жамоати:
                    </h4>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                      {pt.mosque_fajr && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Бомдод</p>
                          <p className="font-bold text-emerald-800">{pt.mosque_fajr.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.mosque_dhuhr && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Пешин</p>
                          <p className="font-bold text-emerald-800">{pt.mosque_dhuhr.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.mosque_asr && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Аср</p>
                          <p className="font-bold text-emerald-800">{pt.mosque_asr.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.mosque_maghrib && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Шом</p>
                          <p className="font-bold text-emerald-800">{pt.mosque_maghrib.substring(0, 5)}</p>
                        </div>
                      )}
                      {pt.mosque_isha && (
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-xs text-emerald-600">Хуфтон</p>
                          <p className="font-bold text-emerald-800">{pt.mosque_isha.substring(0, 5)}</p>
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
