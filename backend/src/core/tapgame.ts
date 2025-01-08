require('dotenv').config()
import { UserModel } from '../models/user.model'

export let scoreTempValue: { [key: string]: number } = {};
export let spinWheelInfo: { [key: string]: { count: number, timestamp: number } } = {};
export let userInfoList: { [key: string]: any } = {};
export let gameItemList: any[] = [];
export let gameLevels: any[] = [];
export let gameTasks: any[] = [];
export let autoEarningUsers: { chatId: string, time: number, online: boolean, offlineTimestamp: number, scoreOffline: number }[] = [];

export const appInit = async () => {

}

export async function findUser(chatId: string): Promise<any> {
  let user = await UserModel.findOne({ chatId: chatId })
  return user
}

export async function findOrCreateUser(
  userInfo: any,
  invitedFrom: string = ''
): Promise<any> {
  console.log('>>>>>>>>>>>>>>>>>>>>>', invitedFrom)
  let user = await UserModel.findOne({ chatId: userInfo.id })

  if (user == null || user == undefined) {
    console.log('>>>>>>>>User register...')

    // create new user item
    let metaInfo = {
      firstName: userInfo.first_name,
      lastName: userInfo.last_name,
      userName: userInfo.username,
      logo: 'logo.png',
    }

    const inviteCode = generateInviteCode(userInfo.id)
    
    const userData: any = {
      chatId: '1234567890', // Example chatId
      setting: {
        question1: 'What is your favorite color?',
        question2: 'What is your favorite food?',
        question3: 'What is your favorite movie?',
        pfName: 'JohnDoe',
        birth: new Date('1990-01-01'),
        sex: 'male',
      },
      point: 0,
      isFirstLogin: true,
    };

    // Create a new user instance
    const user = new UserModel(userData);

    // Save the user to the database
    await user.save();

    // Save to friend table


  }
  return user
}
 
// Generate Invite code and save
const generateInviteCode = (chatId: string) => {
  return `https://t.me/${process.env.BOT_USERNAME}?start=kentId${chatId}`
}

// export async function addReferral(
//   inviterChatId: string,
//   referralChatId: string
// ) {
//   try {
//     const exist = await UserModel.findOne({ chatId: inviterChatId })
//     if (exist) {
//       const referral = {
//         chatId: referralChatId,
//         logo: '',
//         name: '',
//         isAccept: true,
//         senderLevel: exist?.levelId,
//         score: 0,
//       }

//       const result = await UserModel.findOneAndUpdate(
//         { chatId: inviterChatId },
//         { $push: { referrals: referral } },
//         { new: true, upsert: true } // upsert: true will create the document if it doesn't exist
//       ).exec()
//       if (!result) {
//         console.log(
//           `User with chatId ${inviterChatId} or referral with chatId ${referralChatId} not found.`
//         )
//         return null
//       }
//       return result
//     }

//     return null
//   } catch (error) {
//     console.error(
//       `Error updating referral isAccepted for user with chatId ${inviterChatId}:`,
//       error
//     )
//     throw error
//   }
// }
