
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  FileText, 
  RefreshCw, 
  VolumeX, 
  Volume2, 
  Trash2, 
  Copy, 
  Mail,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDataProps {
  onResetText: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onClearConversation: () => void;
  conversationData?: any;
}

const ExportData: React.FC<ExportDataProps> = ({
  onResetText,
  onToggleMute,
  isMuted,
  onClearConversation,
  conversationData
}) => {
  const { toast } = useToast();

  const handleExportJSON = () => {
    if (!conversationData) return;
    
    const dataStr = JSON.stringify(conversationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Conversation exported as JSON file.",
    });
  };

  const handleExportText = () => {
    if (!conversationData?.messages) return;
    
    const textContent = conversationData.messages
      .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const dataBlob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Conversation exported as text file.",
    });
  };

  const handleExportCSV = () => {
    if (!conversationData?.messages) return;
    
    const csvHeaders = 'Timestamp,Role,Content\n';
    const csvContent = conversationData.messages
      .map((msg: any) => {
        const timestamp = msg.timestamp ? new Date(msg.timestamp).toISOString() : new Date().toISOString();
        const role = msg.sender || msg.role || 'unknown';
        const content = `"${msg.content.replace(/"/g, '""')}"`;
        return `${timestamp},${role},${content}`;
      })
      .join('\n');
    
    const csvData = csvHeaders + csvContent;
    const dataBlob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversation-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Conversation exported as CSV file.",
    });
  };

  const handleCopyToClipboard = async () => {
    if (!conversationData?.messages) return;
    
    const textContent = conversationData.messages
      .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(textContent);
      toast({
        title: "Copied",
        description: "Conversation copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = () => {
    if (!conversationData?.messages) return;
    
    const textContent = conversationData.messages
      .map((msg: any) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');
    
    const subject = encodeURIComponent('IT Support Conversation');
    const body = encodeURIComponent(textContent);
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 border-slate-600/50 backdrop-blur-sm hover:border-blue-500/50 transition-all"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-slate-800/95 border-slate-600/50 backdrop-blur-lg shadow-2xl z-50" 
        align="end"
      >
        <DropdownMenuLabel className="text-slate-200 font-semibold">
          Export Formats
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-600/50" />
        
        <DropdownMenuItem 
          onClick={handleExportText}
          className="text-slate-200 hover:bg-blue-500/20 hover:text-white cursor-pointer"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as TXT
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleExportCSV}
          className="text-slate-200 hover:bg-blue-500/20 hover:text-white cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleExportJSON}
          className="text-slate-200 hover:bg-blue-500/20 hover:text-white cursor-pointer"
        >
          <Database className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-slate-600/50" />
        <DropdownMenuLabel className="text-slate-200 font-semibold">
          Quick Actions
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={handleCopyToClipboard}
          className="text-slate-200 hover:bg-blue-500/20 hover:text-white cursor-pointer"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy to Clipboard
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleEmailShare}
          className="text-slate-200 hover:bg-blue-500/20 hover:text-white cursor-pointer"
        >
          <Mail className="w-4 h-4 mr-2" />
          Share via Email
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-slate-600/50" />
        <DropdownMenuLabel className="text-slate-200 font-semibold">
          Controls
        </DropdownMenuLabel>
        
        <DropdownMenuItem 
          onClick={onResetText}
          className="text-slate-200 hover:bg-purple-500/20 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Text Input
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={onToggleMute}
          className="text-slate-200 hover:bg-purple-500/20 hover:text-white cursor-pointer"
        >
          {isMuted ? (
            <>
              <Volume2 className="w-4 h-4 mr-2" />
              Unmute Voice Response
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 mr-2" />
              Mute Voice Response
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-slate-600/50" />
        
        <DropdownMenuItem 
          onClick={onClearConversation}
          className="text-red-300 hover:bg-red-500/20 hover:text-red-200 cursor-pointer"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Conversation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportData;
