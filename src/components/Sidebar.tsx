
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
        "fixed lg:relative inset-y-0 left-0 z-50 flex flex-col text-slate-50 transition-all duration-300 border-r border-orange-500/20 tcs-sidebar-gradient",
        isOpen ? "w-80" : "w-0 lg:w-16"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-orange-500/20 tcs-header-gradient">
          <div className={cn("flex items-center gap-3", !isOpen && "lg:justify-center")}>
            <div className="flex items-center justify-center tcs-logo-glow">
              <img 
                src="/lovable-uploads/bc6f9ae1-01dc-4a32-a2d2-d22d1b0abacf.png" 
                alt="TCS Logo" 
                className="h-8 w-auto object-contain"
              />
            </div>
            {isOpen && (
              <div>
                <h1 className="font-bold text-lg text-white">TCS IT Support</h1>
                <p className="text-sm tcs-gradient-text font-medium">AI-Powered Assistant</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-slate-300 hover:bg-orange-500/10 lg:hidden border border-orange-500/20"
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
                className="w-full tcs-button-primary font-semibold text-white border-0"
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
                      "hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-purple-500/10 border border-transparent",
                      activeConversationId === conversation.id 
                        ? "tcs-gradient-border shadow-2xl shadow-orange-500/20" 
                        : "hover:border-orange-500/30"
                    )}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full animate-pulse"></div>
                    <MessageSquare className="w-4 h-4 text-orange-400 flex-shrink-0" />
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

            <Separator className="bg-gradient-to-r from-orange-500/20 to-purple-500/20" />

            {/* Footer */}
            <div className="p-4 space-y-2 tcs-header-gradient">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-purple-500/10 hover:text-white border border-transparent hover:border-orange-500/30"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-slate-300 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-purple-500/10 hover:text-white border border-transparent hover:border-orange-500/30"
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
            className="hidden lg:flex mx-2 my-4 text-slate-300 hover:bg-orange-500/10 border border-orange-500/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default Sidebar;
