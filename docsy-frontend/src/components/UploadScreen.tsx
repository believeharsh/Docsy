import { FileText } from "lucide-react";
import type React from "react";
import FileUpload from "./FileUpload";

const UploadScreen: React.FC = () => {
  return (
    <>
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-30" />
              <div className="relative w-24 h-24 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center">
                <FileText className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
            </div>
            <h2 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Upload Your PDF
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get instant answers, extract insights, and navigate your documents
              with the power of AI
            </p>
          </div>
          <FileUpload />
        </div>
      </div>
    </>
  );
};

export default UploadScreen;
