import { useState, useRef, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your IT Support assistant. How can I help you today? I can assist with:\n\n• Software issues\n• Network connectivity\n• Password resets\n• Hardware problems\n• General IT questions',
    timestamp: new Date(),
  },
];

const quickReplies = [
  'My computer is running slow',
  'I can\'t connect to the VPN',
  'How do I reset my password?',
  'Printer not working',
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        slow: 'I understand your computer is running slow. Here are some steps you can try:\n\n1. **Restart your computer** - This clears temporary files and refreshes system resources.\n2. **Check Task Manager** - Press Ctrl+Shift+Esc to see what\'s using resources.\n3. **Run Disk Cleanup** - Type "Disk Cleanup" in the Start menu.\n4. **Close unnecessary programs** - Each open application uses memory.\n\nWould you like me to guide you through any of these steps?',
        vpn: 'VPN connection issues can be frustrating. Let\'s troubleshoot:\n\n1. **Check your internet connection** - Make sure you\'re connected to the internet first.\n2. **Restart the VPN client** - Close and reopen the application.\n3. **Try a different VPN server** - Sometimes servers are overloaded.\n4. **Check your credentials** - Make sure your login details are correct.\n\nIf the issue persists, I can create a ticket for the network team.',
        password: 'To reset your password:\n\n1. **Go to the Self-Service Portal** - Visit https://passwordreset.company.com\n2. **Click "Forgot Password"** - Enter your email address.\n3. **Check your email** - You\'ll receive a reset link within 5 minutes.\n4. **Create a new password** - Must be at least 12 characters with uppercase, lowercase, numbers, and symbols.\n\nIf you\'re locked out, I can create a ticket for immediate assistance.',
        printer: 'Let\'s fix your printer issue:\n\n1. **Check if the printer is on** - Look for power lights.\n2. **Verify the connection** - Ensure USB/network cable is connected.\n3. **Restart the Print Spooler** - Go to Troubleshoot page to restart the service.\n4. **Update printer drivers** - I can help you install the latest drivers.\n\nWhich printer model are you having trouble with?',
      };

      let responseContent = 'I understand you need help. Could you please provide more details about your issue? I\'m here to assist with any IT-related problems.';
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('slow')) responseContent = responses.slow;
      else if (lowerText.includes('vpn')) responseContent = responses.vpn;
      else if (lowerText.includes('password')) responseContent = responses.password;
      else if (lowerText.includes('printer')) responseContent = responses.printer;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen flex flex-col p-6 lg:p-8 animate-fade-in">
      <PageHeader
        title="IT Support Chatbot"
        description="Get instant help with your IT issues"
        icon="💬"
      />

      <Card className="flex-1 mt-6 flex flex-col overflow-hidden glass-card">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 animate-slide-up',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary text-secondary-foreground rounded-bl-md'
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p
                    className={cn(
                      'text-xs mt-2',
                      message.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Replies */}
        <div className="px-4 py-2 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSend(reply)}
                disabled={isLoading}
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
