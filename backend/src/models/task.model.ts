import { Schema, model, Document } from 'mongoose'

// Define an interface representing a document in MongoDB
export interface TaskDocument extends Document {
  id: number
  type: string
  title: string
  logo: string
  reward: number
  social: string
}

// Define the schema corresponding to the document interface
export const taskSchema = new Schema<TaskDocument>({
  id: {
    type: Number,
    default: 0,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: 'Royal',
  },
  title: {
    type: String,
    required: true,
    default: 'Royal reward',
  },
  logo: {
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
    default: 10000,
  },
  social: {
    type: String,
    required: true,
    default: null,
  }
})

// Create a Model
export const TaskModel = model<TaskDocument>('Task', taskSchema)
