import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Paperclip, Image, AlertTriangle, CheckCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ChatSupportPage() {
  const { currentAgent, chatMessages, addChatMessage, agents } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const agentId = currentAgent?.agent_id || '';
  const messages = chatMessages[agentId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !agentId) return;

    addChatMessage(agentId, {
      user: agentId,
      role: 'user',
      message: input.trim(),
      status: 'sent',
    });
    setInput('');
    
    // Simulate IT response
    setTimeout(() => {
      addChatMessage(agentId, {
        user: agentId,
        role: 'it',
        message: 'Thank you for reaching out. An IT team member will respond shortly.',
        status: 'delivered',
      });
    }, 1000);
  };

  const handleEscalate = () => {
    toast.success('Ticket created and escalated to IT team!', {
      description: 'A support ticket has been created from your chat history.',
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'seen':
        return <CheckCheck className="w-3 h-3 text-info" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      default:
        return <Check className="w-3 h-3 text-muted-foreground" />;
    }
  };

  if (!currentAgent) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Chat Support" description="Connect with IT Support" icon="💬" />
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-warning mb-4" />
            <p className="text-muted-foreground">Please connect to a device first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col p-6 lg:p-8 animate-fade-in">
      <PageHeader
        title="Chat Support"
        description={`Chatting as ${currentAgent.username} (${currentAgent.hostname})`}
        icon="💬"
        actions={
          <Button variant="destructive" size="sm" className="gap-2" onClick={handleEscalate}>
            <AlertTriangle className="w-4 h-4" />
            Escalate to IT
          </Button>
        }
      />

      <Card className="flex-1 mt-6 flex flex-col overflow-hidden glass-card">
        {/* Chat Header */}
        <CardHeader className="py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                IT
              </div>
              <div>
                <CardTitle className="text-base">IT Support Team</CardTitle>
                <p className="text-xs text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No messages yet. Start a conversation with IT Support!</p>
              </div>
            )}
            {messages.map(message => (
              <div
                key={message.msg_id}
                className={cn(
                  'flex flex-col animate-slide-up',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-secondary-foreground rounded-bl-md'
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.message}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.role === 'user' && getStatusIcon(message.status)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => toast.info('File attachment coming soon!')}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => toast.info('Screenshot capture coming soon!')}
            >
              <Image className="w-5 h-5" />
            </Button>
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
