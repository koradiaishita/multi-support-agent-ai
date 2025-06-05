
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, Download, Settings, Bot, RotateCcw } from 'lucide-react';
import { Conversation } from '@/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ExportData from './ExportData';

interface ChatAreaProps {
  conversation?: Conversation;
  onSendMessage: (content: string, sender: 'user' | 'assistant', attachments?: any[]) => void;
  onToggleSidebar: () => void;
  onResetChat?: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  onSendMessage,
  onToggleSidebar,
  onResetChat,
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  const handleResetText = () => {
    // This will be handled by the message input component
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleClearConversation = () => {
    if (onResetChat) {
      onResetChat();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"></div>
        <div className="text-center relative z-10">
          <div className="w-20 h-20 tcs-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl tcs-logo-glow">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/bc6f9ae1-01dc-4a32-a2d2-d22d1b0abacf.png" 
              alt="Tia Logo" 
              className="h-12 w-auto object-contain tcs-logo-glow mr-4"
            />
            <h2 className="text-3xl font-bold text-white">
              IT Support Agent
            </h2>
          </div>
          <p className="text-lg tcs-gradient-text font-semibold mb-4">
            Enterprise-grade AI assistant powered by Tia innovation
          </p>
          <p className="text-slate-400 max-w-md leading-relaxed">
            Experience next-generation technical support with advanced AI capabilities. 
            Start a new conversation to unlock intelligent problem-solving solutions.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-orange-500/20 tcs-header-gradient relative z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-300 hover:bg-orange-500/10 border border-orange-500/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 tcs-gradient rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">{conversation.title}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
                Active Support Session
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="tcs-button-secondary border-orange-500/30 hover:border-orange-500/50"
            onClick={handleClearConversation}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Chat
          </Button>
          <ExportData
            onResetText={handleResetText}
            onToggleMute={handleToggleMute}
            isMuted={isMuted}
            onClearConversation={handleClearConversation}
            conversationData={conversation}
          />
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-transparent relative z-10" ref={scrollAreaRef}>
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
      <div className="border-t border-orange-500/20 tcs-header-gradient p-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
