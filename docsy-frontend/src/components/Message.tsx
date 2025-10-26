import React from 'react';
import { User, Bot } from 'lucide-react';
import type { Message as MessageType } from '../types';
import CitationButton from './CitationButton';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.type === 'user';

  // Parse citations from text like [Page 1]
  const renderContentWithCitations = (content: string, citations?: number[]) => {
    if (!citations || citations.length === 0) {
      return <p className="text-gray-800 leading-relaxed">{content}</p>;
    }

    // Split by [Page X] pattern
    const parts = content.split(/(\[Page \d+\])/g);
    
    return (
      <div className="space-y-3">
        <p className="text-gray-800 leading-relaxed">
          {parts.map((part, idx) => {
            const pageMatch = part.match(/\[Page (\d+)\]/);
            if (pageMatch) {
              return null; // We'll show citations separately
            }
            return <span key={idx}>{part}</span>;
          })}
        </p>
        {citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Sources:</span>
            {citations.map((page) => (
              <CitationButton key={page} pageNumber={page} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-indigo-600" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-white border border-gray-200 shadow-sm'
        }`}
      >
        {isUser ? (
          <p className="text-white leading-relaxed">{message.content}</p>
        ) : (
          renderContentWithCitations(message.content, message.citations)
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default Message;