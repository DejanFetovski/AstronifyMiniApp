import TelegramBot from 'node-telegram-bot-api'
import * as C from './utils/constant'
import * as database from './database/db'

import * as teleBot from './core/telegram'
import * as global from './global'

import * as TapGame from './core/tapgame'
import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

export const COMMAND_START = 'start'

export let bot: TelegramBot
export let myInfo: TelegramBot.User
export const sessions = new Map()
export const stateMap = new Map()

export let busy = true

export const stateMap_getFocus = (chatId: string) => {
  const item = stateMap.get(chatId)
  if (item) {
    let focusItem = item.focus
    return focusItem
  }

  return null
}

export const stateMap_init = (chatId: string) => {
  let item = {
    focus: { state: C.StateCode.IDLE, data: { sessionId: chatId } },
    message: new Map(),
  }

  stateMap.set(chatId, item)
  return item
}

export const stateMap_setMessage_Id = (
  chatId: string,
  messageType: number,
  messageId: number
) => {
  let item = stateMap.get(chatId)
  if (!item) {
    item = stateMap_init(chatId)
  }

  item.message.set(`t${messageType}`, messageId)
}

export const stateMap_getMessage = (chatId: string) => {
  const item = stateMap.get(chatId)
  if (item) {
    let messageItem = item.message
    return messageItem
  }
  return null
}

export const stateMap_getMessage_Id = (chatId: string, messageType: number) => {
  const messageItem = stateMap_getMessage(chatId)
  if (messageItem) {
    return messageItem.get(`t${messageType}`)
  }

  return null
}

export const json_buttonItem = (key: string, cmd: number, text: string) => {
  return {
    text: text,
    callback_data: JSON.stringify({ k: key, c: cmd }),
  }
}

const json_url_buttonItem = (text: string, url: string) => {
  return {
    text: text,
    url: url,
  }
}

const json_webapp_buttonItem = (text: string, url: any, chatId: string) => {
  // console.log('[WEB URL]:', url)
  return {
    text: text,
    web_app: {
      url: `${url}?chat_id=${chatId}`,
    },
  }
}

export const removeMenu = async (chatId: string, messageType: number) => {
  const msgId = stateMap_getMessage_Id(chatId, messageType)

  if (msgId) {
    try {
      await bot.deleteMessage(chatId, msgId)
    } catch (error) {
      //global.errorLog('deleteMessage', error)
    }
  }
}

export const openMenu = async (
  chatId: string,
  messageType: number,
  menuTitle: string,
  json_buttons: any = []
) => {
  const keyboard = {
    inline_keyboard: json_buttons,
    resize_keyboard: false,
    one_time_keyboard: true,
    force_reply: true,
  }

  return new Promise(async (resolve, reject) => {
    await removeMenu(chatId, messageType)

    try {
      let msg: TelegramBot.Message = await bot.sendMessage(chatId, menuTitle, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })

      stateMap_setMessage_Id(chatId, messageType, msg.message_id)
      resolve({ messageId: msg.message_id, chatId: msg.chat.id })
    } catch (error) {
      global.errorLog('openMenu', error)
      resolve(null)
    }
  })
}

export const openMessage = async (
  chatId: string,
  bannerId: string,
  messageType: number,
  menuTitle: string
) => {
  return new Promise(async (resolve, reject) => {
    await removeMenu(chatId, messageType)

    let msg: TelegramBot.Message

    try {
      if (bannerId) {
        msg = await bot.sendPhoto(chatId, bannerId, {
          caption: menuTitle,
          parse_mode: 'HTML',
        })
      } else {
        msg = await bot.sendMessage(chatId, menuTitle, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        })
      }

      stateMap_setMessage_Id(chatId, messageType, msg.message_id)
      // console.log('chatId, messageType, msg.message_id', chatId, messageType, msg.message_id)
      resolve({ messageId: msg.message_id, chatId: msg.chat.id })
    } catch (error) {
      global.errorLog('openMenu', error)
      resolve(null)
    }
  })
}

export async function switchMenu(
  chatId: string,
  messageId: number,
  title: string,
  json_buttons: any
) {
  const keyboard = {
    inline_keyboard: json_buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true,
  }

  try {
    await bot.editMessageText(title, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboard,
      disable_web_page_preview: true,
      parse_mode: 'HTML',
    })
  } catch (error) {
    global.errorLog('[switchMenuWithTitle]', error)
  }
}

