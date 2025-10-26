import fs from 'fs';
import { createRequire } from 'module';
import { PDFChunk, PDFExtractionResult } from '../types/index.js';

// Create require for CommonJS modules
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Extract text from PDF
export const extractTextFromPDF = async (filePath: string): Promise<PDFExtractionResult> => {
  try {
    console.log('📄 Reading PDF file...');
    const dataBuffer = fs.readFileSync(filePath);

    console.log('🔍 Parsing PDF...');
    const data = await pdfParse(dataBuffer);

    console.log(`✅ Extracted ${data.numpages} pages from PDF`);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error('❌ Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

// Split text into chunks by page (approximate)
export const chunkTextByPage = (text: string, numPages: number): PDFChunk[] => {
  const chunks: PDFChunk[] = [];
  const lines = text.split('\n');
  const linesPerPage = Math.ceil(lines.length / numPages);

  for (let i = 0; i < numPages; i++) {
    const start = i * linesPerPage;
    const end = Math.min(start + linesPerPage, lines.length);
    const pageText = lines.slice(start, end).join('\n').trim();

    if (pageText.length > 0) {
      chunks.push({
        text: pageText,
        pageNumber: i + 1,
      });
    }
  }

  return chunks;
};

// Alternative: Split by character count (more accurate for large PDFs)
export const chunkTextBySize = (
  text: string,
  numPages: number,
  chunkSize: number = 1000
): PDFChunk[] => {
  const chunks: PDFChunk[] = [];
  const words = text.split(/\s+/);
  let currentChunk = '';
  let currentPage = 1;
  const wordsPerPage = Math.ceil(words.length / numPages);
  let wordCount = 0;

  for (const word of words) {
    currentChunk += word + ' ';
    wordCount++;

    if (currentChunk.length >= chunkSize || wordCount >= wordsPerPage) {
      chunks.push({
        text: currentChunk.trim(),
        pageNumber: currentPage,
      });
      currentChunk = '';
      currentPage++;
      wordCount = 0;
    }
  }

  // Add remaining text
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      pageNumber: currentPage,
    });
  }

  return chunks;
};