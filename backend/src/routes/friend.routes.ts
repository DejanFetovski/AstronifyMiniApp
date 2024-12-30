import express from 'express'
import { UserModel, UserTask } from '../models/user.model'
import { TaskModel } from '../models/task.model'
import { authenticateToken } from './user.routes'

// Game SDK
import { calculateBalance, userInfoList } from '../core/tapgame'
const router = express.Router()

// Get referrals on user
router.get('/', authenticateToken, async (req, res) => {
  const { chatId } = req.body.user

  const referrals = await getReferrals(chatId)

  let retVal: any[] = []

  if (referrals != null && referrals != undefined) {
    for (let i = 0; i < referrals.length; i++) {
      const friends = await UserModel.find({ invitedFrom: referrals[i].chatId });
      let sum = 0;
      friends.forEach(friend => {
        sum += Math.floor(friend.totalBalance * 8 / 100)
      });
      let new_userInfo: any = {
        name: referrals[i].metaInfo.userName ? referrals[i].metaInfo.userName : referrals[i].metaInfo.firstName,
        friends: friends.length,
        reward: Math.floor(referrals[i].totalBalance * 10 / 100) + sum
      };
      retVal.push(new_userInfo);
    }
    res.status(200).json({
      state: true,
      data: retVal,
    })
  } else {
    res.status(200).json({
      state: true,
      data: null,
    })
  }
})

async function getReferrals(chatId: string) {
  try {
    const users = await UserModel.find({ invitedFrom: chatId })
    return users
  } catch (error) {
    return null
  }
}

// Claim reward balance from referrals.
router.post('/claim', authenticateToken, async (req, res) => {
  const { chatId } = req.body.user

  const referrals = await getReferrals(chatId)

  let retVal: any[] = []

  if (referrals != null && referrals != undefined) {
    let total = 0;
    for (let i = 0; i < referrals.length; i++) {
      const friends = await UserModel.find({ invitedFrom: referrals[i].chatId });
      let sum = 0;
      for (let j = 0; j < friends.length; j++) {
        sum += Math.floor(friends[j].totalBalance * 8 / 100)
        await UserModel.findOneAndUpdate(
          { chatId: friends[j].chatId },
          {
            $inc: {
              totalBalance: -friends[j].totalBalance,
            },
          },
          { new: true }
        )
      }
      let reward = Math.floor(referrals[i].totalBalance * 10 / 100) + sum;
      total += reward;

      await UserModel.findOneAndUpdate(
        { chatId: referrals[i].chatId },
        {
          $inc: {
            totalBalance: -referrals[i].totalBalance,
            currBalance: 10000,
          },
        },
        { new: true }
      )

      let new_userInfo: any = {
        name: referrals[i].metaInfo.userName ? referrals[i].metaInfo.userName : referrals[i].metaInfo.firstName,
        friends: friends.length,
        reward: 0
      };
      retVal.push(new_userInfo);
    }

    const user = await UserModel.findOneAndUpdate(
      { chatId: chatId },
      {
        $inc: {
          totalBalance: total + 10000,
          currBalance: total + 10000,
        },
      },
      { new: true }
    )
    if (user) {
      if (userInfoList[chatId]) {
        userInfoList[chatId].totalBalance += total + 10000;
        userInfoList[chatId].currBalance += total + 10000;
      }
      console.log(`Updated user ${chatId} currBalance:`, user?.currBalance)
      return res.status(200).json({
        state: true,
        userInfo: user,
        data: retVal,
      })
    }
    return res.status(200).json({
      state: false,
      data: null
    })
  } else {
    res.status(200).json({
      state: false,
      data: null,
    })
  }
})

export default router
