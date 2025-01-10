require('dotenv').config()
import { UserModel } from '../models/user.model'
import { ReferralModel } from '../models/referral.model';

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

    const userData: any = {
      chatId: userInfo.id, // Example chatId
      setting: {
        question1: 0,
        question2: 0,
        question3: 0,
        pfName: null,
        birth: null,
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

export async function saveReferral(
  userInfo: any,
  invitedFrom: string = ''
): Promise<any> {

  const referralData: any = {
    inviterId: invitedFrom, // Example chatId
    userId: userInfo.id,
    state: true,
  };

  const referral = new ReferralModel(referralData);
  // Save the referral data to the database
  await referral.save();
}