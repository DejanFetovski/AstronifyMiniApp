import { Schema, model, Document } from 'mongoose'
// UserInfo -------------------------------------------------------------
export interface UserInfoDocument extends Document {
  firstName: string
  lastName: string
  userName: string
  logo: string
  allowWithPm?: boolean
}
// Define the schema corresponding to the document interface
// const userMetaInfoSchema = new Schema<UserInfoDocument>({
//   firstName: {
//     type: String,
//   },
//   lastName: {
//     type: String,
//   },
//   userName: {
//     type: String,
//   },
//   logo: {
//     type: String,
//   },
//   allowWithPm: {
//     type: Boolean,
//     default: true,
//   },
// })
// -----------------------------------------------------------------------
 

// User Setting------------------------------------------------------
interface SettingDocument extends Document {
  question1: number
  question2: number
  question3: number
  pfName: string 
  birth: Date
  birthTime: string
  country: string
  state: string
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
  state: {
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
