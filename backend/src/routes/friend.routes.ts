import express from 'express'
import { UserModel } from '../models/user.model'
import { TaskModel } from '../models/task.model'
import { verifyToken } from '../middleware'

// Game SDK
import { calculateBalance, userInfoList } from '../core/tapgame'
const router = express.Router()

// Get referrals on user
router.get('/', verifyToken, async (req, res) => {
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

export default router
