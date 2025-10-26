import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadPDF } from '../services/api';
import { useApp } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

const FileUpload: React.FC = () => {
  const { setDocument, setError, clearMessages } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setUploading(true);
    setError(null);
    clearMessages();

    try {
      const response = await uploadPDF(file);
      setDocument(response.document);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-400'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {uploading ? (
        <div className="py-8">
          <LoadingSpinner size="lg" text="Processing PDF..." />
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload PDF Document
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your PDF here, or click to browse
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
        </>
      )}
    </div>
  );
};

export default FileUpload;