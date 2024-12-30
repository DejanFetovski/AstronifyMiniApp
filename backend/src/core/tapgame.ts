import * as database from '../database/db'
require('dotenv').config()
import { BalanceDocument, UserModel } from '../models/user.model'
import { ItemModel } from '../models/item.model'
import { LevelModel } from '../models/level.model'
import { TaskModel } from '../models/task.model'
import { getWebSocketClientList } from '../socket'

const GROUP_ID = 'RoyalGroup'
const CHANNEL_ID = 'RoyalChannel'

const INVITE_FROM_SCORE = 1000
const INVITE_TO_SCORE = 100
const ENERGY_DECREASE_AMOUNT = 1

export let scoreTempValue: { [key: string]: number } = {};
export let spinWheelInfo: { [key: string]: { count: number, timestamp: number } } = {};
export let userInfoList: { [key: string]: any } = {};
export let gameItemList: any[] = [];
export let gameLevels: any[] = [];
export let gameTasks: any[] = [];
export let autoEarningUsers: { chatId: string, time: number, online: boolean, offlineTimestamp: number, scoreOffline: number }[] = [];

export enum ScoreReasonType {
  SRT_INVITE = 0,
  SRT_INVITE_FROM,
  SRT_TAP_CLICK,
}

export enum PayType {
  PT_SALE = 0,
  PT_EARN,
}

export const appInit = async () => {
  // await loadItemList();
  // await loadLevels();
  // await loadAutoEarningUser();
  // await loadTasks();
  // scheduleDailyItem(0, 0);
  // scheduleEneryCharge();
  // scheduleDailySpin();
  // scheduleAutoEarn();
}

async function loadItemList() {
  const itemList = await ItemModel.find();
  gameItemList = [...itemList]
}

async function loadLevels() {
  const levels = await LevelModel.find();
  gameLevels = [...levels]
}

async function loadTasks() {
  const tasks = await TaskModel.find();
  gameTasks = [...tasks];
}

async function loadAutoEarningUser() {
  const autoEarnItem = gameItemList.find((_v, _i) => _v.title?.toLowerCase() == "Auto earn".toLowerCase());
  const users = await UserModel.find({ userItems: { $elemMatch: { id: autoEarnItem.id } } });
  users.forEach((user) => {
    let autoEarnUserInfo = {
      chatId: user.chatId,
      time: user.userItems.find((_v, _i) => _v.id == autoEarnItem.id)?.current!,
      online: false,
      offlineTimestamp: 0,
      scoreOffline: 0,
    }
    autoEarningUsers.push(autoEarnUserInfo);
  })
}

// TODO params the type of reward reason
export const getSuitableScore = async (type: ScoreReasonType) => {
  let result = 0
  switch (type) {
    case ScoreReasonType.SRT_INVITE: {
      result = 100
      break
    }
    case ScoreReasonType.SRT_INVITE_FROM: {
      result = 1000
      break
    }
    case ScoreReasonType.SRT_TAP_CLICK: {
      result = 20
      break
    }
  }
}

export const getTotalScore = async (
  balances: BalanceDocument[],
  isTotal: boolean
): Promise<number> => {
  let score = 0
  for (let i = 0; i < balances.length; i++) {
    let balance = balances[0]
    if (balance.type === PayType.PT_EARN) {
      score += balance.balance
    } else {
      if (!isTotal) score -= balance.balance
    }
  }
  return score
}

export async function findGame(chatId: string): Promise<any> {
  let user = await UserModel.findOne({ chatId: chatId })
  return user
}
// {
//   id: 5521963424,
//   first_name: "Gallant",
//   last_name: "Knight",
//   username: "GallantKnight",
//   language_code: "en",
// }
export async function findOrCreateGame(
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
    user = new UserModel({
      chatId: userInfo.id,
      metaInfo: metaInfo,
      energy: {
        levelId: 0,
        clickCost: 1,
        count: 2000,
        capacity: 2000,
        recoveryPerSecond: 1,
      },
      items: [],
      balances: [],
      setting: {
        lang: 0,
        animation: false,
        sound: true,
        music: true,
      },
      inviteCode: inviteCode,
      invitedFrom: invitedFrom,
    })
    await user.save()
    console.log('RES>>>>>>>>>>', user)
  }
  return user
}

