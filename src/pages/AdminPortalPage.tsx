import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
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
  Shield,
  Zap,
  TrendingUp,
  Server,
  Globe,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminPortalPage() {
  const { agents, tickets, updateTicketStatus, chatMessages, addChatMessage, isAdmin } = useApp();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const onlineAgents = agents.filter(a => a.online);
  const offlineAgents = agents.filter(a => !a.online);

  const selectedAgentData = agents.find(a => a.agent_id === selectedAgent);
  const selectedChatMessages = selectedAgent ? chatMessages[selectedAgent] || [] : [];

  // Calculate stats
  const stats = useMemo(() => {
    const avgCpu = agents.length > 0 
      ? Math.round(agents.reduce((sum, a) => sum + a.metrics.cpu_usage, 0) / agents.length)
      : 0;
    const avgRam = agents.length > 0
      ? Math.round(agents.reduce((sum, a) => sum + a.metrics.ram_usage, 0) / agents.length)
      : 0;
    const openTickets = tickets.filter(t => t.status === 'unresolved').length;
    const resolvedToday = tickets.filter(t => t.status === 'resolved').length;
    
    return { avgCpu, avgRam, openTickets, resolvedToday };
  }, [agents, tickets]);

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
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full premium-card">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-6 border border-destructive/20">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3 font-[Space_Grotesk]">Access Restricted</h2>
            <p className="text-muted-foreground leading-relaxed">
              You don't have permission to access the Admin Portal.
              <br />
              Please contact your system administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent rounded-full" />
          </div>
        </div>

        <div className="relative px-6 lg:px-8 pt-8 pb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Shield className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-[Space_Grotesk]">
                    Admin <span className="gradient-text">Command Center</span>
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Complete control over your IT infrastructure
                  </p>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-sm font-medium text-success">{onlineAgents.length} Online</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { 
                label: 'Total Devices', 
                value: agents.length, 
                icon: Server, 
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-500/10 to-cyan-500/10',
                change: '+2 this week'
              },
              { 
                label: 'Online Now', 
                value: onlineAgents.length, 
                icon: Wifi, 
                gradient: 'from-emerald-500 to-green-500',
                bgGradient: 'from-emerald-500/10 to-green-500/10',
                change: `${Math.round((onlineAgents.length / agents.length) * 100)}% uptime`
              },
              { 
                label: 'Open Tickets', 
                value: stats.openTickets, 
                icon: Ticket, 
                gradient: 'from-amber-500 to-orange-500',
                bgGradient: 'from-amber-500/10 to-orange-500/10',
                change: 'Needs attention'
              },
              { 
                label: 'Avg CPU Load', 
                value: `${stats.avgCpu}%`, 
                icon: Cpu, 
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-500/10 to-pink-500/10',
                change: 'Across all devices'
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Background */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-500 group-hover:opacity-70",
                  stat.bgGradient
                )} />
                <div className="absolute inset-0 bg-card/60 backdrop-blur-xl" />
                <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent" />
                
                {/* Glow effect on hover */}
                <div className={cn(
                  "absolute -inset-1 bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30",
                  stat.gradient
                )} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                      stat.gradient
                    )}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold tracking-tight font-[Space_Grotesk]">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-foreground/80">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-8 pb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-xl border border-border/50 p-1 rounded-2xl">
            {[
              { value: 'dashboard', label: 'Dashboard', icon: Activity },
              { value: 'devices', label: 'Devices', icon: Monitor },
              { value: 'tickets', label: 'Tickets', icon: Ticket },
              { value: 'chat', label: 'Live Chat', icon: MessageSquare },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground rounded-xl px-6 py-2.5 gap-2 transition-all duration-300"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Devices Panel */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold font-[Space_Grotesk] flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Active Devices
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    Real-time monitoring
                  </span>
                </div>
                
                {onlineAgents.length === 0 ? (
                  <Card className="premium-card">
                    <CardContent className="py-12 text-center">
                      <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No devices currently online</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {onlineAgents.map((agent, i) => (
                      <div
                        key={agent.agent_id}
                        className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {/* Card background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-card via-card to-card/80" />
                        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent" />
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        
                        {/* Hover glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20">
                                  <Monitor className="w-6 h-6 text-primary" />
                                </div>
                                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card pulse-online" />
                              </div>
                              <div>
                                <p className="font-semibold text-lg">{agent.hostname}</p>
                                <p className="text-sm text-muted-foreground">
                                  {agent.username} • {agent.ip_address}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Metrics */}
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'CPU', value: agent.metrics.cpu_usage, color: 'from-blue-500 to-cyan-500' },
                              { label: 'RAM', value: agent.metrics.ram_usage, color: 'from-purple-500 to-pink-500' },
                              { label: 'Disk', value: agent.metrics.disk_usage, color: 'from-amber-500 to-orange-500' },
                            ].map((metric) => (
                              <div key={metric.label} className="text-center">
                                <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-2">
                                  <div
                                    className={cn("absolute inset-y-0 left-0 bg-gradient-to-r rounded-full transition-all duration-1000", metric.color)}
                                    style={{ width: `${metric.value}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">{metric.label}</p>
                                <p className="font-bold font-[Space_Grotesk]">{metric.value}%</p>
                              </div>
                            ))}
                          </div>

                          {agent.top_app_today && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" />
                                Top app: <span className="text-foreground font-medium">{agent.top_app_today.name}</span>
                                <span className="text-primary">({Math.floor(agent.top_app_today.seconds / 60)}m)</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Panel */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold font-[Space_Grotesk] flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Quick Actions
                </h2>
                
                <div className="space-y-3">
                  {[
                    { label: 'View All Devices', icon: Monitor, action: () => setActiveTab('devices'), gradient: 'from-blue-500 to-cyan-500' },
                    { label: 'Manage Tickets', icon: Ticket, action: () => setActiveTab('tickets'), gradient: 'from-amber-500 to-orange-500' },
                    { label: 'Open Chat', icon: MessageSquare, action: () => setActiveTab('chat'), gradient: 'from-green-500 to-emerald-500' },
                  ].map((action, i) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="w-full group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] text-left"
                    >
                      <div className="absolute inset-0 bg-card border border-border/50" />
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-10",
                        action.gradient
                      )} />
                      <div className="relative flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                          action.gradient
                        )}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium flex-1">{action.label}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* System Health */}
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-success" />
                    System Health
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'CPU Average', value: stats.avgCpu, status: stats.avgCpu < 70 ? 'good' : stats.avgCpu < 90 ? 'warning' : 'critical' },
                      { label: 'Memory Usage', value: stats.avgRam, status: stats.avgRam < 70 ? 'good' : stats.avgRam < 90 ? 'warning' : 'critical' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <div className="flex items-center gap-2">
                            {item.status === 'good' && <CheckCircle2 className="w-4 h-4 text-success" />}
                            {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-warning" />}
                            {item.status === 'critical' && <XCircle className="w-4 h-4 text-destructive" />}
                            <span className="font-bold font-[Space_Grotesk]">{item.value}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              item.status === 'good' && 'bg-gradient-to-r from-green-500 to-emerald-500',
                              item.status === 'warning' && 'bg-gradient-to-r from-amber-500 to-orange-500',
                              item.status === 'critical' && 'bg-gradient-to-r from-red-500 to-rose-500'
                            )}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices by name, user, or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-card border-border/50"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl">
                  <Globe className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                    <TableHead className="font-semibold">Device</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">CPU</TableHead>
                    <TableHead className="font-semibold">RAM</TableHead>
                    <TableHead className="font-semibold">Last Seen</TableHead>
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
                        className="cursor-pointer transition-colors hover:bg-primary/5"
                        onClick={() => setSelectedAgent(agent.agent_id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                              <Monitor className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{agent.hostname}</p>
                              <p className="text-xs text-muted-foreground font-mono">{agent.agent_id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{agent.username}</TableCell>
                        <TableCell className="font-mono text-sm">{agent.ip_address}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                            agent.online 
                              ? "bg-success/10 text-success border border-success/20" 
                              : "bg-muted text-muted-foreground border border-border"
                          )}>
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              agent.online ? "bg-success" : "bg-muted-foreground"
                            )} />
                            {agent.online ? 'Online' : 'Offline'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                style={{ width: `${agent.metrics.cpu_usage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{agent.metrics.cpu_usage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: `${agent.metrics.ram_usage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{agent.metrics.ram_usage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {agent.last_seen_human || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {selectedAgentData && (
              <div className="rounded-2xl overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 animate-scale-in">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Monitor className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-[Space_Grotesk]">{selectedAgentData.hostname}</h3>
                      <p className="text-muted-foreground">{selectedAgentData.username}</p>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedAgent(null)} variant="ghost" size="sm">
                    Close
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'IP Address', value: selectedAgentData.ip_address },
                    { label: 'Operating System', value: selectedAgentData.os },
                    { label: 'Processor', value: selectedAgentData.device_info?.processor || 'N/A' },
                    { label: 'Last Seen', value: selectedAgentData.last_seen_human || 'Just now' },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-medium truncate">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="animate-fade-in">
            <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                    <TableHead className="font-semibold">Ticket ID</TableHead>
                    <TableHead className="font-semibold">Issue</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map(ticket => (
                    <TableRow key={ticket.ticket_id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-mono text-sm">{ticket.ticket_id}</TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium">{ticket.issue}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 bg-secondary/50 rounded-lg text-xs font-medium">
                          {ticket.category}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.username || 'N/A'}</TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onValueChange={value => updateTicketStatus(ticket.ticket_id, value as any)}
                        >
                          <SelectTrigger className="w-[130px] h-9 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unresolved">
                              <span className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-destructive" />
                                Unresolved
                              </span>
                            </SelectItem>
                            <SelectItem value="pending">
                              <span className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-warning" />
                                Pending
                              </span>
                            </SelectItem>
                            <SelectItem value="resolved">
                              <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-success" />
                                Resolved
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Device List */}
              <div className="rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Select Device
                  </h3>
                </div>
                <ScrollArea className="h-[540px]">
                  {agents.map(agent => (
                    <button
                      key={agent.agent_id}
                      className={cn(
                        'w-full p-4 flex items-center gap-3 hover:bg-primary/5 transition-all duration-200 border-b border-border/30',
                        selectedAgent === agent.agent_id && 'bg-primary/10'
                      )}
                      onClick={() => setSelectedAgent(agent.agent_id)}
                    >
                      <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                          <span className="font-bold text-primary">
                            {agent.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
                          agent.online ? "bg-success" : "bg-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{agent.hostname}</p>
                        <p className="text-xs text-muted-foreground">{agent.username}</p>
                      </div>
                      {selectedAgent === agent.agent_id && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </ScrollArea>
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-xl flex flex-col">
                {selectedAgent ? (
                  <>
                    <div className="p-4 border-b border-border/50 bg-secondary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <span className="font-bold text-white">
                                {selectedAgentData?.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className={cn(
                              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card",
                              selectedAgentData?.online ? "bg-success" : "bg-muted-foreground"
                            )} />
                          </div>
                          <div>
                            <p className="font-semibold">{selectedAgentData?.hostname}</p>
                            <p className="text-xs text-muted-foreground">{selectedAgentData?.username}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-xl hover:bg-primary/10"
                            onClick={() => handleRequestScreenshot(selectedAgent)}
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                            <CheckCheck className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10 text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {selectedChatMessages.length === 0 ? (
                          <div className="text-center py-12">
                            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">No messages yet</p>
                            <p className="text-sm text-muted-foreground/70">Start a conversation!</p>
                          </div>
                        ) : (
                          selectedChatMessages.map(msg => (
                            <div
                              key={msg.msg_id}
                              className={cn(
                                'flex flex-col max-w-[80%]',
                                msg.role === 'it' ? 'ml-auto items-end' : 'items-start'
                              )}
                            >
                              <div
                                className={cn(
                                  'px-4 py-3 rounded-2xl',
                                  msg.role === 'it'
                                    ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-br-md'
                                    : 'bg-secondary rounded-bl-md'
                                )}
                              >
                                <p className="text-sm">{msg.message}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 px-1">
                                {msg.timestamp}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-border/50">
                      <div className="flex gap-3">
                        <Input
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          placeholder="Type a message..."
                          className="rounded-xl h-12"
                          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="rounded-xl h-12 px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 border border-primary/20">
                        <MessageSquare className="w-10 h-10 text-primary/50" />
                      </div>
                      <p className="text-muted-foreground">Select a device to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
