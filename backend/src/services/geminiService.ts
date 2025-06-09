import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { fileTypeFromBuffer } from 'file-type';
import * as fs from 'fs';
import * as path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Configure safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-pro" });
  private visionModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  // Process text input
  async processText(text: string): Promise<string> {
    try {
      const result = await this.model.generateContent(text);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing text with Gemini:', error);
      throw new Error('Failed to process text input');
    }
  }

  // Process image input
  async processImage(imageBuffer: Buffer, prompt: string): Promise<string> {
    try {
      // Detect file type
      const fileType = await fileTypeFromBuffer(imageBuffer);
      if (!fileType || !fileType.mime.startsWith('image/')) {
        throw new Error('Invalid image format');
      }

      // Convert image to base64
      const imageBase64 = imageBuffer.toString('base64');
      const mimeType = fileType.mime;

      const result = await this.visionModel.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType
          }
        }
      ]);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing image with Gemini:', error);
      throw new Error('Failed to process image input');
    }
  }

  // Process audio input
  async processAudio(audioBuffer: Buffer, prompt: string): Promise<string> {
    try {
      // Create temporary directory for audio processing if it doesn't exist
      const tempDir = path.join(__dirname, '../../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Save audio buffer to temporary file
      const inputPath = path.join(tempDir, `input-${Date.now()}.wav`);
      const outputPath = path.join(tempDir, `output-${Date.now()}.wav`);
      
      await promisify(fs.writeFile)(inputPath, audioBuffer);

      // Convert audio to compatible format
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .toFormat('wav')
          .on('end', resolve)
          .on('error', reject)
          .save(outputPath);
      });

      // Read converted audio file
      const processedAudio = await promisify(fs.readFile)(outputPath);
      
      // Clean up temporary files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      // Process with Gemini (assuming text transcription is needed first)
      // Note: You might need to use a separate speech-to-text service here
      // as Gemini doesn't directly process audio. This is a placeholder.
      const result = await this.model.generateContent([
        `${prompt}\nPlease analyze the following audio transcription: [Audio Content]`
      ]);

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing audio with Gemini:', error);
      throw new Error('Failed to process audio input');
    }
  }

  // Multi-modal processing (combining different types of inputs)
  async processMultiModal(inputs: Array<{ type: 'text' | 'image' | 'audio', content: Buffer | string, prompt?: string }>): Promise<string> {
    try {
      const parts = [];

      for (const input of inputs) {
        switch (input.type) {
          case 'text':
            parts.push({ text: input.content as string });
            break;
          case 'image':
            const fileType = await fileTypeFromBuffer(input.content as Buffer);
            if (fileType && fileType.mime.startsWith('image/')) {
              parts.push({
                inlineData: {
                  data: (input.content as Buffer).toString('base64'),
                  mimeType: fileType.mime
                }
              });
            }
            break;
          // Audio would need to be handled separately or transcribed first
        }
      }

      const result = await this.visionModel.generateContent(parts);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing multi-modal input with Gemini:', error);
      throw new Error('Failed to process multi-modal input');
    }
  }
}
