import mongoose from 'mongoose'
import * as C from '../utils/constant'

export const init = async (): Promise<void> => {
  console.log('Connecting to MongoDB')
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('connected to MongoDB')
  } catch (error) {
    console.error('error connecting to MongoDB:', (error as Error).message)
    throw new Error('MongoDB connection failed')
  }
}
