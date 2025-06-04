
import React from 'react';
import { Message } from '@/types/chat';
import { Bot, User, Download, FileText } from 'lucide-react';
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
          <div key={attachment.id} className="mt-3">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="max-w-sm rounded-xl border border-slate-600 shadow-lg"
            />
          </div>
        );
      case 'file':
        return (
          <div key={attachment.id} className="mt-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600 max-w-sm shadow-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-slate-200">{attachment.name}</p>
                <p className="text-xs text-slate-400">
                  {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'File'}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-slate-600">
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
    <div className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.sender === 'assistant' && (
        <div className="w-10 h-10 tcs-gradient rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`chat-bubble ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          
          {message.attachments?.map(renderAttachment)}
        </div>
        
        <span className="text-xs text-slate-500 mt-2 px-3 font-medium">
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {message.sender === 'user' && (
        <div className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <User className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
