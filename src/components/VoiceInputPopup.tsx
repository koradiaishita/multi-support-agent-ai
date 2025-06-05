
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mic, MicOff, Square, Play, RotateCcw, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSendTranscript: (transcript: string) => void;
}

const VoiceInputPopup: React.FC<VoiceInputPopupProps> = ({
  isOpen,
  onClose,
  onSendTranscript,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          title: "Speech Recognition Error",
          description: "Unable to process speech. Please try again.",
          variant: "destructive",
        });
      };
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [toast]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start audio recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRecording(false);
    
    toast({
      title: "Recording stopped",
      description: "Review your transcript and send when ready.",
    });
  };

  const resetRecording = () => {
    setTranscript('');
    setRecordingTime(0);
    setAudioUrl(null);
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSend = () => {
    if (transcript.trim()) {
      onSendTranscript(transcript);
      resetRecording();
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md tcs-card border-orange-500/30 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-orange-400" />
            Voice Input
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="w-16 h-16 rounded-full tcs-gradient shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105"
                size="icon"
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-2xl hover:shadow-red-500/30 transition-all hover:scale-105"
                size="icon"
              >
                <Square className="w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 font-medium">Recording</span>
              </div>
              <p className="text-lg font-mono text-orange-400">{formatTime(recordingTime)}</p>
            </div>
          )}

          {/* Transcript Display */}
          {transcript && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-300">Transcript:</label>
              <div className="p-4 rounded-lg tcs-input-gradient border border-orange-500/30 min-h-[100px] max-h-[200px] overflow-y-auto">
                <p className="text-slate-100 leading-relaxed">
                  {transcript || "Your speech will appear here..."}
                </p>
              </div>
            </div>
          )}

          {/* Audio Playback */}
          {audioUrl && (
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={playAudio}
                variant="outline"
                size="sm"
                className="tcs-button-secondary border-orange-500/30 hover:border-orange-500/50"
              >
                {isPlaying ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Stop' : 'Play'} Recording
              </Button>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={resetRecording}
              variant="outline"
              className="flex-1 tcs-button-secondary border-orange-500/30 hover:border-orange-500/50"
              disabled={!transcript && !audioUrl}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSend}
              className="flex-1 tcs-gradient shadow-2xl hover:shadow-orange-500/30 transition-all hover:scale-105"
              disabled={!transcript.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceInputPopup;
