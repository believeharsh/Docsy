export interface Document {
  id: string;
  filename: string;
  totalPages: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  uploadedAt?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: number[];
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  citations: number[];
  context: {
    text: string;
    pageNumber: number;
    score: number;
  }[];
}

export interface UploadResponse {
  success: boolean;
  document: Document;
}

export interface AppState {
  document: Document | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
}