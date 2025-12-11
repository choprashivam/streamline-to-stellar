import { useApp } from '@/context/AppContext';
import { SystemGauge } from '@/components/shared/SystemGauge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Monitor, 
  Cpu, 
  Wifi,
  RefreshCw,
  Sparkles,
  Bot,
  BarChart3,
  Wrench,
  Ticket,
  Server,
  Package,
  Shield,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const { currentAgent } = useApp();

  if (!currentAgent) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-screen">
        <Card className="max-w-md premium-card">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-2xl icon-wrapper flex items-center justify-center">
              <Monitor className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No Device Detected</h2>
              <p className="text-muted-foreground">
                Please ensure the SysAI Agent is running on your system.
              </p>
            </div>
            <code className="text-sm bg-secondary px-4 py-2 rounded-lg block">?agent_id=YOUR_AGENT_ID</code>
          </CardContent>
        </Card>
      </div>
    );
  }

  const features = [
    { icon: Sparkles, title: 'AI-Powered Classification', description: 'Smart ticket routing', href: '/tickets', color: 'text-primary' },
    { icon: Bot, title: 'Intelligent Chatbot', description: 'Instant IT assistance', href: '/chatbot', color: 'text-accent' },
    { icon: BarChart3, title: 'Anomaly Detection', description: 'Real-time monitoring', href: '/health', color: 'text-success' },
    { icon: Wrench, title: 'Troubleshooting', description: 'Service management', href: '/troubleshoot', color: 'text-warning' },
    { icon: Ticket, title: 'Ticket Management', description: 'Track & resolve issues', href: '/tickets', color: 'text-primary' },
    { icon: Package, title: 'App Installer', description: 'Software deployment', href: '/app-installer', color: 'text-accent' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl premium-card p-8 lg:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl icon-wrapper">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold gradient-text">SYS AI</h1>
                <p className="text-muted-foreground">L1 Support Engineer</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl">
              Your intelligent IT support companion. Powered by AI to resolve issues faster and smarter.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-success/10 border border-success/20">
              <div className="w-3 h-3 rounded-full bg-success pulse-online" />
              <span className="font-medium text-success">Connected</span>
            </div>
            <Button variant="outline" size="icon" className="rounded-xl h-12 w-12">
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hostname', value: currentAgent.hostname, icon: Monitor },
          { label: 'Username', value: currentAgent.username, icon: Shield },
          { label: 'OS', value: currentAgent.os, icon: Server },
          { label: 'IP Address', value: currentAgent.ip_address, icon: Wifi },
        ].map((stat, i) => (
          <Card key={i} className="premium-card metric-card">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-semibold text-lg truncate">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl icon-wrapper flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health */}
      <Card className="premium-card overflow-visible">
        <CardHeader className="pb-2">
          <CardTitle className="section-title">
            <div className="w-8 h-8 rounded-lg icon-wrapper flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap justify-center lg:justify-around gap-8 lg:gap-4 py-6">
            <SystemGauge
              value={currentAgent.metrics.cpu_usage}
              label="CPU"
              icon="⚡"
              size="lg"
              colorThresholds={{ warning: 60, danger: 85 }}
            />
            <SystemGauge
              value={currentAgent.metrics.ram_usage}
              label="Memory"
              icon="🧠"
              size="lg"
              colorThresholds={{ warning: 70, danger: 90 }}
            />
            <SystemGauge
              value={currentAgent.metrics.disk_usage}
              label="Disk"
              icon="💾"
              size="lg"
              colorThresholds={{ warning: 75, danger: 90 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="space-y-4">
        <h2 className="section-title px-1">
          <Sparkles className="w-5 h-5 text-primary" />
          AI-Powered Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <Link
              key={i}
              to={feature.href}
              className="feature-card group cursor-pointer"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl icon-wrapper flex items-center justify-center shrink-0`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="premium-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm text-muted-foreground">Start a conversation with our AI assistant</p>
              </div>
            </div>
            <Link to="/chatbot">
              <Button className="gap-2 rounded-xl px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                Open Chatbot
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}