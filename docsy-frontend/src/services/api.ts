import axios from 'axios';
import type { ChatResponse, UploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const askQuestion = async (
  question: string,
  documentId?: string
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>('/chat', {
    question,
    documentId,
  });

  return response.data;
};

export const getPDFFile = (filename: string): string => {
  return `${API_BASE_URL}/upload/file/${filename}`;
};

export default api;