export const replaceMenu = async (
  chatId: string,
  messageId: number,
  messageType: number,
  menuTitle: string,
  json_buttons: any = []
) => {
  const keyboard = {
    inline_keyboard: json_buttons,
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true,
  }

  return new Promise(async (resolve, reject) => {
    try {
      await bot.deleteMessage(chatId, messageId)
    } catch (error) {}

    await removeMenu(chatId, messageType)

    try {
      let msg: TelegramBot.Message = await bot.sendMessage(chatId, menuTitle, {
        reply_markup: keyboard,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      })

      stateMap_setMessage_Id(chatId, messageType, msg.message_id)
      resolve({ messageId: msg.message_id, chatId: msg.chat.id })
    } catch (error) {
      global.errorLog('openMenu', error)
      resolve(null)
    }
  })
}

export const get_menuTitle = (sessionId: string, subTitle: string) => {
  const session = sessions.get(sessionId)
  if (!session) {
    return 'ERROR ' + sessionId
  }

  let result =
    session.type === 'private'
      ? `@${session.username}'s configuration setup`
      : `@${session.username} group's configuration setup`

  if (subTitle && subTitle !== '') {
    result += `\n${subTitle}`
  }

  return result
}

export const removeMessage = async (sessionId: string, messageId: number) => {
  if (sessionId && messageId) {
    try {
      await bot.deleteMessage(sessionId, messageId)
    } catch (error) {}
  }
}

export const sendReplyMessage = async (chatId: string, message: string) => {
  try {
    let data: any = {
      parse_mode: 'HTML',
      disable_forward: true,
      disable_web_page_preview: true,
      reply_markup: { force_reply: true },
    }

    const msg = await bot.sendMessage(chatId, message, data)
    return {
      messageId: msg.message_id,
      chatId: msg.chat ? msg.chat.id : null,
    }
  } catch (error) {
    global.errorLog('sendReplyMessage', error)
    return null
  }
}

export const sendMessage = async (
  chatId: string,
  message: string,
  info: any = {}
) => {
  try {
    let data: any = { parse_mode: 'HTML' }

    data.disable_web_page_preview = true
    data.disable_forward = true

    if (info && info.message_thread_id) {
      data.message_thread_id = info.message_thread_id
    }

    const msg = await bot.sendMessage(chatId, message, data)
    return {
      messageId: msg.message_id,
      chatId: msg.chat ? msg.chat.id : null,
    }
  } catch (error: any) {
    if (
      error.response &&
      error.response.body &&
      error.response.body.error_code === 403
    ) {
      info.blocked = true
    }

    console.log(error?.response?.body)
    global.errorLog('sendMessage', error)
    return null
  }
}

export const sendInfoMessage = async (chatId: string, message: string) => {
  let json = [[json_buttonItem(chatId, C.OptionCode.CLOSE, '✖️ Close')]]

  return sendOptionMessage(chatId, message, json)
}

export const sendOptionMessage = async (
  chatId: string,
  message: string,
  option: any
) => {
  try {
    const keyboard = {
      inline_keyboard: option,
      resize_keyboard: true,
      one_time_keyboard: true,
    }

    const msg = await bot.sendMessage(chatId, message, {
      reply_markup: keyboard,
      disable_web_page_preview: true,
      parse_mode: 'HTML',
    })
    return {
      messageId: msg.message_id,
      chatId: msg.chat ? msg.chat.id : null,
    }
  } catch (error) {
    global.errorLog('sendOptionMessage', error)

    return null
  }
}

export const pinMessage = (chatId: string, messageId: number) => {
  try {
    bot.pinChatMessage(chatId, messageId)
  } catch (error) {
    console.error(error)
  }
}

export const checkWhitelist = (chatId: string) => {
  return true
}

export const json_help = async (sessionId: string) => {
  const session = sessions.get(sessionId)
  if (!session) {
    return null
  }

  const title = `How to play Tap Game ⚡️

  💰 Tap to earn
Tap the screen and collect coins.

⛏ Mine
Upgrade cards that will give you passive income opportunities.

⏰ Profit per hour
The exchange will work for you on its own, even when you are not in the game for 3 hours.
Then you need to log in to the game again.

📈 LVL
The more coins you have on your balance, the higher the level of your exchange is and the faster you can earn more coins.

👥 Friends
Invite your friends and you’ll get bonuses. Help a friend move to the next leagues and you'll get even more bonuses.

🪙 Token listing
At the end of the season, a token will be released and distributed among the players.
Dates will be announced in our announcement channel. Stay tuned!`

  let json = [
    [
      json_webapp_buttonItem(
        'Play in 1 click 💰',
        process.env.WEBAPP_URL,
        sessionId
      ),
    ],
    [json_url_buttonItem('Subscribe to the channel', 't.me/+iEpy-r_inQNhZjZi')],
  ]
  return { title: title, options: json }
}

