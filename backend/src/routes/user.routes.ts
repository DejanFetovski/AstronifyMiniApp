import express from 'express'
import dotenv from 'dotenv'
import cron from 'node-cron';

import { UserModel } from '../models/user.model'
import { ReferralModel } from '../models/referral.model'
import { verifyToken } from '../middleware'
import { TaskModel } from '../models/task.model'

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

router.post('/update_task', verifyToken, async (req, res) => {
  console.log(`user.route.ts - update task`)
  try {
    const { chatId } = req.body.user;
    const { point, taskId, isAccomplish } = req.body

    // Get Default Task data
    // const default = await TaskModel.find({});
    // let response: any = await axios.get(
    //   `${API_BASE_URL}/api/task`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json", // Ensure proper content type
    //     },
    //   }
    // );

    // if (response.status !== 200)
    //   return
    const taskData = await TaskModel.find({})
    console.log("TaskData................", taskData)
    const matchedTaskData = taskData.filter((task) => task.id == taskId);
    console.log("TaskData................", matchedTaskData)


    const user = await UserModel.findOne({ chatId: chatId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("----------------------------", taskId, isAccomplish)

    // Find and update the specific task
    const task = user.tasks.find(task => task.taskId === taskId);
    if (task) {
      task.isAccomplish = isAccomplish;

      if (matchedTaskData != null && matchedTaskData[0] != null) {
        user.point += matchedTaskData[0].points;
      }

    } else {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedUser = await user.save();
    return res.status(200).json({ data: updatedUser });

  } catch (error) {
    res.status(500).end()
  }
})


router.get('/referral', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.body.user;
    const referrals = await ReferralModel.find({ inviterId: chatId })
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

cron.schedule('0 0 * * *', async () => {
// cron.schedule('* * * * *', async () => {
  try {
    const result = await UserModel.updateMany({}, { $set: { point: 10000 } });
    console.log(`Reset points for ${result.modifiedCount} users at UTC+0`);
  } catch (error) {
    console.error("Error resetting points:", error);
  }
});

export default router
