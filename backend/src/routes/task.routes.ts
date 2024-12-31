import express from 'express'
import dotenv from 'dotenv'

import { UserModel, UserTask, DailyGameTask } from '../models/user.model'
import { DailyTaskModel } from '../models/dailyTask.model'
import { TaskModel } from '../models/task.model'
import { verifyToken } from '../middleware'
import { isToday, isYesterday } from '../utils/methods'
import { userInfoList } from '../core/tapgame'
dotenv.config()

const router = express.Router()
// Route to get tasks
router.get('/list', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.body.user // Use query parameters for GET request
    let game = await UserModel.findOne({ chatId })
    let newUserTasks = await TaskModel.find()

    res.status(200).json({
      state: true,
      data: game?.userTasks,
      tasks: newUserTasks,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

// Route to get daily tasks
router.get('/dailylist', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.query // Use query parameters for GET request
    let game = await UserModel.findOne({ chatId })
    let dailyTasks = await DailyTaskModel.find()

    res.status(200).json({
      state: true,
      data: game?.dailyTasks,
      tasks: dailyTasks,
    })
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

router.post('/join', verifyToken, async (req, res) => {
  try {
    const { chatId, taskId } = req.body

    let user = await UserModel.findOne({ chatId })
    if (user) {
      user.userTasks.push(new UserTask({ taskId, isJoined: true }))
      await user.save()

      return res.status(200).json({
        state: true,
        data: user,
      })
    }

    return res.status(200).json({
      state: false,
      data: null,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
})

router.post('/claim', verifyToken, async (req, res) => {
  try {
    const { chatId, taskId } = req.body

    let user = await UserModel.findOne({ chatId })
    if (user) {
      user.userTasks.push(new UserTask({ taskId, isClaimed: true }))
      await user.save()

      return res.status(200).json({
        state: true,
        data: user,
      })
    }

    return res.status(200).json({
      state: false,
      data: null,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
})

router.get('/daily/tasks', verifyToken, async (req, res) => {
  try {
    let dailyTasks = await DailyTaskModel.find();
    return res.status(200).send({
      state: true,
      data: dailyTasks
    })
  } catch(error) {
    console.log(error)
    return res.status(500).end()
  }
})

router.post('/daily/claim', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.body.user;
    const { taskId, isPremium } = req.body

    let game = await UserModel.findOne({ chatId })
    if (game) {
      let dailyTask = await DailyTaskModel.findOne({ taskId })
      if (!dailyTask) {
        return res.status(404).json({ state: false, message: 'Task not found' })
      }

      let userDailyTask = game.dailyTasks;
      let friendCount = await UserModel.countDocuments({ invitedFrom: chatId })

      let isUpdatedFromClassicToPremium = userDailyTask.checkedType == "CLASSIC" && isPremium && friendCount >= 3;

      if (isToday(userDailyTask.timestamp) && !isUpdatedFromClassicToPremium) {
        return res.status(404).json({ state: false, message: 'Already claimed' })
      }

      let claimTaskId = isYesterday(userDailyTask.timestamp) ? userDailyTask.taskId + 1 : 1;
      if (isUpdatedFromClassicToPremium) claimTaskId = 1;
      if (claimTaskId == taskId && (!isPremium || (friendCount >= 3 && isPremium))) {
        game.dailyTasks.taskId = taskId;
        game.dailyTasks.checkedType = isPremium ? "PREMIUM" : "CLASSIC";
        game.dailyTasks.timestamp = Date.now();
      } else {
        return res.status(404).json({ state: false, message: 'Invalid claim' })
      }

      if (isPremium === false) {
        game.currBalance += dailyTask.classicReward
        game.totalBalance += dailyTask.classicReward
        userInfoList[chatId].currBalance += dailyTask.classicReward
        userInfoList[chatId].totalBalance += dailyTask.classicReward
      } else {
        game.currBalance += dailyTask.premiumReward
        game.totalBalance += dailyTask.premiumReward
        userInfoList[chatId].currBalance += dailyTask.premiumReward
        userInfoList[chatId].totalBalance += dailyTask.premiumReward
      }

      await game.save()

      return res.status(200).json({
        state: true,
        data: game,
      })
    }

    return res.status(200).json({
      state: false,
      data: null,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
})

export default router
