import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import * as C from '../utils/constant'
import * as TapGame from '../core/tapgame'
import { spinWheelInfo, scoreTempValue } from '../core/tapgame'
import { UserModel } from '../models/user.model'
import { LevelModel } from '../models/level.model'
import { ItemModel } from '../models/item.model'
import { LangModel } from '../models/lang.model'
import { authenticateToken } from './user.routes'
import { TaskModel } from '../models/task.model'
import { getTime } from '../core/tapgame'
import { PresetModel } from '../models/preset.model'

dotenv.config()

const router = express.Router()

// @API: /info
// @request: bearer token
// @response: user info & energy & score
// @method: GET
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const levels = await LevelModel.find()
    const items = await ItemModel.find()
    const langs = await LangModel.find()

    const chatId = req.body.user.chatId
    const game = await UserModel.findOne({ chatId })
    if (game != null && game != undefined) {
      res.status(200).json({
        state: true,
        data: { levels, items, langs },
      })
    } else {
      res.json({ state: false, data: null }).status(200)
    }
  } catch (error) {
    res.status(500).end()
  }
})

router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const chatId = req.body.user.chatId
    const game = await UserModel.findOne({ chatId })
    if (game != null && game != undefined) {
      const tasks = await TaskModel.find()
      res.status(200).json({
        state: true,
        data: tasks
      })
    } else {
      res.json({ state: false, data: null }).status(200)
    }

  } catch (error) {
    res.status(500).end()
  }
});

router.get('/time', authenticateToken, async (req, res) => {
  try {
    res.status(200).json({
      state: true,
      data: getTime()
    })
  } catch (error) {
    res.json({ state: false, data: null }).status(200)
  }
});

router.get('/wheel-scores', authenticateToken, async (req, res) => {
  try {
    const wheelscores = await PresetModel.findOne({ key: "wheelScores" });
    if (!wheelscores) {
      return res.status(201).json({
        state: false,
        data: null
      })
    }

    console.log(wheelscores)

    if (JSON.parse(JSON.stringify(wheelscores)).value.length != 8) {
      return res.status(201).json({
        state: false,
        data: "Invalid value"
      })
    }
    console.log(wheelscores)

    res.status(200).json({
      state: true,
      data: JSON.parse(JSON.stringify(wheelscores)).value
    })
  } catch (error) {
    res.json({ state: false, data: null }).status(200)
  }
})

router.get('/wheel-get-random-value', authenticateToken, async (req, res) => {
  try {
    const chatId = req.body.user.chatId
    const wheelscores = await PresetModel.findOne({ key: "wheelScores" });
    if (!wheelscores) {
      return res.status(201).json({
        state: false,
        data: null
      })
    }
    const scores = JSON.parse(JSON.stringify(wheelscores)).value;
    if (scores.length != 8) {
      return res.status(201).json({
        state: false,
        data: "Invalid value"
      })
    }

    const rannum = Math.floor(Math.random() * 100);
    let retNum = 0;
    if (rannum < 20) {
      retNum = 0
    } else if (rannum < 40) {
      retNum = 1
    } else if (rannum < 55) {
      retNum = 2
    } else if (rannum < 70) {
      retNum = 3
    } else if (rannum < 80) {
      retNum = 4
    } else if (rannum < 90) {
      retNum = 5
    } else if (rannum < 95) {
      retNum = 6
    } else if (rannum < 98) {
      retNum = 7
    } else {
      retNum = 0
    }

    let current = { ...spinWheelInfo[chatId] };
    const user = await UserModel.findOne({ chatId });
    const spinItem = await ItemModel.findOne({ title: 'Spin limit' })
    const userSpinItem = user?.userItems?.find((_v, _i) => _v?.id == spinItem?.id);
    
    console.log(current, "/Current User")
    console.log(userSpinItem, (current.count ? current.count : 0))
    if (userSpinItem) {
      if ((current.count ? current.count : 0) < userSpinItem.current + 1) {
        console.log("111111111111111")
        spinWheelInfo[chatId] = { count: current?.count ? current.count + 1 : 1, timestamp: Date.now() }
      } else if ((current.timestamp ? current.timestamp : 0) < (Date.now() - 24 * 3600 * 1000)) {
        console.log("222222222222222", current.timestamp ? current.timestamp : 0, Date.now() - 24 * 3600 * 1000)
        spinWheelInfo[chatId] = { count: 1, timestamp: Date.now() }
      } else {
        console.log("33333333333333")
        return res.status(200).json({ state: false, data: 24 * 3600 * 1000 - (Date.now() - current.timestamp) });
      }
    } else {
      if ((current.count ? current.count : 0) < 1) {
        console.log("44444444444444444")
        spinWheelInfo[chatId] = { count: 1, timestamp: Date.now() }
      } else if ((current.timestamp ? current.timestamp : 0) < (Date.now() - 24 * 3600 * 1000)) {
        console.log("5555555555555555")
        spinWheelInfo[chatId] = { count: 1, timestamp: Date.now() }
      } else {
        console.log("666666666666666666")
        return res.status(200).json({ state: false, data: 24 * 3600 * 1000 - (Date.now() - current.timestamp) });
      }
    }

    scoreTempValue[chatId] = parseInt(scores[retNum]);

    res.status(200).json({
      state: true,
      data: retNum
    })
  } catch (error) {
    console.log(error);
    res.json({ state: false, data: null }).status(200)
  }
})

router.get('/wheel-get-confirmed', authenticateToken, async (req, res) => {
  try {
    const chatId = req.body.user.chatId
    const user = await UserModel.findOne({ chatId })
    if (!user) {
      return res.json({ state: false, data: null }).status(201)
    }

    let new_user;
    if (scoreTempValue[chatId]) {
      new_user = await TapGame.calculateBalance(chatId, scoreTempValue[chatId], scoreTempValue[chatId]);
    }
    return res.json({ status: true, data: new_user }).status(200)

  } catch (error) {
    console.log(error);
    return res.json({ state: false, data: null }).status(401)
  }
})

export default router
