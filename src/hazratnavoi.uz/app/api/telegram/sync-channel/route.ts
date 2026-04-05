import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function parsePrayerPost(text: string) {
  const dateMatch = text.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!dateMatch) return null

  const [, dd, mm, yyyy] = dateMatch
  const date = `${yyyy}-${mm}-${dd}`

  const timeRe = (name: string) =>
    new RegExp(`${name}[^\\d]*(\\d{1,2}:\\d{2})`)

  const cityNames = ['Бомдод', 'Куёш', 'Пешин', 'Аср', 'Шом', 'Хуфтон']
  const cityKeys = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

  const splitIdx = text.indexOf('масжидларда жамоат')
  const cityText = splitIdx !== -1 ? text.slice(0, splitIdx) : text
  const mosqueText = splitIdx !== -1 ? text.slice(splitIdx) : ''

  const cityTimes: Record<string, string> = {}
  for (let i = 0; i < cityNames.length; i++) {
    const m = cityText.match(timeRe(cityNames[i]))
    if (m) cityTimes[cityKeys[i]] = m[1]
  }

  if (!cityTimes.fajr) return null

  const mosqueKeys = ['mosque_fajr', 'mosque_dhuhr', 'mosque_asr', 'mosque_maghrib', 'mosque_isha']
  const mosqueNames = ['Бомдод', 'Пешин', 'Аср', 'Шом', 'Хуфтон']
  const mosqueTimes: Record<string, string | null> = {}
  for (let i = 0; i < mosqueNames.length; i++) {
    const m = mosqueText.match(timeRe(mosqueNames[i]))
    mosqueTimes[mosqueKeys[i]] = m ? m[1] : null
  }

  return { date, ...cityTimes, ...mosqueTimes }
}

export async function GET() {
  try {
    // Scrape the public Telegram channel HTML (no auth needed)
    const res = await fetch('https://t.me/s/hazratnavoi_uz', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Channel fetch failed', status: res.status }, { status: 502 })
    }

    const html = await res.text()

    // Extract text content from message divs
    // Telegram wraps post text in <div class="tgme_widget_message_text ...">
    const textBlocks: string[] = []
    const msgRe = /<div[^>]+class="[^"]*tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/g
    let match: RegExpExecArray | null
    while ((match = msgRe.exec(html)) !== null) {
      // Strip HTML tags and decode entities
      const raw = match[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      textBlocks.push(raw.trim())
    }

    let savedPrayer = 0
    let savedNews = 0

    for (const text of textBlocks) {
      if (text.includes('намоз кириш вақтлари')) {
        const parsed = parsePrayerPost(text)
        if (parsed) {
          const { error } = await supabase
            .from('prayer_times')
            .upsert(parsed, { onConflict: 'date' })
          if (!error) savedPrayer++
        }
      }
    }

    return NextResponse.json({
      ok: true,
      postsFound: textBlocks.length,
      prayerTimesSaved: savedPrayer,
      newsSaved: savedNews,
    })
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
