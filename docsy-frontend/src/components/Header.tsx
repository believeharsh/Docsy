import { FileText, Sparkles } from "lucide-react";
import type React from "react";

const Header: React.FC = () => {
  return (
    <>
      <header className="relative bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="relative px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl blur-md opacity-50" />
                <div className="relative w-12 h-12 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
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
              <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">
                  Document Loaded
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};


export default Header ; 