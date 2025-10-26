// src/context/AppContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Document, Message, AppState } from '../types';

interface AppContextType extends AppState {
  setDocument: (doc: Document | null) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentPage: (page: number) => void;
  clearMessages: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AppContext.Provider
      value={{
        document,
        messages,
        isLoading,
        error,
        currentPage,
        setDocument,
        addMessage,
        setLoading,
        setError,
        setCurrentPage,
        clearMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};