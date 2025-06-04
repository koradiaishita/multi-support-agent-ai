
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Download, Settings } from 'lucide-react';
import { Conversation } from '@/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  conversation?: Conversation;
  onSendMessage: (content: string, sender: 'user' | 'assistant', attachments?: any[]) => void;
  onToggleSidebar: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  onSendMessage,
  onToggleSidebar,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [conversation?.messages]);

  const handleSendMessage = (content: string, attachments?: any[]) => {
    if (content.trim() || attachments?.length) {
      onSendMessage(content, 'user', attachments);
      setIsTyping(true);
      
      // Simulate typing indicator
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 tcs-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            TCS IT Support Agent
          </h2>
          <p className="text-slate-400 max-w-md">
            Enterprise-grade AI assistant ready to help with your technical challenges. 
            Start a new conversation to begin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-300 hover:bg-slate-700"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="font-bold text-lg text-white">{conversation.title}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Active Support Session
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="tcs-button-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-slate-900" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {conversation.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="chat-bubble chat-bubble-assistant">
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-800/30 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
