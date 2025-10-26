import { AlertCircle, X } from "lucide-react";
import type React from "react";
import { useApp } from "../context/AppContext";

const ErrorAlert: React.FC = () => {
  const { error, setError } = useApp();
  return (
    <>
      <div className="mx-8 mt-6">
        <div className="p-4 bg-white border border-red-200 rounded-2xl flex items-start gap-4 shadow-lg shadow-red-100/50">
          <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center shrink-0">
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
    </>
  );
};

export default ErrorAlert;
