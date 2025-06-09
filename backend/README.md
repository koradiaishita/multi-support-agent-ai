# Multi-Support Agent Backend

This is the backend server for the Multi-Support Agent application, built with Node.js, Express, and TypeScript. It uses Google's Gemini AI for processing text, images, and generating responses.

## Features

- Chat conversation management
- File upload handling
- AI-powered responses using Gemini
- Support for text, image, and audio processing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following configuration:
   ```
   PORT=3001
   GEMINI_API_KEY=your-gemini-api-key-here
   UPLOAD_DIR=uploads
   NODE_ENV=development
   ```

3. Replace `your-gemini-api-key-here` with your actual Gemini API key.

## Development

Start the development server:
```bash
npm run dev
```

The server will start on http://localhost:3001

## Build

Build the project for production:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## API Endpoints

### Conversations
- `GET /api/chat` - Get all conversations
- `GET /api/chat/:id` - Get a specific conversation
- `POST /api/chat` - Create a new conversation
- `POST /api/chat/:conversationId/messages` - Add a message to a conversation
- `DELETE /api/chat/:id` - Delete a conversation

### AI Processing
- `POST /api/ai/process-text` - Process text input
- `POST /api/ai/process-image` - Process image input
- `POST /api/ai/process-audio` - Process audio input
- `POST /api/ai/process-multimodal` - Process multiple types of input

## File Upload

The server supports file uploads with the following configurations:
- Maximum file size: 10MB
- Supported file types: Images, audio, documents
- Files are stored in the `/uploads` directory

## Environment Variables

- `PORT`: Server port (default: 3001)
- `GEMINI_API_KEY`: Google Gemini AI API key
- `UPLOAD_DIR`: Directory for file uploads
- `NODE_ENV`: Environment (development/production)