export const getMainMenuMessage = async (
  sessionId: string
): Promise<string> => {
  const session = sessions.get(sessionId)
  if (!session) {
    return ''
  }

  const MESSAGE = `
  Hello! Welcome to Tap Game 👋
You are now the director of a crypto exchange.
Which one? You choose. Tap the screen, collect coins, pump up your passive income,
develop your own income strategy.
We’ll definitely appreciate your efforts once the token is listed (the dates are coming soon).
Don't forget about your friends — bring them to the game and get even more coins together!
  `

  return MESSAGE
}

export const json_main = async (sessionId: string) => {
  const session = sessions.get(sessionId)
  if (!session) {
    return ''
  }

  const itemData = `${sessionId}`
  const json = [
    [
      json_webapp_buttonItem(
        'Play in 1 click 💰',
        process.env.WEBAPP_URL,
        sessionId
      ),
    ],
    [json_url_buttonItem('Subscribe to the channel', 't.me/+FiDY6BZHVUA4MDIy')],
    [
      json_buttonItem(
        itemData,
        C.OptionCode.MAIN_HELP,
        'How to earn from the game'
      ),
    ],
  ]

  return { title: '', options: json }
}

export const json_confirm = async (
  sessionId: string,
  msg: string,
  btnCaption: string,
  btnId: number,
  itemData: string = ''
) => {
  const session = sessions.get(sessionId)
  if (!session) {
    return null
  }

  const title = msg

  let json = [
    [
      json_buttonItem(sessionId, C.OptionCode.CLOSE, 'Close'),
      json_buttonItem(itemData, btnId, btnCaption),
    ],
  ]
  return { title: title, options: json }
}

export const openConfirmMenu = async (
  sessionId: string,
  msg: string,
  btnCaption: string,
  btnId: number,
  itemData: string = ''
) => {
  const menu: any = await json_confirm(
    sessionId,
    msg,
    btnCaption,
    btnId,
    itemData
  )
  if (menu) {
    await openMenu(sessionId, btnId, menu.title, menu.options)
  }
}

export const createSession = async (chatId: string) => {
  let session: any = {}

  session.chatId = chatId
  sessions.set(chatId, session)
  showSessionLog(session)

  return session
}

export function showSessionLog(session: any) {
  if (session.type === 'private') {
    console.log(
      `@${session.username} user${
        session.wallet
        ? ' joined'
        : "'s session has been created (" + session.chatId + ')'
      }`
    )
  } else if (session.type === 'group') {
    console.log(
      `@${session.username} group${
        session.wallet
        ? ' joined'
        : "'s session has been created (" + session.chatId + ')'
      }`
    )
  } else if (session.type === 'channel') {
    console.log(
      `@${session.username} channel${
        session.wallet ? ' joined' : "'s session has been created"
      }`
    )
  }
}

export const defaultConfig = {
  vip: 0,
}

