import { Router } from 'express';
import multer from 'multer';
import { AIController } from '../controllers/aiController';

const router = Router();
const aiController = new AIController();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Text processing route
router.post('/process-text', aiController.processText);

// Image processing route
router.post('/process-image', upload.single('image'), aiController.processImage);

// Audio processing route
router.post('/process-audio', upload.single('audio'), aiController.processAudio);

// Multi-modal processing route
router.post('/process-multimodal', upload.array('files'), aiController.processMultiModal);

export default router;
