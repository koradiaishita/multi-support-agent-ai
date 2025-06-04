
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
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Voice message will be processed...",
      });
      setMessage(prev => prev + " [Voice message recorded]");
    }
  };

  const handleScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
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
                    className="w-16 h-16 object-cover rounded-lg border border-slate-600 shadow-lg"
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
                <div className="relative flex items-center gap-2 p-2 bg-slate-700 rounded-lg border border-slate-600 max-w-40 shadow-lg">
                  <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs truncate text-slate-200">{attachment.name}</span>
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
      <div className="flex items-end gap-3 p-4 border border-slate-600 rounded-2xl bg-slate-800 shadow-xl backdrop-blur-sm">
        {/* Attachment buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition-all"
            onClick={handleScreenCapture}
            title="Capture screen"
          >
            <Camera className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-9 h-9 transition-all",
              isRecording 
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                : "text-slate-400 hover:text-blue-400 hover:bg-slate-700"
            )}
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
          className="flex-1 min-h-[24px] max-h-32 resize-none border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent text-slate-100 placeholder:text-slate-500"
          rows={1}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() && attachments.length === 0}
          className="w-10 h-10 rounded-xl tcs-gradient shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
        {[
          'Server connectivity issues', 
          'Software installation help', 
          'Network configuration', 
          'Security incident report'
        ].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="text-xs tcs-button-secondary border-slate-600 hover:border-blue-500 transition-all"
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
