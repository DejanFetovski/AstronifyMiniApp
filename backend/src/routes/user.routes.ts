import express from 'express'
import dotenv from 'dotenv'

import { UserModel } from '../models/user.model'
import { ReferralModel } from '../models/referral.model'
import { verifyToken } from '../middleware'

dotenv.config()

const router = express.Router()

// @API: /info
// @request: bearer token
// @response: user info & energy & score
// @method: GET
router.get('/info', verifyToken, async (req, res) => {
  console.log(`user.route.ts - get info`)
  try {
    const { chatId } = req.body.user

    const user = await UserModel.findOne({ chatId })
    if (user != null || user != undefined) {
      res.status(200).json({
        state: true,
        data: user,
      })
    } else {
      const newUser = new UserModel({
        chatId,
        setting: {
          question1: 0,
          question2: 0,
          question3: 0,
          pfName: "",
          birth: new Date(),
          sex: "male",
        },
        point: 0,
        isFirstLogin: true,
      });

      await newUser.save();
      res.status(201).json({
        state: true,
        message: "New user created",
        data: newUser,
      });
    }
  } catch (error) {
    res.status(500).end()
  }
})

router.post('/info', verifyToken, async (req, res) => {
  console.log(`user.route.ts - save info`)
  try {
    const { chatId } = req.body.user;
    const data = req.body
    const user = await UserModel.findOne({ chatId })
    if (user != null || user != undefined) {

      const updatedData = await UserModel.updateOne({ chatId }, { $set: data });

      res.status(200).json({
        state: true,
        data: updatedData,
      })
    } else {
      res.status(200).json({
        state: false,
        data: null,
      })
    }
  } catch (error) {
    res.status(500).end()
  }
})

router.put('/info', verifyToken, async (req, res) => {
  console.log(`user.route.ts - update info`)
  try {
    const { chatId } = req.body.user;
    const data = req.body;
    
    // Find the user by chatId
    const user = await UserModel.findOne({ chatId });

    if (user != null && user != undefined) {
      // Update the user with the new data
      const updatedData = await UserModel.updateOne({ chatId }, { $set: data });

      if (updatedData.modifiedCount > 0) {
        res.status(200).json({
          state: true,
          message: "User information updated successfully.",
          data: updatedData,
        });
      } else {
        res.status(200).json({
          state: false,
          message: "No data was changed. The information might be the same.",
        });
      }
    } else {
      res.status(404).json({
        state: false,
        message: "User not found.",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      state: false,
      message: "An error occurred while updating user information.",
    });
  }
});

router.get('/referral', verifyToken, async(req, res) => {
  try {
    const { chatId } = req.body.user;
    const referrals = await ReferralModel.find({inviterId: chatId})
    res.status(200).json({
      referrals: referrals
    })

    return referrals;
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
