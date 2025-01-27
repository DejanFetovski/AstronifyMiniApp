import { Schema, model, Document } from 'mongoose'

// Define an interface representing a document in MongoDB
export interface TaskDocument extends Document {
  id: number
  title: string
  points: number
  desc?: string
}

// Define the schema corresponding to the document interface
export const taskSchema = new Schema<TaskDocument>({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  }
})

// Create a Model
export const TaskModel = model<TaskDocument>('Task', taskSchema)
