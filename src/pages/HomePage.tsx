import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { SystemGauge } from '@/components/shared/SystemGauge';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Monitor, 
  User, 
  Globe, 
  Cpu, 
  HardDrive, 
  Clock,
  Wifi,
  Shield,
  RefreshCw,
} from 'lucide-react';

export default function HomePage() {
  const { currentAgent, isAdmin, setIsAdmin } = useApp();

  if (!currentAgent) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-warning/10 flex items-center justify-center">
              <Monitor className="w-8 h-8 text-warning" />
            </div>
            <h2 className="text-xl font-semibold">No Device Detected</h2>
            <p className="text-muted-foreground">
              Please ensure the SysAI Agent is running on your system or open the URL with your agent ID.
            </p>
            <code className="text-sm bg-muted px-3 py-1 rounded">?agent_id=YOUR_AGENT_ID</code>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <PageHeader
          title="SYS AI — L1 Support Engineer"
          description={`Connected as ${currentAgent.hostname}`}
          icon="🛠️"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="admin-mode"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
            <Label htmlFor="admin-mode" className="text-sm font-medium">
              Admin Mode
            </Label>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="border-success/30 bg-success/5">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="font-medium text-success">Connected as Agent:</span>
            <code className="bg-success/10 text-success px-2 py-0.5 rounded text-sm font-mono">
              {currentAgent.agent_id}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Device Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Hostname</p>
                <p className="font-medium">{currentAgent.hostname}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{currentAgent.username}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Operating System</p>
                <p className="font-medium">{currentAgent.os}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IP Address</p>
                <p className="font-medium font-mono text-sm">{currentAgent.ip_address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Manufacturer</p>
                <p className="font-medium">{currentAgent.device_info?.manufacturer || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Processor</p>
                <p className="font-medium text-sm">{currentAgent.device_info?.processor || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <StatusBadge status={currentAgent.online ? 'online' : 'offline'} showPulse />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Last Seen</p>
                <p className="font-medium">{currentAgent.last_seen_human || 'Just now'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Session Duration</p>
                <p className="font-medium">
                  {currentAgent.session_duration
                    ? `${Math.floor(currentAgent.session_duration / 3600)}h ${Math.floor((currentAgent.session_duration % 3600) / 60)}m`
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Idle Time</p>
                <p className="font-medium">{currentAgent.idle_human || 'Active'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health Gauges */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-12 py-6">
            <SystemGauge
              value={currentAgent.metrics.ram_usage}
              label="RAM"
              icon="💾"
              size="lg"
            />
            <SystemGauge
              value={currentAgent.metrics.cpu_usage}
              label="CPU"
              icon="💻"
              size="lg"
            />
            <SystemGauge
              value={currentAgent.metrics.disk_usage}
              label="Disk"
              icon="🖴"
              size="lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">📌 Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🔍', title: 'AI-Powered Ticket Classification' },
              { icon: '🤖', title: 'Intelligent Chatbot' },
              { icon: '📊', title: 'Log Monitoring & Anomaly Detection' },
              { icon: '🔄', title: 'Troubleshooting & Service Restart' },
              { icon: '🎟️', title: 'Admin Ticket Management' },
              { icon: '🖥', title: 'System Information Dashboard' },
              { icon: '📦', title: 'Application Installer with Admin Approval' },
              { icon: '🛡️', title: 'Proactive System Health Predictions' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="font-medium text-sm">{feature.title}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
