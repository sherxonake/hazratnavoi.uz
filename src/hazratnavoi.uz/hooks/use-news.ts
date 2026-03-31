'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type News = Database['public']['Tables']['news']['Row']

export function useNews() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setNews(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Хатолик юз берди')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  return { news, loading, error }
}
