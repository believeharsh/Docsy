import type React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-medium">Built with</span>
          <span className="px-2 py-1 bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg font-semibold text-indigo-600">
            React
          </span>
          <span>•</span>
          <span className="px-2 py-1 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg font-semibold text-purple-600">
            TypeScript
          </span>
          <span>•</span>
          <span className="font-medium">Powered by Groq & Pinecone</span>
        </div>
      </footer>
    </>
  );
};

export default Footer ; 