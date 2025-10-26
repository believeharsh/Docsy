import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  totalPages: number;
  status: 'processing' | 'completed' | 'failed';
  cloudinaryUrl?: string; 
  uploadedAt: Date;
  processedAt?: Date;
  vectorIds?: string[];
}

const documentSchema = new Schema<IDocument>({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing',
  },
  cloudinaryUrl: {
    type: String, // Add this field
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  vectorIds: [{
    type: String,
  }],
});

const Document = mongoose.model<IDocument>('Document', documentSchema);

export default Document;