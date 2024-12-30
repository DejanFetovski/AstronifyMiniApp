import { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB
export interface DailyTaskDocument extends Document {
  taskId: number;
  classicReward: number;
  premiumReward: number;
}

// Define the schema corresponding to the document interface
export const dailyTaskSchema = new Schema<DailyTaskDocument>({
  taskId: {
    type: Number,
    default: 0,
    required: true,
  },
  classicReward: {
    type: Number,
    required: true,
  },
  premiumReward: {
    type: Number,
    required: true,
  },
});

// Create a Model
export const DailyTaskModel = model<DailyTaskDocument>('DailyTask', dailyTaskSchema);