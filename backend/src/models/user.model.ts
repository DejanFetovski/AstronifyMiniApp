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
 

// User Setting------------------------------------------------------
interface SettingDocument extends Document {
  question1: string
  question2: string
  question3: string
  pfName: string 
  birth: Date
  sex: string
}

const settingSchema = new Schema<SettingDocument>({
  question1: {
    type: String,
    default: ''
  },
  question2: {
    type: String,
    default: ''
  },
  question3: {
    type: String,
    default: ''
  },
  pfName: {
    type: String,
    default: '',
  },
  birth: {
    type: Date,
    default: Date.now,
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
