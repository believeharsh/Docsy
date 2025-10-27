import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import Document from '../models/document.model.js';
import { extractTextFromPDF, chunkTextByPage } from '../services/pdfService.js';
import { generateEmbeddings } from '../services/embeddingService.js';
import { getPineconeIndex } from '../configs/pinecone.js';
import { PineconeVector } from '../types/index.js';

const uploadRoutes = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USE_CLOUDINARY = process.env.NODE_ENV === 'production';

// Configure Cloudinary (if in production)
if (USE_CLOUDINARY) {
  console.log('📦 Configuring Cloudinary for production');
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Use memory storage - works for both dev and prod
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Upload PDF endpoint
uploadRoutes.post('/', upload.single('pdf'), async (req: Request, res: Response): Promise<any> => {
  let tempFilePath: string | null = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📄 Processing PDF:', req.file.originalname);

    // 1. Write buffer to temp file for processing
    const tmpDir = os.tmpdir();
    tempFilePath = path.join(tmpDir, `${Date.now()}-${req.file.originalname}`);
    fs.writeFileSync(tempFilePath, req.file.buffer);
    
    console.log('📝 Temp file created:', tempFilePath);
    console.log('📊 File size:', req.file.buffer.length, 'bytes');

    // 2. Extract text from PDF
    const { text, numPages } = await extractTextFromPDF(tempFilePath);
    console.log(`📖 Extracted ${numPages} pages`);

    // 3. Upload to Cloudinary if production
    let cloudinaryUrl: string | undefined;
    
    if (USE_CLOUDINARY) {
      console.log('☁️  Uploading to Cloudinary...');
      
      const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
        folder: 'docsy-pdfs',
        resource_type: 'raw',
        public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, '')}`,
      });
      
      cloudinaryUrl = uploadResult.secure_url;
      console.log('✅ Uploaded to Cloudinary:', cloudinaryUrl);
    }

    // 4. Create document record
    const document = new Document({
      filename: req.file.originalname,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      totalPages: numPages,
      status: 'processing',
      cloudinaryUrl: cloudinaryUrl,
    });
    await document.save();

    const documentId = (document._id as Types.ObjectId).toString();

    // 5. Chunk text by page
    const chunks = chunkTextByPage(text, numPages);
    console.log(`✂️  Created ${chunks.length} chunks`);

    // 6. Generate embeddings for chunks
    console.log('🧠 Generating embeddings...');
    const embeddings = await generateEmbeddings(chunks.map(c => c.text));

    // 7. Store in Pinecone
    console.log('💾 Storing in Pinecone...');
    const index = getPineconeIndex();
    const vectors: PineconeVector[] = chunks.map((chunk, idx) => ({
      id: `${documentId}_page_${chunk.pageNumber}`,
      values: embeddings[idx],
      metadata: {
        documentId: documentId,
        pageNumber: chunk.pageNumber,
        text: chunk.text.substring(0, 1000),
        filename: document.originalName,
      },
    }));

    await index.upsert(vectors as any);

    // 8. Update document status
    document.status = 'completed';
    document.processedAt = new Date();
    document.vectorIds = vectors.map(v => v.id);
    await document.save();

    // 9. Cleanup temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
      console.log('🗑️  Cleaned up temp file');
    }

    console.log('✅ Document processed successfully!');

    res.json({
      success: true,
      document: {
        id: documentId,
        filename: document.filename,
        originalName: document.originalName,
        totalPages: document.totalPages,
        status: document.status,
        pdfUrl: cloudinaryUrl,
      },
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
    
    // Cleanup temp file on error
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        console.error('Error cleaning up temp file:', e);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to process PDF',
      details: error.message 
    });
  }
});

// Get document by ID
uploadRoutes.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      id: (document._id as Types.ObjectId).toString(),
      filename: document.originalName,
      totalPages: document.totalPages,
      status: document.status,
      uploadedAt: document.uploadedAt,
      pdfUrl: document.cloudinaryUrl,
    });
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Serve PDF file
uploadRoutes.get('/file/:filename', async (req: Request, res: Response): Promise<any> => {
  try {
    // Find document by filename
    const document = await Document.findOne({ originalName: req.params.filename });
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    if (document.cloudinaryUrl) {
      // Redirect to Cloudinary URL
      res.redirect(document.cloudinaryUrl);
    } else {
      return res.status(404).json({ error: 'PDF URL not found' });
    }
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
});

export default uploadRoutes;