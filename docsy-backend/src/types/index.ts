export interface PDFChunk {
  text: string;
  pageNumber: number;
}

export interface PDFExtractionResult {
  text: string;
  numPages: number;
  info: any;
}

export interface PineconeMetadata {
  documentId: string;
  pageNumber: number;
  text: string;
  filename: string;
  [key: string]: string | number | boolean | string[] | null; // Index signature for Pinecone compatibility
}

export interface PineconeVector {
  id: string;
  values: number[];
  metadata: PineconeMetadata;
}

export interface SearchContext {
  text: string;
  pageNumber: number;
  score: number;
}

export interface QueryResult {
  answer: string;
  citations: number[];
  context: SearchContext[];
}

export interface DocumentResponse {
  id: string;
  filename: string;
  totalPages: number;
  status: string;
  uploadedAt?: Date;
}

export interface ChatRequest {
  question: string;
  documentId?: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  citations: number[];
  context: SearchContext[];
}