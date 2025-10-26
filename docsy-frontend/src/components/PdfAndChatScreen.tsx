import type React from "react";
import PDFViewer from "./PDFViwer";
import ChatInterface from "./ChatInterface";
import { useApp } from "../context/AppContext";

const PDFAndChatScreen: React.FC = () => {
  const { document } = useApp();
  return (
    <>
      <div className="h-full flex gap-6">
        {/* PDF Viewer - Left Side */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <PDFViewer
            fileUrl={`http://localhost:8000/api/upload/file/${document.filename}`}
          />
        </div>

        {/* Chat Interface - Right Side */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <ChatInterface />
        </div>
      </div>
    </>
  );
};

export default PDFAndChatScreen;
