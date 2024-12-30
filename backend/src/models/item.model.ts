import { Schema, model, Document, trusted } from 'mongoose'

// Define an interface representing a document in MongoDB
export interface ItemDailyDocument extends Document {
  count: number
  price: number
}

export const itemDailySchema = new Schema<ItemDailyDocument>({
  count: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
})

export interface ItemLevelDocument extends Document {
  id: number
  title: string
  price: number
}
export const itemLevelSchema = new Schema<ItemLevelDocument>({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
})

export interface ItemDocument extends Document {
  title: string
  type: string
  logo: string
  itemLevel: ItemLevelDocument[] // Royal Item
  itemDaily: ItemDailyDocument
  isDeleted: boolean
}

// Define the schema corresponding to the document interface
export const itemSchema = new Schema<ItemDocument>({
  id: {
    type: Number,
    required: trusted,
  },
  title: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  itemLevel: {
    // This is for levels in items
    type: [itemLevelSchema],
    default: null,
  },
  itemDaily: {
    // This is for daily booster item, available items
    type: itemDailySchema,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

// Create a Model
export const ItemModel = model<ItemDocument>('Item', itemSchema)
