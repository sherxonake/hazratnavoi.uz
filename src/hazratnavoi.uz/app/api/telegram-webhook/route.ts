import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
  console.error('❌ Telegram переменные не настроены!')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!)

// Временное хранилище для сессий
const userSessions: {
  [key: string]: {
    step: string
    title?: string
    content?: string
  }
} = {}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const update = body.update
    
    if (!update) {
      return NextResponse.json({ ok: false })
    }

    const chatId = update.message?.chat?.id
    const text = update.message?.text
    const photo = update.message?.photo
    
    // Проверка админа
    if (String(chatId) !== ADMIN_CHAT_ID) {
      await sendMessage(chatId, '❌ Сизга рухсат берилмаган!')
      return NextResponse.json({ ok: true })
    }

    // Обработка команд
    if (text?.startsWith('/')) {
      await handleCommand(chatId, text)
      return NextResponse.json({ ok: true })
    }

    // Обработка сообщений
    if (userSessions[chatId]) {
      await handleMessage(chatId, text, photo)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ ok: false })
  }
}

async function handleCommand(chatId: number, text: string) {
  const command = text.split(' ')[0]

  switch (command) {
    case '/start':
      await sendMessage(chatId, `
🕌 *HazratNavoi Admin Bot*

Ассаламу алайкум, Ҳаёт ака!

*Мавжуд команда лар:*
/news - Янгилик қўшиш
/prayer - Намоз вақтларини янгилаш
/qa - Савол-жавоб қўшиш
/help - Ёрдам

*Бот ҳолати:* 🟢 Ишламоқда (Vercel)
      `, { parse_mode: 'Markdown' })
      break

    case '/help':
      await sendMessage(chatId, `
📚 *Ёрдам*

*Янгилик қўшиш:*
1. /news командасини юборинг
2. Сарлавҳа ёзинг
3. Матн ёзинг
4. Расм юборинг (ихтиёрий)

*Намоз вақтлари:*
1. /prayer командасини юборинг
2. Вақтларни кетма-кет юборинг

*Савол-жавоб:*
1. /qa командасини юборинг
2. Савол ва жавобни юборинг
      `, { parse_mode: 'Markdown' })
      break

    case '/news':
      userSessions[chatId] = { step: 'waiting_title' }
      await sendMessage(chatId, '📰 *Янгилик қўшиш*\n\nСарлавҳа ёзинг:', { parse_mode: 'Markdown' })
      break

    case '/qa':
      userSessions[chatId] = { step: 'waiting_question' }
      await sendMessage(chatId, '❓ *Савол-жавоб қўшиш*\n\nСавол ёзинг:', { parse_mode: 'Markdown' })
      break

    case '/prayer':
      await sendMessage(chatId, `
🕌 *Намоз вақтларини янгилаш*

Қуйидаги форматда юборинг:

/bomdod 05:00
/peshin 12:45
/asr 16:15
/shom 18:45
/xafton 20:15

Ёки барчасини бирга:
05:00,12:45,16:15,18:45,20:15
      `, { parse_mode: 'Markdown' })
      break

    default:
      await sendMessage(chatId, '❌ Нотўғри команда. /help босиб кўринг.')
  }
}

async function handleMessage(chatId: number, text?: string, photo?: any[]) {
  const session = userSessions[chatId]
  if (!session) return

  // Янгилик қўшиш
  if (session.step === 'waiting_title') {
    session.title = text
    session.step = 'waiting_content'
    await sendMessage(chatId, '✅ Сарлавҳа қабул қилинди!\n\nЭнди матн ёзинг:')
    return
  }

  if (session.step === 'waiting_content') {
    session.content = text
    session.step = 'waiting_photo'
    await sendMessage(chatId, '✅ Матн қабул қилинди!\n\nРасм юборинг (ёки /skip босиб ўтказиб юборинг):')
    return
  }

  if (session.step === 'waiting_photo') {
    if (text === '/skip') {
      await saveNews(chatId, session, null)
    } else {
      await sendMessage(chatId, '❌ Илтимос, расм юборинг ёки /skip босинг')
    }
    return
  }

  // Савол-жавоб
  if (session.step === 'waiting_question') {
    session.title = text
    session.step = 'waiting_answer'
    await sendMessage(chatId, '✅ Савол қабул қилинди!\n\nЖавоб ёзинг:')
    return
  }

  if (session.step === 'waiting_answer') {
    session.content = text
    await saveQA(chatId, session)
    return
  }
}

async function saveNews(chatId: number, data: { title?: string; content?: string }, photoId: string | null) {
  try {
    let imageUrl = null

    if (photoId) {
      const fileLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${photoId}`
      imageUrl = fileLink
    }

    const { error } = await supabase.from('news').insert({
      title: data.title!,
      content: data.content!,
      image_url: imageUrl,
      published: true,
    })

    if (error) throw error

    await sendMessage(
      chatId,
      '✅ *Янгилик муваффақиятли қўшилди!*\n\nСайтда кўриниши учун 1-2 дақиқа кутиң.',
      { parse_mode: 'Markdown' }
    )

    delete userSessions[String(chatId)]
  } catch (error) {
    console.error(error)
    await sendMessage(chatId, '❌ *Хатолик юз берди!*\n\nИлтимос, қайта урининг.', { parse_mode: 'Markdown' })
  }
}

async function saveQA(chatId: number, data: { title?: string; content?: string }) {
  try {
    const { error } = await supabase.from('qa_pairs').insert({
      question: data.title!,
      answer: data.content!,
      published: true,
      order_num: 10,
    })

    if (error) throw error

    await sendMessage(
      chatId,
      '✅ *Савол-жавоб муваффақиятли қўшилди!*',
      { parse_mode: 'Markdown' }
    )

    delete userSessions[String(chatId)]
  } catch (error) {
    console.error(error)
    await sendMessage(chatId, '❌ *Хатолик юз берди!*', { parse_mode: 'Markdown' })
  }
}

async function sendMessage(chatId: number, text: string, options: any = {}) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...options,
    }),
  })
}
