import express from 'express';
import { ConversationController } from '../controllers/conversationController';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Conversation routes
router.get('/conversations', ConversationController.getAllConversations);
router.get('/conversations/:id', ConversationController.getConversation);
router.post('/conversations', ConversationController.createConversation);
router.post('/conversations/:id/messages', ConversationController.addMessage);
router.delete('/conversations/:id', ConversationController.deleteConversation);
router.post('/conversations/:id/clear', ConversationController.clearConversation);

// File upload route
router.post('/upload', upload.array('files'), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploadedFiles = files.map(file => ({
    id: Date.now().toString() + Math.random(),
    name: file.originalname,
    type: file.mimetype.startsWith('image/') ? 'image' : 'file',
    url: `/uploads/${file.filename}`,
    size: file.size
  }));

  res.json(uploadedFiles);
});

export default router;
