
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, MicOff, Camera, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Start recording
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast({
            title: "Recording started",
            description: "Speak your message. Click the mic again to stop.",
          });
        })
        .catch(() => {
          toast({
            title: "Microphone access denied",
            description: "Please allow microphone access to use voice input.",
            variant: "destructive",
          });
        });
    } else {
      // Stop recording
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Voice message will be processed...",
      });
      // In a real implementation, you would process the audio here
      setMessage(prev => prev + " [Voice message recorded]");
    }
  };

  const handleScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { mediaSource: 'screen' } 
      });
      
      // Create a video element to capture the frame
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        // Create canvas to capture the screenshot
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        // Convert to blob and create attachment
        canvas.toBlob((blob) => {
          if (blob) {
            const attachment = {
              id: Date.now().toString() + Math.random(),
              name: `screenshot-${new Date().toISOString()}.png`,
              type: 'image',
              url: URL.createObjectURL(blob),
              size: blob.size,
            };
            setAttachments(prev => [...prev, attachment]);
          }
        }, 'image/png');
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      toast({
        title: "Screen captured",
        description: "Screenshot has been added to your message.",
      });
    } catch (error) {
      toast({
        title: "Screen capture failed",
        description: "Unable to capture screen. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const attachment = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(file),
          size: file.size,
        };
        setAttachments(prev => [...prev, attachment]);
      });
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map(attachment => (
            <div key={attachment.id} className="relative group">
              {attachment.type === 'image' ? (
                <div className="relative">
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="relative flex items-center gap-2 p-2 bg-gray-100 rounded-lg border max-w-40">
                  <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-xs truncate">{attachment.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    ×
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 p-3 border rounded-2xl bg-white shadow-sm">
        {/* Attachment buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onClick={handleScreenCapture}
            title="Capture screen"
          >
            <Camera className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn("w-9 h-9", isRecording && "bg-red-100 text-red-600")}
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Voice input"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>

        {/* Text input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe your IT issue, attach files, capture screen, or use voice input..."
          className="flex-1 min-h-[20px] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 p-0"
          rows={1}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,.log,.zip,.rar,image/*"
        />
      </div>

      {/* Input suggestions */}
      <div className="flex flex-wrap gap-2">
        {['My computer won\'t start', 'Software installation help', 'Network connectivity issues', 'Password reset'].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setMessage(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MessageInput;
