import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// route
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Basic Express + TypeScript server is running!');
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});


export {app} ; 