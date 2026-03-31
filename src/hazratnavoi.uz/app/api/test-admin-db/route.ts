import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Проверяем подключение с service role ключом
    const { data: newsData, error: newsError } = await supabaseAdmin
      .from('news')
      .select('*')
      .limit(5)

    const { data: prayerData, error: prayerError } = await supabaseAdmin
      .from('prayer_times')
      .select('*')
      .order('date', { ascending: false })
      .limit(1)

    const { data: qaData, error: qaError } = await supabaseAdmin
      .from('qa_pairs')
      .select('*')
      .eq('published', true)
      .order('order_num', { ascending: true })
      .limit(5)

    if (newsError) throw new Error(`News: ${newsError.message}`)
    if (prayerError) throw new Error(`Prayer: ${prayerError.message}`)
    if (qaError) throw new Error(`QA: ${qaError.message}`)

    return NextResponse.json(
      {
        status: 'success',
        message: 'Supabase admin connection successful',
        details: {
          news: { count: newsData?.length || 0, latest: newsData?.[0]?.title || null },
          prayer_times: { count: prayerData?.length || 0, date: prayerData?.[0]?.date || null },
          qa_pairs: { count: qaData?.length || 0 },
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: 'Admin connection failed'
      },
      { status: 500 }
    )
  }
}
