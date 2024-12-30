import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import * as C from '../utils/constant'
import * as TapGame from '../core/tapgame'
import * as TGBot from '../bot'
import { EnergyDocument, energySchema } from '../models/user.model'
dotenv.config()

const router = express.Router()

// @API: /getAuthentication
// @request: userInfo
// @response: token
// @method: POST
router.post('/getAuthentication', async (req, res) => {
  try {
    const userInfo = req.body.webAppUserInfo
    const chatId = userInfo.id
    // Create Token for user
    const token = jwt.sign({ chatId }, process.env.JWT_SECRET as string, {
      noTimestamp: true,
      expiresIn: '1h',
    })
    res.json({ token: token }).status(200)
  } catch (error) {
    console.log(error)
    res.status(500).end()
  }
})

export default router
