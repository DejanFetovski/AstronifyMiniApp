import { Schema, model, Document } from 'mongoose'

// Define an interface representing a document in MongoDB
export interface LangDocument extends Document {
  id: number
  language: string
}

// Define the schema corresponding to the document interface
const langSchema = new Schema<LangDocument>({
  id: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
    default: 'English',
  },
})

// Create a Model
export const LangModel = model<LangDocument>('Lang', langSchema)
