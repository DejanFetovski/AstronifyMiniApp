import { Schema, model, Document } from 'mongoose'
import { ItemDocument, itemSchema } from './item.model'

export interface BalanceDocument extends Document {
  type: number // 1/0 1: in, 0: out
  balance: number
  timestamp: Date
  reason: string
}

// Define the schema corresponding to the document interface
const balanceSchema = new Schema<BalanceDocument>({
  type: {
    type: Number,
    default: 1,
  },
  balance: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  reason: {
    type: String,
    default: 'tap score',
  },
})

export interface EnergyDocument extends Document {
  levelId: number
  clickCost: number
  current: number
  capacity: number
  recoveryPerSecond: number
}

// Define the schema corresponding to the document interface
export const energySchema = new Schema<EnergyDocument>({
  levelId: {
    type: Number,
    required: true,
    default: 0,
  },
  clickCost: {
    type: Number,
    default: 1,
    required: true,
  },
  current: {
    type: Number,
    default: 2000,
    required: true,
  },
  capacity: {
    type: Number,
    default: 2000,
    required: true,
  },
  recoveryPerSecond: {
    type: Number,
    default: 1,
    required: true,
  },
})

// UserInfo -------------------------------------------------------------
export interface UserInfoDocument extends Document {
  firstName: string
  lastName: string
  userName: string
  logo: string
  allowWithPm?: boolean
}
// Define the schema corresponding to the document interface
const userMetaInfoSchema = new Schema<UserInfoDocument>({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  logo: {
    type: String,
  },
  allowWithPm: {
    type: Boolean,
    default: true,
  },
})
// -----------------------------------------------------------------------

interface DailyGameTaskDocument extends Document {
  taskId: number
  checkedType: string // NONE, CLASSIC, PREMIUM
  timestamp: number
}

const dailyGameTaskSchema = new Schema<DailyGameTaskDocument>({
  taskId: {
    type: Number,
    default: 0,
    required: true,
  },
  checkedType: {
    type: String,
    required: true,
    default: 'CLASSIC',
  },
  timestamp: {
    type: Number,
    required: true,
    default: 0
  }
})

export const DailyGameTask = model<DailyGameTaskDocument>(
  'DailyGameTask',
  dailyGameTaskSchema
)

export interface UserTaskDocument extends Document {
  taskId: number
  isJoined: boolean
  isClaimed: boolean
}

const userTaskSchema = new Schema<UserTaskDocument>({
  id: {
    type: Number,
    required: true,
    default: 0,
  },
  isJoined: {
    type: Boolean,
    default: false,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
})

// User Setting------------------------------------------------------
interface SettingDocument extends Document {
  lang: number
  animation: boolean
  sound: boolean
  music: boolean
}

const settingSchema = new Schema<SettingDocument>({
  lang: {
    type: Number,
    required: true,
    default: 0,
  },
  animation: {
    type: Boolean,
    default: true,
  },
  sound: {
    type: Boolean,
    default: true,
  },
  music: {
    type: Boolean,
    default: true,
  },
})
// -------------------------------------------------------------------

export const UserTask = model<UserTaskDocument>('GameTask', userTaskSchema)

// User Item Document-----------------------------------
export interface UserItemDocument extends Document {
  id: number
  current: number
  timestamp: number
}

const userItemSchema = new Schema<UserItemDocument>({
  id: {
    type: Number,
    required: true,
  },
  current: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  }
})
// -----------------------------------------------------

// Define an interface representing a document in MongoDB
export interface UserDocument extends Document {
  chatId: string
  metaInfo: UserInfoDocument
  levelId: number
  energy: EnergyDocument
  userItems: UserItemDocument[]
  userTasks: UserTaskDocument[]
  dailyTasks: DailyGameTaskDocument
  currBalance: number
  totalBalance: number
  setting: SettingDocument
  inviteCode: string
  invitedFrom: string
}

// Define the schema corresponding to the document interface
const userSchema = new Schema<UserDocument>({
  chatId: {
    type: String,
    required: true,
  },
  metaInfo: userMetaInfoSchema,
  levelId: {
    type: Number,
    required: true,
    default: 1,
  },
  energy: {
    type: energySchema,
  },
  userItems: {
    type: [userItemSchema],
    default: [],
  },
  userTasks: {
    type: [userTaskSchema],
    default: [],
  },
  dailyTasks: {
    type: dailyGameTaskSchema,
    default: {
      taskId: 1,
      checkedType: "CLASSIC",
      timestamp: 0
    },
  },
  currBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  totalBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  setting: {
    type: settingSchema,
    required: true,
  },
  inviteCode: {
    type: String,
    default: '',
  },
  invitedFrom: {
    type: String,
    default: '',
  },
})

// Create a Model
export const UserModel = model<UserDocument>('User', userSchema)