async function increaseBalances(
  chatId: string,
  totalOffset: number,
  currOffset: number
) {
  try {
    await UserModel.findOneAndUpdate(
      { chatId: chatId },
      {
        $inc: {
          totalBalance: totalOffset,
          currBalance: currOffset,
          // 'energy.current': -currOffset,
        },
      },
      { new: true } // This option returns the modified document
    )

    if (userInfoList[chatId]) {
      userInfoList[chatId].totalBalance += totalOffset;
      userInfoList[chatId].currBalance += currOffset;
      // console.log('[Balances updated successfully]:', result);
      return userInfoList[chatId]
    } else {
      console.log('User not found')
      return null;
    }
  } catch (error) {
    console.error('Error updating balances:', error)
    return null;
  }
}

async function decreaseEnergy(
  chatId: string,
  offset: number
) {
  try {
    await UserModel.findOneAndUpdate(
      { chatId: chatId },
      {
        $inc: {
          'energy.current': -offset,
        },
      },
      { new: true } // This option returns the modified document
    )
    userInfoList[chatId].energy.current -= offset

    if (userInfoList[chatId]) {
      // console.log('[Balances updated successfully]:', result);
      return userInfoList[chatId]
    } else {
      console.log('User not found')
      return null;
    }
  } catch (error) {
    console.error('Error updating balances:', error)
    return null;
  }
}

export async function calcClickBalance(chatId: string) {
  const user = userInfoList[chatId];
  console.log("herrrrrrrrr", user);
  if (user?.energy.current! <= 0) return user;
  // Get offset
  const kingTapItem = gameItemList.find((_v, _i) => _v?.title?.toLowerCase() == "King tap".toLowerCase())
  const userKingTapItem = user?.userItems?.find((_v: any, _i: number) => _v?.id == kingTapItem?.id);
  const multiTapItem = gameItemList.find((_v, _i) => _v?.title?.toLowerCase() == "Multi tap".toLowerCase());
  const userMultiTapItem = user?.userItems?.find((_v: any, _i: number) => _v?.id == multiTapItem?.id);
  console.log(kingTapItem, userKingTapItem, multiTapItem, userMultiTapItem);
  // const user = await UserModel.findOne({ chatId });
  let offset = 1;
  if (userMultiTapItem) {
    offset += userMultiTapItem.current;
  }

  if (userKingTapItem && Date.now() - userKingTapItem.timestamp <= 30 * 1000) {
    offset = offset * 50;
  }
  console.log(offset);

  await calculateBalance(chatId, offset, offset);
  await decreaseEnergy(chatId, ENERGY_DECREASE_AMOUNT);
  return userInfoList[chatId]
}

export async function calculateBalance(
  chatId: string,
  currBalance: number,
  totalBalance: number
) {
  if (!userInfoList[chatId]) return 'The game does not exist'

  // const currLvl = await LevelModel.findOne({ id: user.levelId })
  // if (currLvl == null) {
  //   return 'The game does not exist'
  // }

  // let energy = user.energy
  // energy.current--
  let increasedData: any = await increaseBalances(
    chatId,
    currBalance,
    totalBalance
  )

  //Check user level-up state
  const levelupData = await checkUserLevel(chatId)
  if (levelupData != null) {
    console.log('>>>>>>>>>>CheckUser Level balance: ', levelupData)
    return levelupData
  } else {
    return increasedData
  }
}

export const checkRoyalTask = async (chatId: any) => {
  let xConnected = false,
    tgChannelConnected = false,
    tgGroupConnected = false,
    walletConnected = false

  // try {
  //   const botToken = process.env.BOT_TOKEN;
  //   const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=@${channelId}&user_id=${userId}`;
  //   const response = await fetch(url);
  //   const data: any = await response.json();

  //   if (data.ok) {
  //     const status = data.result.status;
  //     if (status === 'member' || status === 'administrator' || status === 'creator') {
  //       console.log('User is subscribed to the channel.');
  //       return { state: true, message: "Success" };
  //     } else {
  //       return { state: false, message: "Please complete the task" };
  //     }
  //   } else {
  //     return { state: false, message: "Failed to get information of channel" };
  //   }
  // } catch (error) {
  //   return { state: false, message: "Internal server error" };
  // }
  

  return { xConnected, tgChannelConnected, tgGroupConnected, walletConnected }
}

