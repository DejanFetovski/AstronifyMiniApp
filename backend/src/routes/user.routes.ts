import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import * as C from '../utils/constant'
import * as TapGame from '../core/tapgame'
import { UserItemDocument, UserModel, UserTaskDocument } from '../models/user.model'
import { LevelModel } from '../models/level.model'
import { checkRoyalTask } from '../core/tapgame'
import { TaskDocument } from '../models/task.model'

dotenv.config()

const router = express.Router()

export const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers['authorization']

  //Extracting token from authorization header
  const token = authHeader && authHeader.split(' ')[1]

  //Checking if the token is null
  if (!token) {
    return res.status(401).send('Authorization failed. No access token.')
  }

  //Verifying if the token is valid.
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      console.log(err)
      return res.status(403).send('Could not verify token')
    }
    req.body.user = user
  })
  next()
}

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
router.get('/info', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.body.user

    // console.log(chatId)
    const game = await UserModel.findOne({ chatId })
    if (game != null || game != undefined) {
      res.status(200).json({
        state: true,
        data: game,
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

router.post('/setting', authenticateToken, async (req, res) => {
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

router.get('/friend-count', authenticateToken, async (req, res) => {
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

router.get('/task', authenticateToken, async (req, res) => {
  const { chatId } = req.body.user

  //Get existed Task data of user
  const oldUser = await UserModel.findOne({ chatId: chatId })
  const oldUserTasks = oldUser?.userTasks;

  let newUserTasks: UserTaskDocument[] = oldUserTasks ? [...oldUserTasks] : [];

  let invitedNumber: number = 0;
  try {
    invitedNumber = await UserModel.countDocuments({
      invitedFrom: chatId,
    })
    console.log(`Number of users with invitedFrom not empty: ${invitedNumber}`)
  } catch (error) {
    console.error('Error counting users with invitedFrom:', error)
    throw error
  }

  const { xConnected, tgChannelConnected, tgGroupConnected, walletConnected } =
    await checkRoyalTask(chatId)
  // await checkFriendTask(chatId)
  TapGame.gameTasks.forEach((task) => {
    let existingTask = oldUserTasks?.find((_v, _i) => _v.id == task.id);
    if (existingTask) return;

    let isJoined = false;
    if (task.type?.toLowerCase() == "Royal".toLowerCase()) {
      if (task.title?.toLowerCase() == "Follow us on X".toLowerCase())
        isJoined = xConnected;
      else if (task.title?.toLowerCase() == "Join the TG Channel".toLowerCase())
        isJoined = tgChannelConnected;
      else if (task.title?.toLowerCase() == "Join the Royal Coin Chat".toLowerCase())
        isJoined = tgGroupConnected;
      else if (task.title?.toLowerCase() == "Connect your TON wallet".toLowerCase())
        isJoined = walletConnected;
    } else if (task.type?.toLowerCase() == "Friends".toLowerCase()) {
      isJoined = invitedNumber > parseInt(task.title?.split(' ')[1])
    }
    if (isJoined) {
      let generatedUserTask: UserTaskDocument = {
        id: task.id,
        isJoined: isJoined,
        isClaimed: false
      } as UserTaskDocument
      newUserTasks.push(generatedUserTask);
    }
  })

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { chatId: chatId }, // Find the user by chatId
      { userTasks: newUserTasks }, // Update the tasks field
      { new: true } // Return the updated document
    )

    if (updatedUser) {
      console.log('User tasks updated successfully:', updatedUser)
      res.status(200).json({
        state: true,
        data: updatedUser,
      })
    } else {
      console.log('User not found')
      res.status(200).json({
        state: false,
        data: null,
      })
    }
  } catch (error) {
    console.error('Error updating user tasks:', error)
    res.status(500).end()
  }
})

router.post('/task/claim', authenticateToken, async (req, res) => {
  const { chatId } = req.body.user
  const { id, reward } = req.body // task id, task balance

  //Update User taskdata
  const user = await UserModel.findOne({ chatId: chatId })
  user?.userTasks.forEach((item) => {
    if (item.id == id) {
      item.isClaimed = true
    }
  })

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { chatId: chatId }, // Find the user by chatId
      {
        userTasks: user?.userTasks,
        currBalance: user?.currBalance + reward,
      }, // Update the tasks and currBalance field
      { new: true } // Return the updated document
    )

    if (updatedUser) {
      console.log('User tasks updated successfully:', updatedUser)
      res.status(200).json({
        state: true,
        data: user?.userTasks,
      })
    } else {
      console.log('User not found')
      res.status(200).json({
        state: false,
        data: null,
      })
    }
  } catch (error) {
    console.error('Error updating user tasks:', error)
    res.status(500).end()
  }
})

router.post('/auto/claim', authenticateToken, async (req, res) => {
  const { chatId } = req.body.user
  const { amount } = req.body // task id, task balance

  let autoEarnInfo = TapGame.autoEarningUsers.find((_v, _i) => _v.chatId == chatId);
  if (!autoEarnInfo) {
    console.log("No auto earn user");
    return res.status(200).json({
      state: false,
      data: null,
    })
  }

  if (!autoEarnInfo.online || amount == 0 || autoEarnInfo.scoreOffline != amount) {
    console.log("Not allowed to claim auto earn");
    return res.status(200).json({
      state: false,
      data: null,
    })
  }

  autoEarnInfo.scoreOffline = 0;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { chatId: chatId },
      {
        $inc: {
          totalBalance: amount,
          currBalance: amount,
        },
      },
      { new: true } // Return the updated document
    )

    if (updatedUser) {
      console.log('User balance updated successfully:', updatedUser)
      res.status(200).json({
        state: true,
        data: updatedUser.currBalance,
      })
    } else {
      console.log('User not found')
      res.status(200).json({
        state: false,
        data: null,
      })
    }
  } catch (error) {
    console.error('Failed to claim auto earn user tasks:', error)
    res.status(500).end()
  }
})

router.post('/boost/purchase', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.body.user
    const { id } = req.body

    console.log("Buy", chatId, id)

    const relatedItem = TapGame.gameItemList.find((_v, _i) => _v.id == id);
    if (!relatedItem) {
      console.log('Item not found');
      return res.status(200).json({
        state: false,
        data: null,
      })
    }
    console.log(relatedItem)
    let price = relatedItem.itemLevel ? relatedItem.itemLevel[0].price : relatedItem.itemDaily.price;
    const user = await UserModel.findOne({ chatId: chatId })

    let userItems = user?.userItems
    let recoveryPerSecond_energy = user?.energy.recoveryPerSecond;
    let capacity_energy = user?.energy.capacity;
    let item_current = 0;
    if (userItems?.length != 0) {
      console.log("*************user existing item check****************")
      const item = userItems?.find((item) => item.id == id)
      if (item) {
        item.current += 1;
        item.timestamp = Date.now();
        item_current = item.current;
        let limit = relatedItem.itemLevel ? relatedItem.itemLevel?.length : relatedItem.itemDaily?.count;
        if (item_current) {
          console.log("**************current item id*************", item_current)
          price = relatedItem.itemLevel ? relatedItem.itemLevel[item_current - 1].price : relatedItem.itemDaily.price;
          if (item_current > limit) {
            return res.status(200).json({
              state: false,
              data: null,
            })
          }
        }
      }
      else userItems?.push({ id: id, current: 1, timestamp: Date.now() } as UserItemDocument)
    } else {
      userItems.push({ id: id, current: 1, timestamp: Date.now() } as UserItemDocument)
    }
    console.log("precalculate something")
    // Update balance, userItem
    try {
      // Find the user by chatId and update userItems and currBalance
      let currBalance = Number(user?.currBalance ?? 0) - price;
      if (currBalance < 0)
        return res.status(200).json({
          state: false,
          data: null,
        })
      else {
        const updatedUser =
          relatedItem.title?.toLowerCase() == "Full energy".toLowerCase() ?
            await UserModel.findOneAndUpdate(
              { chatId }, // Search condition
              {
                userItems: userItems,
                currBalance: currBalance,
                "energy.current": capacity_energy
              }, // Update fields
              {
                new: true,
                runValidators: true,
              } // Options: return the updated document, run schema validators
            ) :
            relatedItem.title?.toLowerCase() == "Recharge speed".toLowerCase() ?
              await UserModel.findOneAndUpdate(
                { chatId }, // Search condition
                {
                  userItems: userItems,
                  currBalance: currBalance,
                  "energy.recoveryPerSecond": recoveryPerSecond_energy! + 1
                }, // Update fields
                {
                  new: true,
                  runValidators: true,
                } // Options: return the updated document, run schema validators
              ) :
              relatedItem.title?.toLowerCase() == "Energy limit".toLowerCase() ?
                await UserModel.findOneAndUpdate(
                  { chatId }, // Search condition
                  {
                    userItems: userItems,
                    currBalance: currBalance,
                    "energy.capacity": capacity_energy! + 500
                  }, // Update fields
                  {
                    new: true,
                    runValidators: true,
                  } // Options: return the updated document, run schema validators
                ) :
                await UserModel.findOneAndUpdate(
                  { chatId }, // Search condition
                  {
                    userItems: userItems,
                    currBalance: currBalance,
                  }, // Update fields
                  {
                    new: true,
                    runValidators: true,
                  } // Options: return the updated document, run schema validators
                )

        if (updatedUser) {
          console.log('User updated successfully:', updatedUser)
          TapGame.userInfoList[chatId].userItems = [...(userItems!)]
          TapGame.userInfoList[chatId].currBalance = currBalance
          if (relatedItem.title?.toLowerCase() == "Full energy".toLowerCase())
            TapGame.userInfoList[chatId].energy.current = capacity_energy
          else if (relatedItem.title?.toLowerCase() == "Recharge speed".toLowerCase())
            TapGame.userInfoList[chatId].energy.recoveryPerSecond += 1;
          else if (relatedItem.title?.toLowerCase() == "Energy limit".toLowerCase())
            TapGame.userInfoList[chatId].energy.capacity += 500;
          else if (relatedItem.title?.toLowerCase() == "Auto Earn".toLowerCase()) {
            let autoEarnUser = TapGame.autoEarningUsers.find((_v, _i) => _v.chatId == chatId);
            if (autoEarnUser) {
              autoEarnUser.time = item_current;
            } else {
              TapGame.autoEarningUsers.push({
                chatId: chatId,
                time: item_current,
                online: true,
                offlineTimestamp: 0,
                scoreOffline: 0
              })
            }
          }
          return res.status(200).json({
            state: true,
            data: updatedUser,
          })
        } else {
          return res.status(200).json({
            state: false,
            data: null,
          })
          console.log('User not found')
        }
      }
    } catch (error) {
      console.error('Error updating user:', error)
      return res.status(200).json({
        state: false,
        data: null,
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).end()
  }
})

export default router
