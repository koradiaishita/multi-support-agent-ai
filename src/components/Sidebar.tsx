
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, MessageSquare, Settings, HelpCircle, Menu } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  isOpen,
  onToggle,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}
      
      <div className={cn(
        "fixed lg:relative inset-y-0 left-0 z-50 flex flex-col text-slate-50 transition-all duration-300 border-r border-blue-500/20",
        "bg-gradient-to-b from-slate-900 to-blue-900",
        isOpen ? "w-80" : "w-0 lg:w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-500/20 bg-gradient-to-r from-slate-900/95 to-blue-900/90 backdrop-blur-sm">
          <div className={cn("flex items-center gap-3", !isOpen && "lg:justify-center")}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
              T
            </div>
            {isOpen && (
              <div>
                <h1 className="font-bold text-lg text-white">Tia IT Support Agents</h1>
                <p className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">AI-Powered Assistant</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-slate-300 hover:bg-blue-500/10 lg:hidden border border-blue-500/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {isOpen && (
          <>
            {/* New Conversation Button */}
            <div className="p-4">
              <Button 
                onClick={onNewConversation}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>

            {/* Conversations List */}
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => onConversationSelect(conversation.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300",
                      "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 border border-transparent",
                      activeConversationId === conversation.id 
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 shadow-lg" 
                        : "hover:border-blue-500/30"
                    )}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                    <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-slate-100">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {conversation.messages.length} messages • {formatTime(conversation.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="bg-gradient-to-r from-blue-500/20 to-purple-500/20" />

            {/* Footer */}
            <div className="p-4 space-y-2 bg-gradient-to-r from-slate-900/95 to-blue-900/90 backdrop-blur-sm">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-white border border-transparent hover:border-blue-500/30"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-white border border-transparent hover:border-blue-500/30"
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </Button>
            </div>
          </>
        )}

        {/* Collapsed state toggle */}
        {!isOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex mx-2 my-4 text-slate-300 hover:bg-blue-500/10 border border-blue-500/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default Sidebar;
