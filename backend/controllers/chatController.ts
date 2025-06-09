import { Request, Response } from 'express';
import { GeminiService } from '../services/geminiService';
import { Message, Conversation } from '../types/chat';

const geminiService = new GeminiService();

// In-memory storage for conversations (should be replaced with a database in production)
let conversations: Conversation[] = [];

export class ChatController {
  // Get all conversations
  async getConversations(req: Request, res: Response) {
    try {
      res.json(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ error: 'Failed to get conversations' });
    }
  }

  // Get a single conversation by ID
  async getConversation(req: Request, res: Response) {
    try {
      const conversation = conversations.find(c => c.id === req.params.id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      res.json(conversation);
    } catch (error) {
      console.error('Error getting conversation:', error);
      res.status(500).json({ error: 'Failed to get conversation' });
    }
  }

  // Create a new conversation
  async createConversation(req: Request, res: Response) {
    try {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: req.body.title || 'New Conversation',
        messages: [],
        createdAt: new Date()
      };
      conversations.push(newConversation);
      res.status(201).json(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  }

  // Add a message to a conversation
  async addMessage(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const { content, sender, attachments } = req.body;

      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        sender,
        timestamp: new Date(),
        attachments
      };

      // Add user message to conversation
      conversation.messages.push(newMessage);

      // If the message is from a user, generate AI response
      if (sender === 'user') {
        let aiPrompt = content;
        
        // If there are attachments, include their analysis in the prompt
        if (attachments && attachments.length > 0) {
          const attachmentPrompts = await Promise.all(
            attachments.map(async (attachment) => {
              if (attachment.type === 'image') {
                // Process image with Gemini Vision
                const imageAnalysis = await geminiService.processImage(
                  Buffer.from(attachment.url.split(',')[1], 'base64'),
                  'Please analyze this image and provide relevant context for the conversation.'
                );
                return `[Image Analysis: ${imageAnalysis}]`;
              }
              return `[${attachment.type} attachment: ${attachment.name}]`;
            })
          );
          aiPrompt = `${content}\n\nAttachments:\n${attachmentPrompts.join('\n')}`;
        }

        // Generate AI response
        const aiResponse = await geminiService.processText(aiPrompt);
        
        // Add AI response to conversation
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'assistant',
          timestamp: new Date()
        };
        conversation.messages.push(aiMessage);
      }

      res.json(conversation);
    } catch (error) {
      console.error('Error adding message:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  }

  // Delete a conversation
  async deleteConversation(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const index = conversations.findIndex(c => c.id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      conversations.splice(index, 1);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }
}
