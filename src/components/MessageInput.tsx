import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Mic, Camera, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import VoiceInputPopup from './VoiceInputPopup';
import ExportData from './ExportData';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: any[]) => void;
  conversationData?: any;
  onClearConversation?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  conversationData,
  onClearConversation 
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [isVoicePopupOpen, setIsVoicePopupOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  const handleVoiceTranscript = (transcript: string) => {
    // Add the transcript to the current message
    setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
  };

  const handleResetText = () => {
    setMessage('');
    setAttachments([]);
    toast({
      title: "Reset Complete",
      description: "Text input and attachments cleared.",
    });
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Voice Unmuted" : "Voice Muted",
      description: `Voice responses are now ${isMuted ? 'enabled' : 'disabled'}.`,
    });
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
                    className="w-16 h-16 object-cover rounded-lg border border-blue-500/30 shadow-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-red-500 to-red-600"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="relative flex items-center gap-2 p-2 bg-gradient-to-r from-slate-800/80 to-blue-800/80 rounded-lg border border-blue-500/30 max-w-40 shadow-lg backdrop-blur-sm">
                  <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-xs truncate text-slate-200">{attachment.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-red-500 to-red-600"
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
      <div className="flex items-end gap-3 p-4 rounded-2xl bg-gradient-to-r from-slate-800/90 to-blue-800/80 shadow-2xl backdrop-blur-sm border border-blue-500/20">
        {/* Attachment buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all border border-transparent hover:border-purple-500/30"
            onClick={handleScreenCapture}
            title="Capture screen"
          >
            <Camera className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all border border-transparent hover:border-blue-500/30"
            onClick={() => setIsVoicePopupOpen(true)}
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
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
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 border-0"
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
            className="text-xs bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 border-blue-500/30 hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all"
            onClick={() => setMessage(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>

      {/* Voice Input Popup */}
      <VoiceInputPopup
        isOpen={isVoicePopupOpen}
        onClose={() => setIsVoicePopupOpen(false)}
        onSendTranscript={handleVoiceTranscript}
      />
    </div>
  );
};

export default MessageInput;
