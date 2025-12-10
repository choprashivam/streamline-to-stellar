import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { services } from '@/lib/mock-data';
import { RefreshCw, Check, AlertTriangle, Loader2, Settings, Wifi, Printer, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const serviceIcons: Record<string, React.ReactNode> = {
  'Printer Service': <Printer className="w-5 h-5" />,
  'Wi-Fi Service': <Wifi className="w-5 h-5" />,
  'Windows Update': <RefreshCw className="w-5 h-5" />,
  'Remote Desktop': <Settings className="w-5 h-5" />,
  'DNS Client': <Globe className="w-5 h-5" />,
  'DHCP Client': <Globe className="w-5 h-5" />,
  'Windows Firewall': <Shield className="w-5 h-5" />,
};

export default function TroubleshootPage() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [isRestarting, setIsRestarting] = useState(false);
  const [restartHistory, setRestartHistory] = useState<
    { service: string; status: 'success' | 'warning' | 'error'; time: Date; message: string }[]
  >([]);

  const handleRestart = async () => {
    if (!selectedService) return;

    setIsRestarting(true);
    const service = services.find(s => s.name === selectedService);

    // Simulate service restart
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.2; // 80% success rate simulation
    const newEntry = {
      service: selectedService,
      status: success ? ('success' as const) : ('warning' as const),
      time: new Date(),
      message: success
        ? `✅ ${service?.display_name} restarted successfully`
        : `⚠️ ${service?.display_name} restart attempted - may require admin privileges`,
    };

    setRestartHistory(prev => [newEntry, ...prev]);
    setIsRestarting(false);

    if (success) {
      toast.success(`${service?.display_name} restarted successfully!`);
    } else {
      toast.warning(`${service?.display_name} restart may require admin privileges`);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Troubleshoot"
        description="Restart Windows services to resolve common issues"
        icon="🔄"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Restart Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Service Restart
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a service to restart</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a service..." />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.service_name} value={service.name}>
                      <div className="flex items-center gap-2">
                        {serviceIcons[service.name] || <Settings className="w-4 h-4" />}
                        <span>{service.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div className="p-4 bg-secondary/50 rounded-lg space-y-2 animate-scale-in">
                <p className="text-sm font-medium">Selected Service:</p>
                <div className="flex items-center gap-2">
                  {serviceIcons[selectedService]}
                  <span className="font-semibold">{selectedService}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Service Name:{' '}
                  <code className="bg-muted px-1 rounded">
                    {services.find(s => s.name === selectedService)?.service_name}
                  </code>
                </p>
              </div>
            )}

            <Button
              onClick={handleRestart}
              disabled={!selectedService || isRestarting}
              className="w-full gap-2"
              size="lg"
            >
              {isRestarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Restarting...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Restart Service
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Common Issues Card */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Common Issues & Solutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  issue: 'Printer not working',
                  solution: 'Restart the Print Spooler service',
                  service: 'Printer Service',
                },
                {
                  issue: 'Wi-Fi keeps disconnecting',
                  solution: 'Restart the WLAN AutoConfig service',
                  service: 'Wi-Fi Service',
                },
                {
                  issue: 'Windows Update stuck',
                  solution: 'Restart the Windows Update service',
                  service: 'Windows Update',
                },
                {
                  issue: 'Remote Desktop not connecting',
                  solution: 'Restart Remote Desktop Services',
                  service: 'Remote Desktop',
                },
                {
                  issue: 'DNS resolution issues',
                  solution: 'Restart the DNS Client service',
                  service: 'DNS Client',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedService(item.service)}
                >
                  <p className="font-medium text-sm">{item.issue}</p>
                  <p className="text-xs text-muted-foreground mt-1">💡 {item.solution}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restart History */}
      {restartHistory.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Restart History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {restartHistory.map((entry, i) => (
                <div
                  key={i}
                  className={cn(
                    'p-3 rounded-lg flex items-center justify-between',
                    entry.status === 'success' ? 'bg-success/10' : 'bg-warning/10'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {entry.status === 'success' ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                    <span className="font-medium text-sm">{entry.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {entry.time.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
