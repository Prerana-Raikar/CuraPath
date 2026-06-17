import React, { useState, useRef, useEffect } from 'react';
import Button from '@/components/common/Button';
import { 
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'analysis' | 'recommendation';
  metadata?: {
    confidence?: number;
    sources?: string[];
    topic_detected?: boolean;
    response_type?: string;
  };
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading = false,
  placeholder = "Ask me anything about patient care...",
  suggestions = [],
  className = ''
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;
    
    onSendMessage(inputMessage.trim());
    setInputMessage('');
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-primary-600' : 'bg-green-600'
                }`}>
                  {message.sender === 'user' ? (
                    <UserIcon className="w-5 h-5 text-white" />
                  ) : (
                    <SparklesIcon className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`relative px-4 py-2 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* AI Message Metadata */}
                {message.sender === 'ai' && message.metadata && (
                  <div className="mb-2 pb-2 border-b border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {message.metadata.confidence && (
                        <div className="flex items-center space-x-1">
                          <span>Confidence:</span>
                          <span className={`font-semibold ${
                            message.metadata.confidence >= 0.9 ? 'text-green-600' :
                            message.metadata.confidence >= 0.8 ? 'text-blue-600' :
                            message.metadata.confidence >= 0.7 ? 'text-yellow-600' :
                            'text-orange-600'
                          }`}>
                            {(message.metadata.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                      {message.metadata.sources && message.metadata.sources.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>Sources:</span>
                          <span className="font-medium text-gray-700">
                            {message.metadata.sources.slice(0, 2).join(', ')}
                            {message.metadata.sources.length > 2 && ` +${message.metadata.sources.length - 2} more`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Message Text */}
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {/* Copy Button for AI Messages */}
                {message.sender === 'ai' && (
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex mr-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            loading={isLoading}
            disabled={!inputMessage.trim()}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;