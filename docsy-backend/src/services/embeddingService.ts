import { HfInference } from '@huggingface/inference';

// Lazy initialization
let hfClient: HfInference | null = null;

const getHfClient = (): HfInference => {
  if (!hfClient) {
    if (!process.env.HUGGINGFACE_API_KEY) {
      throw new Error('❌ HUGGINGFACE_API_KEY environment variable is not set!');
    }
    
    hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
    console.log('✅ Hugging Face client initialized');
  }
  return hfClient;
};

// Generate embedding for a single text
export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const hf = getHfClient();
    
    const embedding = await hf.featureExtraction({
      model: process.env.HUGGINGFACE_MODEL as string,
      inputs: text,
    });
    
    // Fixed: Properly handle the response type
    if (Array.isArray(embedding) && embedding.length > 0) {
      // If it's a 2D array (batch response), return the first element
      if (Array.isArray(embedding[0])) {
        return embedding[0] as number[];
      }
      // If it's already a 1D array, return it
      return embedding as number[];
    }
    
    throw new Error('Invalid embedding response format');
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
};

// Generate embeddings for multiple texts (batch)
export const generateEmbeddings = async (texts: string[]): Promise<number[][]> => {
  try {
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text))
    );
    
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
};