'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type PrayerTime = Database['public']['Tables']['prayer_times']['Row']

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrayerTimes() {
      try {
        const today = new Date().toISOString().split('T')[0]
        
        const { data, error } = await supabase
          .from('prayer_times')
          .select('*')
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(1)

        if (error) throw error
        const row = data?.[0]
        if (row) {
          // Strip seconds from HH:MM:SS → HH:MM
          const trim = (t: string | null) => t?.slice(0, 5) ?? null
          setPrayerTimes({
            ...row,
            fajr: trim(row.fajr)!,
            sunrise: trim(row.sunrise)!,
            dhuhr: trim(row.dhuhr)!,
            asr: trim(row.asr)!,
            maghrib: trim(row.maghrib)!,
            isha: trim(row.isha)!,
            mosque_fajr: trim(row.mosque_fajr),
            mosque_dhuhr: trim(row.mosque_dhuhr),
            mosque_asr: trim(row.mosque_asr),
            mosque_maghrib: trim(row.mosque_maghrib),
            mosque_isha: trim(row.mosque_isha),
          })
        } else {
          setPrayerTimes(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Хатолик юз берди')
      } finally {
        setLoading(false)
      }
    }

    fetchPrayerTimes()
  }, [])

  return { prayerTimes, loading, error }
}
