import Groq from 'groq-sdk';
import { getPineconeIndex } from '../configs/pinecone.js';
import { generateEmbedding } from './embeddingService.js';
import { QueryResult, SearchContext } from '../types/index.js';

// Create client only when needed
let groqClient: Groq | null = null;

const getGroqClient = (): Groq => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('❌ GROQ_API_KEY environment variable is not set!');
    }

    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log('✅ Groq client initialized');
  }
  return groqClient;
};

// Query the document and get AI response
export const queryDocument = async (
  question: string,
  documentId?: string
): Promise<QueryResult> => {
  try {
    // Get Groq client (will initialize on first call)
    const groq = getGroqClient();

    // Generating the embedding for the question
    const questionEmbedding = await generateEmbedding(question);

    // Searching the Pinecone for similar chunks
    const index = getPineconeIndex();
    const searchResults = await index.query({
      vector: questionEmbedding,
      topK: 3,
      includeMetadata: true,
      filter: documentId ? { documentId: { $eq: documentId } } : undefined,
    });

    // Extracting context from results
    if (!searchResults.matches || searchResults.matches.length === 0) {
      return {
        answer: "I couldn't find any relevant information in the document to answer your question.",
        citations: [],
        context: [],
      };
    }

    const contexts: SearchContext[] = searchResults.matches.map(match => ({
      text: match.metadata?.text as string || '',
      pageNumber: match.metadata?.pageNumber as number || 0,
      score: match.score || 0,
    }));

    // Building context string for AI
    const contextString = contexts
      .map((ctx) => `[Page ${ctx.pageNumber}]\n${ctx.text}`)
      .join('\n\n---\n\n');

    //  Creating prompt for Groq
    const systemPrompt = `You are a helpful assistant that answers questions based on the provided document context. 
Always cite the page numbers when providing information.
If the answer is not in the context, say so clearly.
Format your citations like this: [Page X] where X is the page number.`;

    const userPrompt = `Context from document:
${contextString}

Question: ${question}

Please provide a detailed answer based on the context above, and cite the page numbers.`;

    // Get response from Groq
    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL as string,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const answer = completion.choices[0]?.message?.content || 'No response generated';

    //  Extract page citations from response
    const citationRegex = /\[Page (\d+)\]/g;
    const citationMatches = [...answer.matchAll(citationRegex)];
    const citations = [...new Set(citationMatches.map(match => parseInt(match[1])))];

    return {
      answer,
      citations: citations.sort((a, b) => a - b),
      context: contexts,
    };

  } catch (error) {
    console.error('Error querying document:', error);
    throw new Error('Failed to process question');
  }
};