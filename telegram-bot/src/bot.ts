import TelegramBot from 'node-telegram-bot-api'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID!
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!TOKEN || !ADMIN_CHAT_ID || !SUPABASE_KEY) {
  console.error('❌ Барча переменные тўлдирилмаган! .env файлини текширинг.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const bot = new TelegramBot(TOKEN, { polling: true })

console.log('✅ Бот ишга тушди...')

// Маълумотлар сақлаш
const tempData: {
  [key: number]: {
    step: string
    title?: string
    content?: string
    photoId?: string
  }
} = {}

// /start команда
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  
  if (String(chatId) !== ADMIN_CHAT_ID) {
    bot.sendMessage(chatId, '❌ Сизга рухсат берилмаган!')
    return
  }
  
  bot.sendMessage(
    chatId,
    `
🕌 *HazratNavoi Admin Bot*

Ассаламу алайкум, Ҳаёт ака!

*Мавжуд команда лар:*
/news - Янгилик қўшиш
/prayer - Намоз вақтларини янгилаш
/qa - Савол-жавоб қўшиш
/help - Ёрдам

*Бот ҳолати:* 🟢 Ишламоқда
    `,
    { parse_mode: 'Markdown' }
  )
})

// /help команда
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  
  if (String(chatId) !== ADMIN_CHAT_ID) {
    return
  }
  
  bot.sendMessage(
    chatId,
    `
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
    `,
    { parse_mode: 'Markdown' }
  )
})

// /news команда
bot.onText(/\/news/, (msg) => {
  const chatId = msg.chat.id
  
  if (String(chatId) !== ADMIN_CHAT_ID) {
    return
  }
  
  tempData[chatId] = { step: 'waiting_title' }
  
  bot.sendMessage(
    chatId,
    '📰 *Янгилик қўшиш*\n\nСарлавҳа ёзинг:',
    { parse_mode: 'Markdown' }
  )
})

// Матн хабарларни қабул қилиш
bot.on('message', async (msg) => {
  const chatId = msg.chat.id
  const text = msg.text
  
  if (String(chatId) !== ADMIN_CHAT_ID || !text) {
    return
  }
  
  const userData = tempData[chatId]
  if (!userData) return
  
  // Сарлавҳа кутиш
  if (userData.step === 'waiting_title') {
    userData.title = text
    userData.step = 'waiting_content'
    
    bot.sendMessage(
      chatId,
      '✅ Сарлавҳа қабул қилинди!\n\nЭнди матн ёзинг:'
    )
    return
  }
  
  // Матн кутиш
  if (userData.step === 'waiting_content') {
    userData.content = text
    userData.step = 'waiting_photo'
    
    bot.sendMessage(
      chatId,
      '✅ Матн қабул қилинди!\n\nРасм юборинг (ёки /skip босиб ўтказиб юборинг):'
    )
    return
  }
  
  // Расмдан кейин
  if (userData.step === 'waiting_photo') {
    if (text === '/skip') {
      await saveNews(chatId, userData, null)
    } else {
      bot.sendMessage(chatId, '❌ Илтимос, расм юборинг ёки /skip босинг')
    }
    return
  }
})

// Расм қабул қилиш
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id
  
  if (String(chatId) !== ADMIN_CHAT_ID) {
    return
  }
  
  const userData = tempData[chatId]
  if (!userData || userData.step !== 'waiting_photo') return
  
  const photoId = msg.photo[msg.photo.length - 1].file_id
  await saveNews(chatId, userData, photoId)
})

// Янгиликни сақлаш
async function saveNews(
  chatId: number,
  data: { title?: string; content?: string },
  photoId: string | null
) {
  try {
    let imageUrl = null
    
    // Расмни юклаш
    if (photoId) {
      const fileLink = await bot.getFileLink(photoId)
      imageUrl = fileLink.toString()
    }
    
    // Supabase'га сақлаш
    const { error } = await supabase.from('news').insert({
      title: data.title!,
      content: data.content!,
      image_url: imageUrl,
      published: true,
    })
    
    if (error) throw error
    
    bot.sendMessage(
      chatId,
      '✅ *Янгилик муваффақиятли қўшилди!*\n\nСайтда кўриниши учун 1-2 дақиқа кутиң.',
      { parse_mode: 'Markdown' }
    )
    
    // Маълумотни тозалаш
    delete tempData[chatId]
  } catch (error) {
    console.error(error)
    bot.sendMessage(
      chatId,
      '❌ *Хатолик юз берди!*\n\nИлтимос, қайта урининг.'
    )
  }
}

// /prayer команда
bot.onText(/\/prayer/, (msg) => {
  const chatId = msg.chat.id
  
  if (String(chatId) !== ADMIN_CHAT_ID) {
    return
  }
  
  bot.sendMessage(
    chatId,
    `
🕌 *Намоз вақтларини янгилаш*

Қуйидаги форматда юборинг:

/bomdod 05:00
/peshin 12:45
/asr 16:15
/shom 18:45
/xafton 20:15

Ёки барчасини бирга:
05:00,12:45,16:15,18:45,20:15
    `,
    { parse_mode: 'Markdown' }
  )
})

// /qa команда
bot.onText(/\/qa/, (msg) => {
  const chatId = msg.chat.id
  
  if (String(chatId) !== ADMIN_CHAT_ID) {
    return
  }
  
  tempData[chatId] = { step: 'waiting_question' }
  
  bot.sendMessage(
    chatId,
    '❓ *Савол-жавоб қўшиш*\n\nСавол ёзинг:',
    { parse_mode: 'Markdown' }
  )
})

// Ботни ишга тушириш
console.log('🤖 Бот ишга тушди...')
console.log('📍 Админ Chat ID:', ADMIN_CHAT_ID)
