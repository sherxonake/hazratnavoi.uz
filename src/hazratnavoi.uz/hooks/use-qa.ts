'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type QAPair = Database['public']['Tables']['qa_pairs']['Row']

export function useQA() {
  const [qaPairs, setQAPairs] = useState<QAPair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQA() {
      try {
        const { data, error } = await supabase
          .from('qa_pairs')
          .select('*')
          .eq('published', true)
          .order('order', { ascending: true })

        if (error) throw error
        setQAPairs(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Хатолик юз берди')
      } finally {
        setLoading(false)
      }
    }

    fetchQA()
  }, [])

  return { qaPairs, loading, error }
}
