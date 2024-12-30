import { Schema, model, Document } from 'mongoose';

// Define an interface representing a document in MongoDB
export interface PresetDocument extends Document {
  key:string,
  value:any
}

// Define the schema corresponding to the document interface
export const PresetSchema = new Schema<PresetDocument>({
  key: {
    type: String
  },
  value: {
    type: Object
  },
});

// Create a Model
export const PresetModel = model<PresetDocument>('Preset', PresetSchema);