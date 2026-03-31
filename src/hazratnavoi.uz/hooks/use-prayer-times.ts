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
        setPrayerTimes(data?.[0] || null)
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
