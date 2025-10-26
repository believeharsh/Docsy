import React from 'react';
import { FileText, AlertCircle, X, Sparkles } from 'lucide-react';
import { useApp } from './context/AppContext';
import FileUpload from './components/FileUpload';
import PDFViewer from './components/PDFViwer';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const { document, error, setError } = useApp();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="relative bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-md opacity-50" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Docsy
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered PDF Assistant
                </p>
              </div>
            </div>
            {document && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Document Loaded</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="mx-8 mt-6">
          <div className="p-4 bg-white border border-red-200 rounded-2xl flex items-start gap-4 shadow-lg shadow-red-100/50">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Error</h3>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-6">
        {!document ? (
          // Upload Screen
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-3xl">
              <div className="text-center mb-12">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-30" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center">
                    <FileText className="w-12 h-12 text-white" strokeWidth={2} />
                  </div>
                </div>
                <h2 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                  Upload Your PDF
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Get instant answers, extract insights, and navigate your documents with the power of AI
                </p>
              </div>
              <FileUpload />
            </div>
          </div>
        ) : (
          // Split View: PDF + Chat
          <div className="h-full flex gap-6">
            {/* PDF Viewer - Left Side */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <PDFViewer fileUrl={`http://localhost:8000/api/upload/file/${document.filename}`} />
            </div>

            {/* Chat Interface - Right Side */}
            <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <ChatInterface />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium">Built with</span>
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg font-semibold text-indigo-600">React</span>
          <span>•</span>
          <span className="px-2 py-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg font-semibold text-purple-600">TypeScript</span>
          <span>•</span>
          <span className="font-medium">Powered by Groq & Pinecone</span>
        </div>
      </footer>
    </div>
  );
};

export default App;