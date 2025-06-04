
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import { Message, Conversation } from '@/types/chat';

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'IT Support Session',
      messages: [
        {
          id: '1',
          content: "Hello! I'm your IT Support Agent powered by AI. How can I help you today?",
          sender: 'assistant',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
    }
  ]);
  
  const [activeConversationId, setActiveConversationId] = useState('1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const addMessage = (content: string, sender: 'user' | 'assistant', attachments?: any[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      attachments,
    };

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));

    // Simulate assistant response
    if (sender === 'user') {
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I've received your request. Let me analyze this and provide you with a solution. This is a demo response - in a real implementation, this would connect to your Python backend for AI processing.",
          sender: 'assistant',
          timestamp: new Date(),
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        ));
      }, 1500);
    }
  };

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New IT Support Session',
      messages: [
        {
          id: Date.now().toString(),
          content: "Hello! I'm your IT Support Agent. What technical issue can I help you with?",
          sender: 'assistant',
          timestamp: new Date(),
        }
      ],
      createdAt: new Date(),
    };
    
    setConversations(prev => [...prev, newConv]);
    setActiveConversationId(newConv.id);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={setActiveConversationId}
        onNewConversation={createNewConversation}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <ChatArea 
        conversation={activeConversation}
        onSendMessage={addMessage}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
};

export default ChatInterface;
