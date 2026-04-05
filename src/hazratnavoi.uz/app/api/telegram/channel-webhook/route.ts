import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Keyword filter: only news posts mentioning the imam
const NEWS_KEYWORD = 'Темурхон домла Атоев'

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const post = body.channel_post
    if (!post) return NextResponse.json({ ok: true })

    const text: string | undefined = post.text || post.caption
    const photo = post.photo as { file_id: string; width: number }[] | undefined
    const mediaGroupId: string | undefined = post.media_group_id

    // 1. Prayer time posts
    if (text && text.includes('намоз кириш вақтлари')) {
      const parsed = parsePrayerPost(text)
      if (parsed) {
        const { error } = await supabase
          .from('prayer_times')
          .upsert(parsed, { onConflict: 'date' })
        if (error) console.error('Prayer times error:', error)
      }
      return NextResponse.json({ ok: true })
    }

    // 2. News posts — only if caption contains the imam keyword
    if (photo && photo.length > 0) {
      // Best quality = last in array (Telegram sorts by size ascending)
      const bestPhoto = photo[photo.length - 1]

      if (text && text.includes(NEWS_KEYWORD)) {
        // This is the lead message of an album (has caption + first photo)
        const imageUrl = await getTelegramFileUrl(bestPhoto.file_id)

        const { error } = await supabase.from('news').insert({
          title: text.split('\n').find(l => l.trim().length > 5)?.slice(0, 200) ?? text.slice(0, 200),
          content: text,
          image_url: imageUrl,
          telegram_group_id: mediaGroupId ?? null,
          published: true,
        })

        if (error) console.error('News insert error:', error)
        else console.log('News saved:', text.slice(0, 60))

      } else if (mediaGroupId && !text) {
        // Subsequent photo in an album (no caption) — add as image_url_2 if we have the group
        const { data: existing } = await supabase
          .from('news')
          .select('id, image_url_2')
          .eq('telegram_group_id', mediaGroupId)
          .single()

        if (existing && !existing.image_url_2) {
          const imageUrl2 = await getTelegramFileUrl(bestPhoto.file_id)
          await supabase
            .from('news')
            .update({ image_url_2: imageUrl2 })
            .eq('id', existing.id)
          console.log('Added 2nd photo to news', existing.id)
        }
        // 3rd+ photos are ignored
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

async function getTelegramFileUrl(fileId: string): Promise<string | null> {
  const token = process.env.TELEGRAM_CHANNEL_BOT_TOKEN
  if (!token) return null
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`)
    const data = await res.json()
    if (data.ok) {
      return `https://api.telegram.org/file/bot${token}/${data.result.file_path}`
    }
  } catch {}
  return null
}
