import { Conversation, Message } from '../types/chat';

// In-memory storage for conversations
const conversations = new Map<string, Conversation>();

export const ConversationService = {
  // Create a new conversation
  createConversation: (title: string): Conversation => {
    const conversation: Conversation = {
      id: Date.now().toString(),
      title,
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
    conversations.set(conversation.id, conversation);
    return conversation;
  },

  // Get all conversations
  getConversations: (): Conversation[] => {
    return Array.from(conversations.values());
  },

  // Get a single conversation
  getConversation: (id: string): Conversation | undefined => {
    return conversations.get(id);
  },

  // Add a message to a conversation
  addMessage: (conversationId: string, content: string, sender: 'user' | 'assistant', attachments?: any[]): Message | null => {
    const conversation = conversations.get(conversationId);
    if (!conversation) return null;

    const message: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      attachments,
    };

    conversation.messages.push(message);
    conversations.set(conversationId, conversation);
    return message;
  },

  // Delete a conversation
  deleteConversation: (id: string): boolean => {
    return conversations.delete(id);
  },

  // Clear all messages in a conversation
  clearConversation: (id: string): boolean => {
    const conversation = conversations.get(id);
    if (!conversation) return false;

    conversation.messages = [
      {
        id: Date.now().toString(),
        content: "Hello! I'm your IT Support Agent. What technical issue can I help you with?",
        sender: 'assistant',
        timestamp: new Date(),
      }
    ];
    conversations.set(id, conversation);
    return true;
  }
};
