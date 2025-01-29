require('dotenv').config()
import { UserModel } from '../models/user.model'
import { ReferralModel } from '../models/referral.model';
import { TaskModel } from '../models/task.model';

export const appInit = async () => {
  console.log("Checking necessary database...");

  const tasks = await TaskModel.find({});

  if (tasks == null || tasks.length == 0) {
    const data = [
      {
        title: "Daily login bonus",
        points: 500,
      },
      {
        title: "Engage with AI Agent - 2 Prompts",
        points: 1200,
      },
      {
        title: "Get your daily horoscope reading",
        points: 750,
      },
      {
        title: "Invite 1 friend",
        points: 1200,
      },
    ];

    try {
      // Generate incremental id manually (if needed)
      const existingCount = await TaskModel.countDocuments();

      const tasksWithIds = data.map((task, index) => ({
        id: existingCount + index + 1, // Auto-increment id
        ...task,
      }));

      // Insert all tasks in one go
      await TaskModel.insertMany(tasksWithIds);

      console.log("Tasks saved successfully!");
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }
}

export async function findUser(chatId: string): Promise<any> {
  let user = await UserModel.findOne({ chatId: chatId })
  return user
}

export async function createUser(userInfo: any, avatar: string): Promise<any> {
  const taskModel: any = await TaskModel.find({});

  const tasks = taskModel.map((task : any)=> ({
    taskId: task.id,
    isAccomplish: false
  }));

  const userData: any = {
    chatId: userInfo?.id, // Example chatId
    avatar: avatar,
    setting: {
      question1: 0,
      question2: 0,
      question3: 0,
      pfName: null,
      birth: null,
      sex: 'male',
    },
    tasks: tasks,
    isFirstLogin: true,
  };

  // Create a new user instance
  const user = new UserModel(userData);

  // Save the user to the database
  await user.save();
}

export async function findOrCreateUser(
  userInfo: any,
  avatar: string = ''
): Promise<any> {
  let user = await UserModel.findOne({ chatId: userInfo.id })

  if (user == null || user == undefined) {

    const userData: any = {
      chatId: userInfo.id, // Example chatId
      avatar: avatar,
      setting: {
        question1: 0,
        question2: 0,
        question3: 0,
        pfName: null,
        birth: null,
        sex: 'male',
      },
      isFirstLogin: true,
    };

    // Create a new user instance
    const user = new UserModel(userData);

    // Save the user to the database
    await user.save();
    return null;
    // Save to friend table


  }
  return user
}

export async function saveReferral(
  userInfo: any,
  invitedFrom: string = ''
): Promise<any> {

  const referralData: any = {
    inviterId: invitedFrom, // Example chatId
    userId: userInfo.id,
    userFirstName: userInfo.first_name,
    userLastName: userInfo.last_name,
    userName: userInfo.username,
    state: true,
  };

  const referral = new ReferralModel(referralData);

  // Set user task field
  if (referral != null) {
    try {
      const chatId = invitedFrom;
      const taskData = await TaskModel.find({})
      console.log("TaskData................", taskData)
      const matchedTaskData = taskData.filter((task) => task.id == 4);
      console.log("TaskData................", matchedTaskData)


      const user = await UserModel.findOne({ chatId: chatId });
      if (!user) {
        console.log(`User not found : ${chatId}`)
      } else {
        // Find and update the specific task
        const task = user.tasks.find(task => task.taskId === 4);
        if (task) {
          task.isAccomplish = true;

          if (matchedTaskData != null && matchedTaskData[0] != null) {
            user.point += matchedTaskData[0].points;
          }
          const updatedUser = await user.save();

        } else {
          console.log("Task is not found")
        }
      }
    } catch (error) {
      console.log("Update Task in UserTable is failed", error)
    }
  }

  // Save the referral data to the database
  return await referral.save();
}