import { Request, Response } from 'express';
import { ConversationService } from '../services/conversationService';

export const ConversationController = {
  // Get all conversations
  getAllConversations: (req: Request, res: Response) => {
    const conversations = ConversationService.getConversations();
    res.json(conversations);
  },

  // Get a single conversation
  getConversation: (req: Request, res: Response) => {
    const { id } = req.params;
    const conversation = ConversationService.getConversation(id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json(conversation);
  },

  // Create a new conversation
  createConversation: (req: Request, res: Response) => {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const conversation = ConversationService.createConversation(title);
    res.status(201).json(conversation);
  },

  // Add a message to a conversation
  addMessage: (req: Request, res: Response) => {
    const { id } = req.params;
    const { content, sender, attachments } = req.body;
    
    if (!content || !sender) {
      return res.status(400).json({ error: 'Content and sender are required' });
    }
    
    const message = ConversationService.addMessage(id, content, sender, attachments);
    
    if (!message) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // For user messages, generate an AI response
    if (sender === 'user') {
      // Simulate AI processing time
      setTimeout(() => {
        const aiResponse = ConversationService.addMessage(
          id,
          "I understand your issue. Let me help you with that. [This is a simulated AI response - in production, this would be connected to an actual AI model]",
          'assistant'
        );
      }, 1000);
    }
    
    res.status(201).json(message);
  },

  // Delete a conversation
  deleteConversation: (req: Request, res: Response) => {
    const { id } = req.params;
    const success = ConversationService.deleteConversation(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.status(204).send();
  },

  // Clear a conversation
  clearConversation: (req: Request, res: Response) => {
    const { id } = req.params;
    const success = ConversationService.clearConversation(id);
    
    if (!success) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.status(200).json({ message: 'Conversation cleared successfully' });
  }
};