export const getTime = async () => {
  // function secondsDifferenceFromMidnightUTC(): number {
  // Get the current time in UTC
  let now: Date = new Date()
  let currentUTC: Date = new Date(now.toUTCString().slice(0, -4))

  // Create a Date object for 12:00 AM (midnight) UTC
  let midnightUTC: Date = new Date(
    Date.UTC(
      currentUTC.getUTCFullYear(),
      currentUTC.getUTCMonth(),
      currentUTC.getUTCDate(),
      0,
      0,
      0
    )
  )

  // Calculate the difference in milliseconds
  let difference: number = currentUTC.getTime() - midnightUTC.getTime()

  // Convert the difference to seconds
  let secondsDifference: number = Math.floor(difference / 1000)

  return secondsDifference
}

// Reset Daily Item,
export const resetDaily = async () => {
  // Update daily items on UserItems
  await resetUserItem()
}

async function resetUserItem() {
  // Step 1: Fetch all item IDs from ItemModel where type is "daily"
  const dailyItems = await ItemModel.find({ type: 'Daily' }, 'id')
  const dailyItemIds = dailyItems.map((item) => item.id)

  console.log('>>>>>>>>>>>>>>>>>', dailyItemIds, dailyItems)

  // Step 2: Update UserModel to remove items with these IDs from userItems
  const result = await UserModel.updateMany(
    { 'userItems.id': { $in: dailyItemIds } }, // Match documents with userItems containing daily item IDs
    { $pull: { userItems: { id: { $in: dailyItemIds } } } }, // Remove matching items from userItems
    { multi: true }
  )

  const clientList = getWebSocketClientList();
  clientList.forEach(async (client) => {
    const chatId = client.user!;
    userInfoList[chatId] = { ...(await UserModel.findOne({ chatId: chatId })) }
  })
}

// Function to run the daily item
async function dailyItem(): Promise<any> {
  console.log('Running daily item at:', new Date().toISOString())

  // Add your task logic here
  await resetDaily()
}

// Function to calculate the initial delay in milliseconds until the next target time
function calculateInitialDelay(
  targetHour: number,
  targetMinute: number
): number {
  const now = new Date()
  const targetTime = new Date()

  targetTime.setUTCHours(targetHour)
  targetTime.setUTCMinutes(targetMinute)
  targetTime.setUTCSeconds(0)
  targetTime.setUTCMilliseconds(0)

  if (targetTime < now) {
    targetTime.setUTCDate(targetTime.getUTCDate() + 1) // Schedule for the next day if the time has already passed today
  }

  return targetTime.getTime() - now.getTime()
}

// Function to schedule the daily item
export function scheduleDailyItem(
  targetHour: number,
  targetMinute: number
): void {
  const initialDelay = calculateInitialDelay(targetHour, targetMinute)

  setTimeout(async () => {
    await dailyItem()
    setInterval(dailyItem, 24 * 60 * 60 * 1000) // Run the task every 24 hours
  }, initialDelay)
}

export function scheduleDailySpin(): void {
  setInterval(emitSpinRemainingTime, 1 * 1000) // Run the task every 24 hours
}

export function scheduleEneryCharge(): void {
  setInterval(autoEnergyCharge, 5 * 1000) // Run the task every 24 hours
}

