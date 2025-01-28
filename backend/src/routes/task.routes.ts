import express from 'express'
import dotenv from 'dotenv'
import { TaskModel } from '../models/task.model'
import { verifyToken } from '../middleware'
dotenv.config()

const router = express.Router()
// Route to get tasks
router.get('/', verifyToken, async (req, res) => {
  console.log("Task - get task")
  try {
    const { chatId } = req.body.user // Use query parameters for GET request
    let taskModel = await TaskModel.find({})

    res.status(200).json(taskModel)
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
})

export default router
