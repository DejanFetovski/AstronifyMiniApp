import express from 'express'
import dotenv from 'dotenv'

import { UserModel  } from '../models/user.model'
// import { checkRoyalTask } from '../core/tapgame'

import { verifyToken } from '../middleware'

dotenv.config()

const router = express.Router()

// router.get('/reward', authenticateToken, async (req, res) => {
//   try {
//     const chatId = req.body.chatId
//     let user = await UserModel.findOne({ chatId })
//     if (user != null) {
//       TapGame.disposeInviteReward(chatId)
//     }
//     res.status(200).json({
//       state: true,
//       data: 'successed user reward',
//     })
//   } catch (error) {
//     res.status(500).end()
//   }
// })

// @API: /info
// @request: bearer token
// @response: user info & energy & score
// @method: GET
router.get('/info', verifyToken, async (req, res) => {
  console.log(`user.route.ts - info`)
  try {
    const { chatId } = req.body.user

    const user = await UserModel.findOne({ chatId })
    if (user != null || user != undefined) {
      res.status(200).json({
        state: true,
        data: user,
      })
    } else {
      // get userdata from bot with chatId
      // const user = {
      //   firstName: "",
      //   secondName,
      //   userName,
      //   logo,
      // }
      // create new game data

      // console.log('----new data insert----')
      // await item.save()
      res.json({ state: false, data: null }).status(200)
    }
  } catch (error) {
    res.status(500).end()
  }
})

router.post('/setting', verifyToken, async (req, res) => {
  const chatId = req.body.user?.chatId
  const { lang, animation, sound, music } = req.body

  const newSettings = {
    lang,
    animation,
    sound,
    music,
  }

  try {
    const result = await UserModel.updateOne(
      { chatId: chatId },
      { $set: { setting: newSettings } }
    )

    if (result != null && result != undefined) {
      res.status(200).json({
        state: true,
        data: newSettings,
      })
    } else {
      res.status(500).end()
    }
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).end()
  }
})

router.get('/friend-count', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.body.user
    const friendCount = await UserModel.countDocuments({ invitedFrom: chatId });
    return res.status(200).send({
      state: true,
      data: friendCount
    })
  } catch (error) {
    console.log(error)
    return res.status(500).end()
  }
})

// router.get('/task', verifyToken, async (req, res) => {
//   const { chatId } = req.body.user

//   //Get existed Task data of user
//   const oldUser = await UserModel.findOne({ chatId: chatId })
//   const oldUserTasks = oldUser?.userTasks;

//   let newUserTasks: UserTaskDocument[] = oldUserTasks ? [...oldUserTasks] : [];

//   let invitedNumber: number = 0;
//   try {
//     invitedNumber = await UserModel.countDocuments({
//       invitedFrom: chatId,
//     })
//     console.log(`Number of users with invitedFrom not empty: ${invitedNumber}`)
//   } catch (error) {
//     console.error('Error counting users with invitedFrom:', error)
//     throw error
//   }

//   const { xConnected, tgChannelConnected, tgGroupConnected, walletConnected } =
//     await checkRoyalTask(chatId)
//   // await checkFriendTask(chatId)
//   TapGame.gameTasks.forEach((task) => {
//     let existingTask = oldUserTasks?.find((_v, _i) => _v.id == task.id);
//     if (existingTask) return;

//     let isJoined = false;
//     if (task.type?.toLowerCase() == "Royal".toLowerCase()) {
//       if (task.title?.toLowerCase() == "Follow us on X".toLowerCase())
//         isJoined = xConnected;
//       else if (task.title?.toLowerCase() == "Join the TG Channel".toLowerCase())
//         isJoined = tgChannelConnected;
//       else if (task.title?.toLowerCase() == "Join the Royal Coin Chat".toLowerCase())
//         isJoined = tgGroupConnected;
//       else if (task.title?.toLowerCase() == "Connect your TON wallet".toLowerCase())
//         isJoined = walletConnected;
//     } else if (task.type?.toLowerCase() == "Friends".toLowerCase()) {
//       isJoined = invitedNumber > parseInt(task.title?.split(' ')[1])
//     }
//     if (isJoined) {
//       let generatedUserTask: UserTaskDocument = {
//         id: task.id,
//         isJoined: isJoined,
//         isClaimed: false
//       } as UserTaskDocument
//       newUserTasks.push(generatedUserTask);
//     }
//   })

//   try {
//     const updatedUser = await UserModel.findOneAndUpdate(
//       { chatId: chatId }, // Find the user by chatId
//       { userTasks: newUserTasks }, // Update the tasks field
//       { new: true } // Return the updated document
//     )

//     if (updatedUser) {
//       console.log('User tasks updated successfully:', updatedUser)
//       res.status(200).json({
//         state: true,
//         data: updatedUser,
//       })
//     } else {
//       console.log('User not found')
//       res.status(200).json({
//         state: false,
//         data: null,
//       })
//     }
//   } catch (error) {
//     console.error('Error updating user tasks:', error)
//     res.status(500).end()
//   }
// })


export default router
