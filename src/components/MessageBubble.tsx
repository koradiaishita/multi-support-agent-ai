
import React from 'react';
import { Message } from '@/types/chat';
import { Bot, User, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderAttachment = (attachment: any) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div key={attachment.id} className="mt-2">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="max-w-sm rounded-lg border"
            />
          </div>
        );
      case 'file':
        return (
          <div key={attachment.id} className="mt-2 p-3 bg-gray-100 rounded-lg border max-w-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.name}</p>
                <p className="text-xs text-gray-500">
                  {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'File'}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'assistant' && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {message.attachments?.map(renderAttachment)}
        </div>
        
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {message.sender === 'user' && (
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
