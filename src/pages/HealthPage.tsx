import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { SystemGauge } from '@/components/shared/SystemGauge';
import { MetricCard } from '@/components/shared/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockHealthReport } from '@/lib/mock-data';
import {
  Activity,
  RefreshCw,
  Download,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick,
  Monitor,
  Bot,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function HealthPage() {
  const { currentAgent } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedLog, setExpandedLog] = useState<number | null>(0);
  const report = mockHealthReport;

  const handleRefresh = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    toast.success('Health report refreshed!');
  };

  const handleBoost = async () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 3000)),
      {
        loading: 'Optimizing system...',
        success: 'System optimized! Cleared temporary files and freed up memory.',
        error: 'Optimization failed',
      }
    );
  };

  const aiRecommendation = `Based on the current system analysis, here are my recommendations:

**1. Disk Usage Alert**
Your disk usage is at ${report.metrics.disk_usage}%, which is above the recommended threshold. Consider:
- Running Disk Cleanup to remove temporary files
- Uninstalling unused applications
- Moving large files to external storage

**2. Pending Updates**
There are Windows updates waiting to be installed. Schedule a restart during off-hours to complete the installation.

**3. Memory Optimization**
RAM usage at ${report.metrics.ram_usage}% is moderate. If you experience slowdowns:
- Close unnecessary browser tabs
- Restart memory-intensive applications
- Consider adding more RAM if issues persist

**4. Overall Health: Good**
Your system is performing within acceptable parameters. Continue regular maintenance for optimal performance.`;

  if (!currentAgent) {
    return (
      <div className="p-6 lg:p-8">
        <PageHeader title="Proactive System Health" icon="🛡️" />
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
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Proactive System Health Agent"
        description="AI-powered system health monitoring and recommendations"
        icon="🛡️"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleBoost}>
              <Zap className="w-4 h-4" />
              Boost System
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
              <RefreshCw className={cn('w-4 h-4', isAnalyzing && 'animate-spin')} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download JSON
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={`${report.metrics.cpu_usage}%`}
          icon={Cpu}
          variant={report.metrics.cpu_usage > 80 ? 'danger' : report.metrics.cpu_usage > 60 ? 'warning' : 'default'}
        />
        <MetricCard
          title="RAM Usage"
          value={`${report.metrics.ram_usage}%`}
          icon={MemoryStick}
          variant={report.metrics.ram_usage > 80 ? 'danger' : report.metrics.ram_usage > 60 ? 'warning' : 'default'}
        />
        <MetricCard
          title="Disk Usage"
          value={`${report.metrics.disk_usage}%`}
          icon={HardDrive}
          variant={report.metrics.disk_usage > 80 ? 'danger' : report.metrics.disk_usage > 60 ? 'warning' : 'default'}
        />
        <MetricCard
          title="System Status"
          value="Healthy"
          icon={Activity}
          variant="success"
        />
      </div>

      {/* Updates & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Updates Panel */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Windows Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Updates Pending</p>
                <div className="flex items-center gap-2 mt-1">
                  {report.updates.pending_updates ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="font-semibold text-warning">Yes</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="font-semibold text-success">No</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Reboot Required</p>
                <div className="flex items-center gap-2 mt-1">
                  {report.updates.reboot_required ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="font-semibold text-warning">Yes</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="font-semibold text-success">No</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {report.updates.update_details && report.updates.update_details.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Recent Hotfixes</p>
                <div className="space-y-2">
                  {report.updates.update_details.map((update, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 bg-secondary/20 rounded"
                    >
                      <code className="text-sm">{update.HotFixID}</code>
                      <span className="text-xs text-muted-foreground">{update.InstalledOn}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {report.alerts.length === 0 ? (
              <div className="flex items-center gap-2 text-success py-4">
                <CheckCircle className="w-5 h-5" />
                <span>No critical alerts</span>
              </div>
            ) : (
              <div className="space-y-2">
                {report.alerts.map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg"
                  >
                    <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{alert}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Critical Event Logs */}
      {report.critical_event_logs.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Recent Critical Event Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {report.critical_event_logs.map((log, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedLog(expandedLog === i ? null : i)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedLog === i ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-medium text-sm">
                        {i + 1}. {log.Message?.substring(0, 60) || log.EventID || 'Event Log'}...
                      </span>
                    </div>
                    <Badge variant="outline">{log.Source}</Badge>
                  </button>
                  {expandedLog === i && (
                    <div className="p-3 bg-muted/30 border-t border-border">
                      <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(log, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendation */}
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {aiRecommendation.split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h4 key={i} className="font-semibold text-foreground mt-4 first:mt-0">
                    {line.replace(/\*\*/g, '')}
                  </h4>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={i} className="text-muted-foreground ml-4">
                    {line.substring(2)}
                  </li>
                );
              }
              return (
                <p key={i} className="text-muted-foreground">
                  {line}
                </p>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Snapshot */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Monitor className="w-5 h-5 text-primary" />
            System Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Hostname</p>
              <p className="font-medium">{currentAgent.hostname}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium">{currentAgent.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">OS</p>
              <p className="font-medium">{currentAgent.os}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Agent ID</p>
              <p className="font-mono text-sm">{currentAgent.agent_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
