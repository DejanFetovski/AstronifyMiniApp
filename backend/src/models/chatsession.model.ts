import { Schema, model, Document } from 'mongoose'
 
// Define an interface representing a document in MongoDB
export interface ChatSessionDocument extends Document {
    chatId: string
    categoryId: number
    role: string
    content: string
}

// Define the schema corresponding to the document interface
const chatSessionSchema = new Schema<ChatSessionDocument>({
    chatId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'user'
    },
    content: {
        type: String,
        default: ''
    }
})

// Create a Model
export const ChatSessionModel = model<ChatSessionDocument>('ChatSession', chatSessionSchema)
