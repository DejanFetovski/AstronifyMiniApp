import dotenv from 'dotenv'
dotenv.config()

import * as C from './utils/constant'

export enum lvlTypes {
  LT_PEASANT = 0,
  LT_MERCHANT,
  LT_KNIGHT,
  LT_ROYAL_KNIGHT,
  LT_LORD,
  LT_QUEEN,
  LT_KING,
}

const lvlLabels: Array<String> = [
  'PEASANT',
  'MERCHANT',
  'KNIGHT',
  'ROYAL KNIGHT',
  'LORD',
  'QUEEN',
  'KING',
]

export const init = async () => {}

export const errorLog = (summary: string, error: any): void => {
  if (error?.response?.body?.description) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `[error] ${summary} ${error.response.body.description}`
    )
  } else {
    console.log('\x1b[31m%s\x1b[0m', `[error] ${summary} ${error}`)
  }
}

export const parseError = (error: any): string => {
  let msg = ''
  try {
    error = JSON.parse(JSON.stringify(error))
    msg =
      error?.reasong ||
      error.error?.reason ||
      JSON.parse(error)?.error?.error?.response?.error?.message ||
      error?.response ||
      error?.message ||
      error
  } catch (err) {
    msg = error
  }

  return msg
}

export const get_bot_link = () => {
  return `https://t.me/${process.env.BOT_USERNAME}`
}
