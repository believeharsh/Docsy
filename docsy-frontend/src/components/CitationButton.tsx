import React from 'react';
import { FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CitationButtonProps {
  pageNumber: number;
}

const CitationButton: React.FC<CitationButtonProps> = ({ pageNumber }) => {
  const { setCurrentPage } = useApp();

  const handleClick = () => {
    setCurrentPage(pageNumber);
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors border border-indigo-200"
    >
      <FileText className="w-3.5 h-3.5" />
      Page {pageNumber}
    </button>
  );
};

export default CitationButton;