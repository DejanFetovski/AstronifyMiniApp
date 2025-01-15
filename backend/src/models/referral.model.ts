import { Schema, model, Document } from 'mongoose'
 
// Define an interface representing a document in MongoDB
export interface ReferralDocument extends Document {
    inviterId: string
    userId: string
    userFirstName: string
    userLastName: string
    userName: string
    state: Boolean // True: accepted, False: pending
}

// Define the schema corresponding to the document interface
const referralSchema = new Schema<ReferralDocument>({
    inviterId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userFirstName: {
        type: String,
        default: ''
    },
    userLastName: {
        type: String,
        default: ''
    },
    userName:{
        type: String,
        required: true,
    },
    state: {
        type: Boolean,
        default: false
    },
})

// Create a Model
export const ReferralModel = model<ReferralDocument>('Referral', referralSchema)
