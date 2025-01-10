import { Schema, model, Document } from 'mongoose'
 
// Define an interface representing a document in MongoDB
export interface ReferralDocument extends Document {
    inviterId: string
    friendId: string
    state: Boolean // True: accepted, False: pending
}

// Define the schema corresponding to the document interface
const referralSchema = new Schema<ReferralDocument>({
    inviterId: {
        type: String,
        required: true,
    },
    friendId: {
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
