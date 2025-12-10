import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Monitor,
  Users,
  Ticket,
  MessageSquare,
  Send,
  Search,
  Cpu,
  HardDrive,
  Clock,
  Activity,
  Camera,
  Trash2,
  CheckCheck,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminPortalPage() {
  const { agents, tickets, updateTicketStatus, chatMessages, addChatMessage, isAdmin } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const onlineAgents = agents.filter(a => a.online);
  const offlineAgents = agents.filter(a => !a.online);

  const selectedAgentData = agents.find(a => a.agent_id === selectedAgent);
  const selectedChatMessages = selectedAgent ? chatMessages[selectedAgent] || [] : [];

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedAgent) return;
    addChatMessage(selectedAgent, {
      user: selectedAgent,
      role: 'it',
      message: chatInput.trim(),
      status: 'sent',
    });
    setChatInput('');
    toast.success('Message sent');
  };

  const handleRequestScreenshot = (agentId: string) => {
    toast.success('Screenshot request sent to device');
  };

  if (!isAdmin) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Admin Portal" icon="🛡️" />
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You are not authorized to access the Admin Portal.
              <br />
              Enable Admin Mode from the Home page to access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Admin Portal"
        description="Manage tickets, view devices and chat with users"
        icon="🛡️"
      />

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="gap-2">
            <Activity className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-2">
            <Monitor className="w-4 h-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="w-4 h-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Devices"
              value={agents.length}
              icon={Monitor}
            />
            <MetricCard
              title="Online"
              value={onlineAgents.length}
              icon={Wifi}
              variant="success"
            />
            <MetricCard
              title="Offline"
              value={offlineAgents.length}
              icon={WifiOff}
              variant={offlineAgents.length > 0 ? 'warning' : 'default'}
            />
          </div>

          {onlineAgents.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-8 text-center text-muted-foreground">
                No devices are currently online.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {onlineAgents.map(agent => (
                <Card key={agent.agent_id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Monitor className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{agent.hostname}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.username} • {agent.ip_address}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status="online" showPulse />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-secondary/30 rounded">
                        <p className="text-muted-foreground text-xs">CPU</p>
                        <p className="font-semibold">{agent.metrics.cpu_usage}%</p>
                      </div>
                      <div className="text-center p-2 bg-secondary/30 rounded">
                        <p className="text-muted-foreground text-xs">RAM</p>
                        <p className="font-semibold">{agent.metrics.ram_usage}%</p>
                      </div>
                      <div className="text-center p-2 bg-secondary/30 rounded">
                        <p className="text-muted-foreground text-xs">Disk</p>
                        <p className="font-semibold">{agent.metrics.disk_usage}%</p>
                      </div>
                    </div>
                    {agent.top_app_today && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Top app: {agent.top_app_today.name} (
                        {Math.floor(agent.top_app_today.seconds / 60)}m)
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent ID</TableHead>
                    <TableHead>Hostname</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>CPU %</TableHead>
                    <TableHead>RAM %</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents
                    .filter(
                      a =>
                        a.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.agent_id.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(agent => (
                      <TableRow
                        key={agent.agent_id}
                        className="table-row-hover cursor-pointer"
                        onClick={() => setSelectedAgent(agent.agent_id)}
                      >
                        <TableCell className="font-mono text-xs">{agent.agent_id}</TableCell>
                        <TableCell className="font-medium">{agent.hostname}</TableCell>
                        <TableCell>{agent.username}</TableCell>
                        <TableCell className="font-mono text-sm">{agent.ip_address}</TableCell>
                        <TableCell>
                          <StatusBadge status={agent.online ? 'online' : 'offline'} />
                        </TableCell>
                        <TableCell>{agent.metrics.cpu_usage}%</TableCell>
                        <TableCell>{agent.metrics.ram_usage}%</TableCell>
                        <TableCell className="text-muted-foreground">
                          {agent.last_seen_human || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedAgentData && (
            <Card className="glass-card animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">
                  Device Details: {selectedAgentData.hostname}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{selectedAgentData.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-mono">{selectedAgentData.ip_address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Operating System</p>
                  <p className="font-medium">{selectedAgentData.os}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Processor</p>
                  <p className="font-medium text-sm">
                    {selectedAgentData.device_info?.processor || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card className="glass-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map(ticket => (
                    <TableRow key={ticket.ticket_id} className="table-row-hover">
                      <TableCell className="font-mono text-sm">{ticket.ticket_id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ticket.issue}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-secondary rounded text-xs">
                          {ticket.category}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.username || 'N/A'}</TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onValueChange={value =>
                            updateTicketStatus(ticket.ticket_id, value as any)
                          }
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unresolved">Unresolved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Device List */}
            <Card className="glass-card">
              <CardHeader className="py-3">
                <CardTitle className="text-base">Select Device</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {agents.map(agent => (
                    <button
                      key={agent.agent_id}
                      className={cn(
                        'w-full p-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors border-b border-border',
                        selectedAgent === agent.agent_id && 'bg-secondary'
                      )}
                      onClick={() => setSelectedAgent(agent.agent_id)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          {agent.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{agent.hostname}</p>
                        <p className="text-xs text-muted-foreground">{agent.username}</p>
                      </div>
                      <div className={cn('w-2 h-2 rounded-full', agent.online ? 'bg-success' : 'bg-muted')} />
                    </button>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="glass-card lg:col-span-2 flex flex-col">
              {selectedAgent ? (
                <>
                  <CardHeader className="py-3 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-semibold text-primary">
                            {selectedAgentData?.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-base">{selectedAgentData?.hostname}</CardTitle>
                          <p className="text-xs text-muted-foreground">{selectedAgentData?.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRequestScreenshot(selectedAgent)}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCheck className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {selectedChatMessages.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No messages yet. Start a conversation!
                        </p>
                      ) : (
                        selectedChatMessages.map(msg => (
                          <div
                            key={msg.msg_id}
                            className={cn(
                              'flex flex-col',
                              msg.role === 'it' ? 'items-end' : 'items-start'
                            )}
                          >
                            <div
                              className={cn(
                                'max-w-[80%] rounded-2xl px-4 py-3',
                                msg.role === 'it'
                                  ? 'bg-primary text-primary-foreground rounded-br-md'
                                  : 'bg-secondary rounded-bl-md'
                              )}
                            >
                              <p className="text-sm">{msg.message}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 px-1">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border">
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!chatInput.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <p className="text-muted-foreground">Select a device to start chatting</p>
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
