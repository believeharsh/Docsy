// import express, { Request, Response } from 'express';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import { Types } from 'mongoose';
// import Document from '../models/document.model.js';
// import { extractTextFromPDF, chunkTextByPage } from '../services/pdfService.js';
// import { generateEmbeddings } from '../services/embeddingService.js';
// import { getPineconeIndex } from '../configs/pinecone.js';
// import { PineconeVector } from '../types/index.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const uploadRoutes = express.Router();

// // Get __dirname equivalent in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Configure Cloudinary
// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });
// cloudinary.config({
//   cloud_name: "dxmbszfqt",
//   api_key: "279813635538628",
//   api_secret: "Ag3jdP0w81t8KnKoR-1OrVn97n4",
// });

// // Configure multer with Cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: 'docsy-pdfs',
//       resource_type: 'raw', // Important for PDFs
//       public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
//       format: 'pdf',
//     };
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF files are allowed!'));
//     }
//   },
//   limits: {
//     fileSize: 50 * 1024 * 1024, // 50MB limit
//   },
// });

// // Upload PDF endpoint
// uploadRoutes.post('/', upload.single('pdf'), async (req: Request, res: Response): Promise<any> => {
//   let tempFilePath: string | null = null;
  
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     console.log('📄 Processing PDF:', req.file.originalname);

//     // Get Cloudinary URL
//     const cloudinaryFile = req.file as Express.Multer.File & { path: string };
//     const pdfUrl = cloudinaryFile.path;

//     // 1. Create document record
//     const document = new Document({
//       filename: req.file.filename || req.file.originalname,
//       originalName: req.file.originalname,
//       fileSize: req.file.size,
//       mimeType: req.file.mimetype,
//       totalPages: 0,
//       status: 'processing',
//       cloudinaryUrl: pdfUrl, // Store Cloudinary URL
//     });
//     await document.save();

//     const documentId = (document._id as Types.ObjectId).toString();

//     // 2. Download PDF temporarily for processing
//     console.log('⬇️  Downloading PDF for processing...');
//     const response = await fetch(pdfUrl);
//     const arrayBuffer = await response.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
    
//     // Create temp file
//     tempFilePath = path.join('/tmp', `${documentId}.pdf`);
//     fs.writeFileSync(tempFilePath, buffer);

//     // 3. Extract text from PDF
//     const { text, numPages } = await extractTextFromPDF(tempFilePath);
//     document.totalPages = numPages;
//     await document.save();

//     console.log(`📖 Extracted ${numPages} pages`);

//     // 4. Chunk text by page
//     const chunks = chunkTextByPage(text, numPages);
//     console.log(`✂️  Created ${chunks.length} chunks`);

//     // 5. Generate embeddings for chunks
//     console.log('🧠 Generating embeddings...');
//     const embeddings = await generateEmbeddings(chunks.map(c => c.text));

//     // 6. Store in Pinecone
//     console.log('💾 Storing in Pinecone...');
//     const index = getPineconeIndex();
//     const vectors: PineconeVector[] = chunks.map((chunk, idx) => ({
//       id: `${documentId}_page_${chunk.pageNumber}`,
//       values: embeddings[idx],
//       metadata: {
//         documentId: documentId,
//         pageNumber: chunk.pageNumber,
//         text: chunk.text.substring(0, 1000),
//         filename: document.originalName,
//       },
//     }));

//     await index.upsert(vectors as any);

//     // 7. Update document status
//     document.status = 'completed';
//     document.processedAt = new Date();
//     document.vectorIds = vectors.map(v => v.id);
//     await document.save();

//     // 8. Cleanup temp file
//     if (tempFilePath && fs.existsSync(tempFilePath)) {
//       fs.unlinkSync(tempFilePath);
//     }

//     console.log('✅ Document processed successfully!');

//     res.json({
//       success: true,
//       document: {
//         id: documentId,
//         filename: document.filename,
//         originalName: document.originalName,
//         totalPages: document.totalPages,
//         status: document.status,
//         pdfUrl: pdfUrl, // Return Cloudinary URL
//       },
//     });

//   } catch (error: any) {
//     console.error('❌ Upload error:', error);
    
//     // Cleanup temp file on error
//     if (tempFilePath && fs.existsSync(tempFilePath)) {
//       try {
//         fs.unlinkSync(tempFilePath);
//       } catch (e) {
//         console.error('Error cleaning up temp file:', e);
//       }
//     }
    
//     res.status(500).json({ 
//       error: 'Failed to process PDF',
//       details: error.message 
//     });
//   }
// });

