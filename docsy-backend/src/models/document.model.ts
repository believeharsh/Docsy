// src/models/Document.ts
import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IDocument extends MongooseDocument {
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  totalPages: number;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  vectorIds: string[];
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
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  processedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'completed', 'failed'],
    default: 'uploading',
  },
  vectorIds: [{
    type: String,
  }],
});

const Document = mongoose.model<IDocument>('Document', documentSchema);

export default Document;