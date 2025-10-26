// src/config/pinecone.ts
import { Pinecone, Index } from '@pinecone-database/pinecone';

let pineconeClient: Pinecone | null = null;
let pineconeIndex: Index | null = null;

export const initializePinecone = async (): Promise<Index> => {
  try {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    pineconeIndex = pineconeClient.index(process.env.PINECONE_INDEX_NAME as string);

    console.log('✅ Pinecone initialized successfully');
    return pineconeIndex;
  } catch (error) {
    console.error('❌ Pinecone initialization error:', error);
    throw error;
  }
};

export const getPineconeIndex = (): Index => {
  if (!pineconeIndex) {
    throw new Error('Pinecone not initialized. Call initializePinecone first.');
  }
  return pineconeIndex;
};