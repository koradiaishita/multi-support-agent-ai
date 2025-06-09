import { Request, Response } from 'express';
import { GeminiService } from '../services/geminiService';
import * as fs from 'fs';
import { promisify } from 'util';

const geminiService = new GeminiService();

export class AIController {
  // Handle text processing
  async processText(req: Request, res: Response) {
    try {
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
      }

      const response = await geminiService.processText(text);
      return res.json({ response });
    } catch (error) {
      console.error('Error in processText:', error);
      return res.status(500).json({ error: 'Failed to process text input' });
    }
  }

  // Handle image processing
  async processImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const { prompt } = req.body;
      const imageBuffer = req.file.buffer;

      const response = await geminiService.processImage(imageBuffer, prompt || 'Please analyze this image');
      return res.json({ response });
    } catch (error) {
      console.error('Error in processImage:', error);
      return res.status(500).json({ error: 'Failed to process image' });
    }
  }

  // Handle audio processing
  async processAudio(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Audio file is required' });
      }

      const { prompt } = req.body;
      const audioBuffer = req.file.buffer;

      const response = await geminiService.processAudio(audioBuffer, prompt || 'Please analyze this audio');
      return res.json({ response });
    } catch (error) {
      console.error('Error in processAudio:', error);
      return res.status(500).json({ error: 'Failed to process audio' });
    }
  }

  // Handle multi-modal processing
  async processMultiModal(req: Request, res: Response) {
    try {
      const { inputs } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!inputs || !Array.isArray(inputs)) {
        return res.status(400).json({ error: 'Invalid input format' });
      }

      const processedInputs = await Promise.all(inputs.map(async (input) => {
        if (input.type === 'text') {
          return {
            type: 'text',
            content: input.content,
            prompt: input.prompt
          };
        } else if (input.type === 'image' || input.type === 'audio') {
          const file = files.find(f => f.fieldname === input.fileField);
          if (!file) {
            throw new Error(`File not found for field: ${input.fileField}`);
          }
          return {
            type: input.type,
            content: file.buffer,
            prompt: input.prompt
          };
        }
        throw new Error(`Unsupported input type: ${input.type}`);
      }));

      const response = await geminiService.processMultiModal(processedInputs);
      return res.json({ response });
    } catch (error) {
      console.error('Error in processMultiModal:', error);
      return res.status(500).json({ error: 'Failed to process multi-modal input' });
    }
  }
}
