import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  try {
    // Проверяем подключение к Supabase
    const { data, error } = await supabase.from('news').select('id').limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          message: error.message,
          details: 'Database connection failed'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        status: 'success',
        message: 'Supabase connected successfully',
        details: {
          news_count: data?.length || 0,
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
        details: 'Server error'
      },
      { status: 500 }
    )
  }
}
