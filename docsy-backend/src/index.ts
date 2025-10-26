import dotenv from "dotenv" ; 

dotenv.config();

console.log('🔍 Environment Check:');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('HUGGINGFACE_API_KEY:', process.env.HUGGINGFACE_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('PINECONE_API_KEY:', process.env.PINECONE_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('MONGODB_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Missing');
console.log('');

import connectDB from './db/index.js';
import { app } from './app.js';
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.log('MONGO db connection failed !!! ', err);
  });