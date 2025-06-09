import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import multer from 'multer';
import path from 'path';

const router = Router();
const chatController = new ChatController();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all conversations
router.get('/', chatController.getConversations.bind(chatController));

// Get a single conversation
router.get('/:id', chatController.getConversation.bind(chatController));

// Create a new conversation
router.post('/', chatController.createConversation.bind(chatController));

// Add a message to a conversation
router.post('/:conversationId/messages', upload.array('attachments'), chatController.addMessage.bind(chatController));

// Delete a conversation
router.delete('/:id', chatController.deleteConversation.bind(chatController));

export default router;
