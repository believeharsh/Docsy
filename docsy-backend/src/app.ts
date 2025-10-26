// src/app.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import uploadRoutes from './routes/uploads.route.js';
import chatRoutes from './routes/chats.route.js';

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Docsy Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Docsy Backend is running!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// ❌ REMOVE THIS - Don't start server here!
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });

// ✅ Only export app
export { app };