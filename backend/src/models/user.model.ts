import { Schema, model, Document } from 'mongoose'
// UserInfo -------------------------------------------------------------
export interface UserInfoDocument extends Document {
  firstName: string
  lastName: string
  userName: string
  logo: string
  allowWithPm?: boolean
}

//Zodiac Data
interface ZodiacDocument extends Document {
  sunSign: string
  moonSign: string
  risingSign: string
  element: string 
  luckyNo: number
  chineseZodiac: string
}

const ZodiaSchema = new Schema<ZodiacDocument>({
  sunSign: {
    type: String,
    default: null,
  },
  moonSign: {
    type: String,
    default: null,
  },
  risingSign: {
    type: String,
    default: null,
  },
  element: {
    type: String,
    default: null,
  },
  luckyNo: {
    type: Number,
    default: 0,
  },
  chineseZodiac: {
    type: String,
    default: null,
  }
})

// User Setting------------------------------------------------------
interface SettingDocument extends Document {
  question1: number
  question2: number
  question3: number
  pfName: string 
  birth: Date
  birthTime: string
  country: string
  location: string
  timeZoneId: string
  sex: string
}

const settingSchema = new Schema<SettingDocument>({
  question1: {
    type: Number,
    default: 0
  },
  question2: {
    type: Number,
    default: 0
  },
  question3: {
    type: Number,
    default: 0
  },
  pfName: {
    type: String,
    default: '',
  },
  birth: {
    type: Date,
    default: Date.now,
  },
  birthTime: {
    type: String,
    default: '00:00',
  },
  country: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  timeZoneId: {
    type: String,
    default: '',
  },
  sex: {
    type: String,
    default: 'male',
  }
})
// -------------------------------------------------------------------

// Define an interface representing a document in MongoDB
export interface UserDocument extends Document {
  chatId: string
  avatar: string
  setting: SettingDocument
  zodiac: ZodiacDocument
  point: number
  isFirstLogin: Boolean
}

// Define the schema corresponding to the document interface
const userSchema = new Schema<UserDocument>({
  chatId: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "default.png",
  },
  setting: settingSchema,
  zodiac: ZodiaSchema,
  point: {
    type: Number,
    default: 0,
  },
  isFirstLogin: {
    type: Boolean,
    default: true
  },
})

// Create a Model
export const UserModel = model<UserDocument>('User', userSchema)
