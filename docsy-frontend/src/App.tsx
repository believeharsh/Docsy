// src/App.tsx
import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { useApp } from './context/AppContext';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViwer';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const { document, error, setError } = useApp();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Docsy
              </h1>
              <p className="text-sm text-gray-500">Your AI PDF Assistant</p>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {!document ? (
          // Upload Screen
          <div className="h-full flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Upload a PDF to get started
                </h2>
                <p className="text-gray-600">
                  Ask questions, get answers, and navigate your documents with AI
                </p>
              </div>
              <FileUpload />
            </div>
          </div>
        ) : (
          // Split View: PDF + Chat
          <div className="h-full flex">
            {/* PDF Viewer - Left Side */}
            <div className="w-1/2 border-r border-gray-200">
              <PDFViewer fileUrl={`http://localhost:8000/api/upload/file/${document.filename}`} />
            </div>

            {/* Chat Interface - Right Side */}
            <div className="w-1/2">
              <ChatInterface />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <p className="text-xs text-gray-500 text-center">
          Built with React, TypeScript, and AI • Powered by Groq & Pinecone
        </p>
      </footer>
    </div>
  );
};

export default App;