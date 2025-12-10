import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { availableApps, mockAppRequests } from '@/lib/mock-data';
import {
  Download,
  Search,
  Clock,
  Check,
  X,
  Package,
  Code,
  MessageSquare,
  Wrench,
  Film,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, React.ReactNode> = {
  Development: <Code className="w-4 h-4" />,
  Communication: <MessageSquare className="w-4 h-4" />,
  Utilities: <Wrench className="w-4 h-4" />,
  Media: <Film className="w-4 h-4" />,
  Productivity: <FileText className="w-4 h-4" />,
};

export default function AppInstallerPage() {
  const { currentAgent } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState(mockAppRequests);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [...new Set(availableApps.map(app => app.category))];

  const filteredApps = availableApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (appName: string) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      app_name: appName,
      username: currentAgent?.username || 'Unknown',
      hostname: currentAgent?.hostname || 'Unknown',
      status: 'pending' as const,
      requested_at: new Date().toISOString(),
    };
    setRequests(prev => [newRequest, ...prev]);
    toast.success(`Installation request submitted for ${appName}`, {
      description: 'Awaiting admin approval',
    });
  };

  const myRequests = requests.filter(
    r => r.username === currentAgent?.username || r.hostname === currentAgent?.hostname
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Application Installer"
        description="Request software installations with admin approval"
        icon="📦"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Apps */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="gap-1"
                >
                  {categoryIcons[category]}
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Apps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredApps.map(app => {
              const isPending = requests.some(
                r =>
                  r.app_name === app.name &&
                  r.status === 'pending' &&
                  (r.username === currentAgent?.username || r.hostname === currentAgent?.hostname)
              );

              return (
                <Card
                  key={app.name}
                  className={cn(
                    'glass-card hover:shadow-lg transition-all duration-300',
                    isPending && 'border-warning/50'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            {categoryIcons[app.category]}
                            {app.category}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={isPending ? 'outline' : 'default'}
                        disabled={isPending}
                        onClick={() => handleRequest(app.name)}
                        className="gap-1"
                      >
                        {isPending ? (
                          <>
                            <Clock className="w-3 h-3" />
                            Pending
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            Request
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* My Requests */}
        <Card className="glass-card h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              My Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No installation requests yet
              </p>
            ) : (
              <div className="space-y-3">
                {myRequests.map(request => (
                  <div
                    key={request.id}
                    className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{request.app_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
