import express from 'express'

import dotenv from 'dotenv'

import * as TapGame from '../core/tapgame'
import { UserModel } from '../models/user.model'
import { LevelModel } from '../models/level.model'

import { authenticateToken } from './user.routes'

dotenv.config()

const router = express.Router()

router.get('/referral', authenticateToken, async (req, res) => {
  // try {
  //   let ret: any[] = []

  //   // Fetch game documents and populate user information
  const users = await UserModel.find()

  //   // Process the data
  //   users.forEach((item: any) => {
  //     const data = {
  //       chatId: item.chatId as number,
  //       metaInfo: item.metaInfo,
  //       referrals: item.referrals,
  //       levelId: item.levelId
  //     }
  //     ret.push(data)
  //   })

  //   res.status(200).json({
  //     state: true,
  //     data: ret,
  //   })
  // } catch (error) {
  //   res.status(500).end()
  // }

  try {
    const result = await UserModel.aggregate([
      {
        $lookup: {
          from: 'users', // Name of the collection (it's typically the plural of your model name)
          localField: 'chatId',
          foreignField: 'invitedFrom',
          as: 'invitedUsers'
        }
      },
      {
        $addFields: {
          inviteCount: { $size: '$invitedUsers' }
        }
      },
      {
        $sort: { inviteCount: -1 },
      },
      {
        $project: {
          chatId: 1,
          metaInfo: 1,
          levelId: 1,
          energy: 1,
          userItems: 1,
          userTasks: 1,
          dailyTasks: 1,
          currBalance: 1,
          totalBalance: 1,
          setting: 1,
          inviteCode: 1,
          invitedFrom: 1,
          inviteCount: 1
        }
      },
    ])

    console.log('>>>>>>>>>>>>>>>>>>', result)
    res.status(200).json({
      state: true,
      data: result,
    })
  } catch (error) {
    res.status(200).json({
      state: true,
      data: null,
    })
  }
})

// @API: /
// @request: bearer token
// @response: top total scores
// @method: GET
router.get('/', authenticateToken, async (req, res) => {
  const levelId = Number(req.query.levelId)

  if (!isNaN(levelId)) {
    let users = await getUsersByLevelId(levelId)
    res.status(200).json({
      state: true,
      data: users,
    })
  } else {
    res.status(400).json({
      state: false,
      data: null,
    })
  }
})

const getUsersByLevelId = async (levelId: number) => {
  if (levelId != null) {
    try {
      return await UserModel.find({ levelId: levelId })
        .sort({ currBalance: -1 })
        .exec()
    } catch (error) {
      return null
    }
  } else {
    return null
  }
}

export default router
