import express from 'express'
import dotenv from 'dotenv'

import { LevelModel } from '../models/level.model'
import { authenticateToken } from './user.routes'
dotenv.config()

const router = express.Router()
// Route to get items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.body.user // Use query parameters for GET request
    // let user = await UserModel.findOne({ chatId })
    let levels = await LevelModel.find()

    res.status(200).json({
      state: true,
      data: levels
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

export default router
