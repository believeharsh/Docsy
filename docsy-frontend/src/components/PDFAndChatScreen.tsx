import type React from "react";
import PDFViewer from "./PDFViwer";
import ChatInterface from "./ChatInterface";
import { useApp } from "../context/AppContext";

const PDFAndChatScreen: React.FC = () => {
  const { document } = useApp();

  // Handle case when document is null
  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-3xl">
        <div className="text-center">
          <p className="text-slate-600 text-lg">No document loaded</p>
          <p className="text-slate-400 text-sm mt-2">Please upload a PDF to get started</p>
        </div>
      </div>
    );
  }

  // Get PDF URL - use pdfUrl if available (production/Cloudinary), otherwise construct local URL
  const getPdfUrl = () => {
    // If backend returned pdfUrl (Cloudinary URL in production), use it directly
    if (document.pdfUrl) {
      return document.pdfUrl;
    }
    
    // Otherwise, construct local file URL (development)
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}/api/upload/file/${document.filename}`;
  };

  return (
    <div className="h-full flex gap-6">
      {/* PDF Viewer - Left Side */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <PDFViewer fileUrl={getPdfUrl()} />
      </div>

      {/* Chat Interface - Right Side */}
      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
};

export default PDFAndChatScreen;