// // Get document by ID
// uploadRoutes.get('/:id', async (req: Request, res: Response): Promise<any> => {
//   try {
//     const document = await Document.findById(req.params.id);
    
//     if (!document) {
//       return res.status(404).json({ error: 'Document not found' });
//     }

//     res.json({
//       id: (document._id as Types.ObjectId).toString(),
//       filename: document.originalName,
//       totalPages: document.totalPages,
//       status: document.status,
//       uploadedAt: document.uploadedAt,
//       pdfUrl: document.cloudinaryUrl, // Return Cloudinary URL
//     });
//   } catch (error: any) {
//     console.error('Error fetching document:', error);
//     res.status(500).json({ error: 'Failed to fetch document' });
//   }
// });

// // Serve PDF file - now proxies from Cloudinary
// uploadRoutes.get('/file/:filename', async (req: Request, res: Response): Promise<any> => {
//   try {
//     // Find document by filename
//     const document = await Document.findOne({ filename: req.params.filename });
    
//     if (!document || !document.cloudinaryUrl) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     // Redirect to Cloudinary URL
//     res.redirect(document.cloudinaryUrl);
//   } catch (error) {
//     console.error('Error serving PDF:', error);
//     res.status(500).json({ error: 'Failed to serve PDF' });
//   }
// });

// export default uploadRoutes;




import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
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

let upload: any;

if (USE_CLOUDINARY) {
  // ========== PRODUCTION: Use Cloudinary ==========
  console.log('📦 Using Cloudinary storage for production');
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: any, file: any) => {
      return {
        folder: 'docsy-pdfs',
        resource_type: 'raw',
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
        format: 'pdf',
      };
    },
  });

  upload = multer({
    storage: cloudinaryStorage,
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed!'));
      }
    },
    limits: { fileSize: 50 * 1024 * 1024 },
  });
} else {
  // ========== DEVELOPMENT: Use Local Storage ==========
  console.log('📁 Using local storage for development');
  
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory');
  }

  const localStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, uploadsDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });

  upload = multer({
    storage: localStorage,
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed!'));
      }
    },
    limits: { fileSize: 50 * 1024 * 1024 },
  });
}

// Upload PDF endpoint
uploadRoutes.post('/', upload.single('pdf'), async (req: Request, res: Response): Promise<any> => {
  let tempFilePath: string | null = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📄 Processing PDF:', req.file.originalname);

    let pdfPath: string;
    let cloudinaryUrl: string | undefined;

    if (USE_CLOUDINARY) {
      // Production: Download from Cloudinary to temp file
      const cloudinaryFile = req.file as Express.Multer.File & { path: string };
      cloudinaryUrl = cloudinaryFile.path;
      
      console.log('⬇️  Downloading PDF from Cloudinary...');
      const response = await fetch(cloudinaryUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const tmpDir = os.tmpdir();
      tempFilePath = path.join(tmpDir, `${Date.now()}.pdf`);
      fs.writeFileSync(tempFilePath, buffer);
      pdfPath = tempFilePath;
    } else {
      // Development: Use local file path directly
      pdfPath = req.file.path;
    }

    // 1. Create document record
    const document = new Document({
      filename: req.file.filename || req.file.originalname,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      totalPages: 0,
      status: 'processing',
      cloudinaryUrl: cloudinaryUrl,
    });
    await document.save();

    const documentId = (document._id as Types.ObjectId).toString();

    // 2. Extract text from PDF
    const { text, numPages } = await extractTextFromPDF(pdfPath);
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

    // 6. Update document status
    document.status = 'completed';
    document.processedAt = new Date();
    document.vectorIds = vectors.map(v => v.id);
    await document.save();

    // 7. Cleanup temp file (only in production)
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
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
    if (USE_CLOUDINARY) {
      // Production: Redirect to Cloudinary
      const document = await Document.findOne({ filename: req.params.filename });
      
      if (!document || !document.cloudinaryUrl) {
        return res.status(404).json({ error: 'File not found' });
      }

      res.redirect(document.cloudinaryUrl);
    } else {
      // Development: Serve from local uploads folder
      const uploadsDir = path.join(process.cwd(), 'uploads');
      const filePath = path.join(uploadsDir, req.params.filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      res.sendFile(filePath);
    }
  } catch (error) {
    console.error('Error serving PDF:', error);
    res.status(500).json({ error: 'Failed to serve PDF' });
  }
});

export default uploadRoutes;