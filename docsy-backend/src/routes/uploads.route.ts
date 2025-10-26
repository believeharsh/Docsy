// src/routes/upload.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Document from '../models/document.model';
import { extractTextFromPDF, chunkTextByPage } from '../services/pdfService';
import { generateEmbeddings } from '../services/embeddingService';
import { getPineconeIndex } from '../configs/pinecone';
import { PineconeVector } from '../types/index.js';

const uploadRoutes = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Upload PDF endpoint
uploadRoutes.post('/', upload.single('pdf'), async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📄 Processing PDF:', req.file.originalname);

    // 1. Create document record
    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      totalPages: 0,
      status: 'processing',
    });
    await document.save();

    // 2. Extract text from PDF
    const { text, numPages } = await extractTextFromPDF(req.file.path);
    document.totalPages = numPages;
    await document.save();

    console.log(`📖 Extracted ${numPages} pages`);

    // 3. Chunk text by page
    const chunks = chunkTextByPage(text, numPages);
    console.log(`✂️  Created ${chunks.length} chunks`);

    // 4. Generate embeddings for chunks
    console.log('🧠 Generating embeddings...');
    const embeddings = await generateEmbeddings(chunks.map(c => c.text));

    // 5. Store in Pinecone
    console.log('💾 Storing in Pinecone...');
    const index = getPineconeIndex();
    const vectors: PineconeVector[] = chunks.map((chunk, idx) => ({
      id: `${document._id}_page_${chunk.pageNumber}`,
      values: embeddings[idx],
      metadata: {
        documentId: document._id.toString(),
        pageNumber: chunk.pageNumber,
        text: chunk.text.substring(0, 1000), // Store first 1000 chars
        filename: document.originalName,
      },
    }));

  await index.upsert(vectors);

    // 6. Update document status
    document.status = 'completed';
    document.processedAt = new Date();
    document.vectorIds = vectors.map(v => v.id);
    await document.save();

    console.log('✅ Document processed successfully!');

    res.json({
      success: true,
      document: {
        id: document._id,
        filename: document.originalName,
        totalPages: document.totalPages,
        status: document.status,
      },
    });

  } catch (error: any) {
    console.error('❌ Upload error:', error);
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
      id: document._id,
      filename: document.originalName,
      totalPages: document.totalPages,
      status: document.status,
      uploadedAt: document.uploadedAt,
    });
  } catch (error: any) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Serve PDF file
uploadRoutes.get('/file/:filename', (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', req.params.filename);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
});

export default uploadRoutes;