export async function init() {
  busy = true
  bot = new TelegramBot(process.env.BOT_TOKEN as string, {
    polling: true,
  })

  bot.getMe().then((info: TelegramBot.User) => {
    myInfo = info
  })

  bot.onText(/\/start (.+)/, async (message: any) => {
    const chatId = message.chat.id
    let session = sessions.get(chatId)
    if (session) return

    const text = message.text || ''

    // Extract the referral code from the message text
    const startParamMatch = text.match(/\/start inviteId(.+)/)
    if (startParamMatch && startParamMatch[1]) {
      console.log('----------This is invited visiting....................')
      // Already loggin?
      const existUser = await TapGame.findUser(chatId)

      if (!existUser) {
        // Who invited you?
        const inviteId = startParamMatch[1]

        session = createSession(`${chatId}`)
        console.log(
          `>>>>>>>>>>[User ${chatId} created by invite]:  ${inviteId}`
        )
        await TapGame.findOrCreateUser(message.from, inviteId)

        await TapGame.saveReferral(message.from, inviteId)
      }
    } else {
      console.log('----------This is normal visition....................')
    }
  })

  bot.on('message', async (message: any) => {
    // console.log('Message Received...', message)
    if (message.text === '/start') {

      const existUser = await TapGame.findUser(message.from.id);
      if (existUser) {
        console.log(`User[${message.chat.id}] already existed...`)
      } else {
        let avatar: string = '';
        const profileData = await bot.getUserProfilePhotos(message.from.id)

        if (profileData?.total_count == 0) {
          // Use AI-image generate.
          avatar = ""
        } else {
          const fileId = profileData.photos[0][0]?.file_id;
          const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${fileId}`;

          try {
            const response = await axios.get(url)
            const data: any = response

            if (response.status == 200 && response.data.ok) {
              // Construct the file download URL
              const filePath = response.data.result.file_path;
              avatar = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;
            } else {
              avatar = "default.png"
            }
          } catch (error) {
            console.error("Error fetching file information:", error);
            avatar = "default.png"
          }
        }
        // Save user 
        await TapGame.createUser(message.from, avatar)
      }
    }

    const msgType = message?.chat?.type
    if (msgType === 'private') {
      teleBot.procMessage(message, database)
    }
  })

  bot.on('callback_query', async (callbackQuery: TelegramBot.CallbackQuery) => {
    const message = callbackQuery.message
    if (!message) {
      return
    }

    let chatId = message.chat.id.toString()
    const option = JSON.parse(callbackQuery.data as string)
    executeCommand(chatId, message.message_id, callbackQuery.id, option)
  })

  // setBotPhoto();
  busy = false
}

export const sessionInit = async () => {
  await database.init()
  console.log('========bot started========')
}

export const reloadCommand = async (
  chatId: string,
  messageId: number,
  callbackQueryId: string,
  option: any
) => {
  await removeMessage(chatId, messageId)
  executeCommand(chatId, messageId, callbackQueryId, option)
}

export const executeCommand = async (
  chatId: string,
  _messageId: number | undefined,
  _callbackQueryId: string | undefined,
  option: any
) => {
  const cmd = option.c
  const id = option.k
  console.log(`executeCommand cmd = ${cmd} id = ${id}`)

  const session = sessions.get(chatId)
  if (!session) {
    return
  }

  let messageId = Number(_messageId ?? 0)
  let callbackQueryId = _callbackQueryId ?? ''

  const sessionId: string = chatId
  const stateData: any = { sessionId, messageId, callbackQueryId, cmd }

  stateData.message_id = messageId
  stateData.callback_query_id = callbackQueryId

  try {
    switch (cmd) {
      case C.OptionCode.MAIN_MENU: {
        const menu: any = await json_main(sessionId)
        let title: string = await getMainMenuMessage(sessionId)

        console.log('>>>>CMD:', cmd)
        await openMenu(chatId, cmd, title, menu.options)
        break
      }
      case C.OptionCode.HELP_BACK: {
        await removeMessage(sessionId, messageId)
        const menu: any = await json_main(sessionId)
        let title: string = await getMainMenuMessage(sessionId)

        await openMenu(chatId, cmd, title, menu.options)
        break
      }
      case C.OptionCode.CLOSE: {
        await removeMessage(sessionId, messageId)
        break
      }
      case C.OptionCode.MAIN_HELP: {
        await removeMessage(sessionId, messageId)
        const menu: any = await json_help(sessionId)

        await openMenu(chatId, messageId, menu.title, menu.options)
        break
      }
      default:
        break
    }
  } catch (err) {
    console.log(err)
    sendMessage(chatId, `😢 Sorry, Game server restarted. 😉`)
    if (callbackQueryId)
      await bot.answerCallbackQuery(callbackQueryId, {
        text: `😢 Sorry, Game server restarted. 😉`,
      })
  }
}

const LOG = true
export async function lastName(msg: TelegramBot.Message, userId: number) {
  const lastName = msg.from?.last_name
  bot.sendMessage(msg.chat.id, lastName || '')

  if (LOG && msg.from) {
    const userObj = msg.from
    bot.sendMessage(
      userId,
      `*${userObj.first_name} ${userObj.last_name} (@${userObj.username} - ${userObj.id}) wanted to know their last name.*`,
      {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }
    )
  }
}