function scheduleAutoEarn() {
  setInterval(() => {
    autoEarningUsers.forEach((autoEarnInfo) => {
      if (!autoEarnInfo.offlineTimestamp && !autoEarnInfo.online) {
        if (Date.now() - autoEarnInfo.offlineTimestamp <= autoEarnInfo.time * 3600 * 1000) {
          autoEarnInfo.scoreOffline += 1;
        }
      }
    })
  }, 1 * 1000)
}
// Generate Invite code and save
const generateInviteCode = (chatId: string) => {
  return `https://t.me/${process.env.BOT_USERNAME}?start=kentId${chatId}`

}
async function checkUserLevel(chatId: string) {
  try {
    // Fetch the user by chatId
    const user = userInfoList[chatId]

    if (!user) {
      return null
    }

    let { currBalance, levelId } = user
    let currLevelId = levelId

    for (const level of gameLevels.reverse()) {
      // console.log(`Current Balance: ${currBalance} ThreadHold: ${level.threshold}`)
      if (currBalance >= level.threshold) {
        if (level.id <= currLevelId) {
          //
        } else {
          currLevelId += 1
          break
        }
      } else {
        continue
      }
    }

    // Update the user's level if it has changed
    if (user.levelId !== currLevelId) {
      user.levelId = currLevelId
      console.log(`>>>>>>>>>User level updated to ${currLevelId}`)
      await UserModel.findOneAndUpdate(
        { chatId: chatId },
        { levelId: currLevelId },
        { new: true }
      )
      return user
    } else {
      // console.log('User level remains the same');
      return null
    }
  } catch (error) {
    console.error('Error updating user level:', error)
    return null
  }
}

async function autoEnergyCharge() {
  // console.log("Auto Eneregy charged....")
  try {
    // Energy increase
    await UserModel.updateMany(
      { $expr: { $ne: ['$energy.current', '$energy.capacity'] } },
      [
        {
          $set: {
            'energy.current': {
              $min: [
                { $add: ['$energy.current', '$energy.recoveryPerSecond'] },
                '$energy.capacity',
              ],
            },
          },
        },
      ]
    )
    const clients = getWebSocketClientList()
    clients.forEach((socket) => {
      // const chatId = socket.user
      // UserModel.findOne({ chatId: chatId }).then((res) => {
      //   if (Number(res?.energy.current) <= Number(res?.energy.capacity)) {
      //     socket.emit('ENERGY_INCREASE', JSON.stringify(res))
      //     // console.log('ENERGY_INCREASE sent  successfully');
      //   }
      // })
      const chatId = socket.user
      if (userInfoList[chatId!]?.energy) {
        let current_energy = userInfoList[chatId!].energy.current;
        let inc_per_sec = userInfoList[chatId!].energy.recoveryPerSecond;
        let capacity = userInfoList[chatId!].energy.capacity;
        userInfoList[chatId!].energy.current = (current_energy + inc_per_sec) >= capacity ? capacity : (current_energy + inc_per_sec);
        socket.emit('ENERGY_INCREASE', JSON.stringify(userInfoList[chatId!]))
      }
    })
  } catch (error) {
    console.error('Error updating energy values:', error)
  }
}

async function emitSpinRemainingTime() {
  // console.log("Auto Eneregy charged....")
  try {
    const clients = getWebSocketClientList()
    clients.forEach((socket) => {
      const chatId = socket.user
      if (!chatId) return;
      UserModel.findOne({ chatId: chatId }).then((user) => {
        ItemModel.findOne({ title: 'Spin limit' }).then((spinItem) => {
          const userSpinItem = user?.userItems?.find((_v, _i) => _v?.id == spinItem?.id);
          const current = { ...spinWheelInfo[chatId] };
          if (userSpinItem) {
            if (current.count < userSpinItem.current + 1) {
              socket.emit('SPIN_REMAIN', 0);
            } else if (current.timestamp < Date.now() - 24 * 3600 * 1000) {
              socket.emit('SPIN_REMAIN', 0);
            } else {
              socket.emit('SPIN_REMAIN', 24 * 3600 * 1000 - (Date.now() - current.timestamp));
            }
          } else {
            if (current.count < 1) {
              socket.emit('SPIN_REMAIN', 0);
            } else if (current.timestamp < Date.now() - 24 * 3600 * 1000) {
              socket.emit('SPIN_REMAIN', 0);
            } else {
              socket.emit('SPIN_REMAIN', 24 * 3600 * 1000 - (Date.now() - current.timestamp));
            }
          }
        })
      })
    })
  } catch (error) {
    console.error('Error updating energy values:', error)
  }
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
