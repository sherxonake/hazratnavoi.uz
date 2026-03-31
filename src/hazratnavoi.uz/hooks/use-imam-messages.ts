"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from '@/lib/supabase/types'

type ImamMessage = Database['public']['Tables']['imam_messages']['Row']

export function useImamMessages() {
  const [messages, setMessages] = useState<ImamMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const { data, error } = await supabase
          .from('imam_messages')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) throw error
        setMessages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Хатолик юз берди')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  return { messages, loading, error }
}
