import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Ticket, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TicketsPage() {
  const { tickets, addTicket, currentAgent } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [issue, setIssue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue.trim()) return;

    // Simple AI classification (mock)
    let category = 'General';
    const lowerIssue = issue.toLowerCase();
    if (lowerIssue.includes('network') || lowerIssue.includes('vpn') || lowerIssue.includes('wifi')) {
      category = 'Network';
    } else if (lowerIssue.includes('software') || lowerIssue.includes('install') || lowerIssue.includes('crash')) {
      category = 'Software';
    } else if (lowerIssue.includes('hardware') || lowerIssue.includes('printer') || lowerIssue.includes('monitor')) {
      category = 'Hardware';
    } else if (lowerIssue.includes('slow') || lowerIssue.includes('performance')) {
      category = 'Performance';
    }

    addTicket({
      issue,
      category,
      status: 'unresolved',
      username: currentAgent?.username,
      hostname: currentAgent?.hostname,
      priority: 'medium',
    });

    toast.success('Ticket created successfully!', {
      description: `Category: ${category}`,
    });
    setIssue('');
    setShowForm(false);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <PageHeader
        title="Ticket Classifier"
        description="Create and manage IT support tickets"
        icon="📌"
        actions={
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Ticket
          </Button>
        }
      />

      {/* Create Ticket Form */}
      {showForm && (
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="text-lg">Create New Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="issue">Describe your IT issue</Label>
                <Textarea
                  id="issue"
                  placeholder="Enter detailed description of your issue..."
                  value={issue}
                  onChange={e => setIssue(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!issue.trim()}>
                  🚀 Classify & Create Ticket
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="unresolved">Unresolved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tickets found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map(ticket => (
                  <TableRow key={ticket.ticket_id} className="table-row-hover">
                    <TableCell className="font-mono text-sm">{ticket.ticket_id}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{ticket.issue}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-secondary rounded-md text-sm">
                        {ticket.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn('font-medium capitalize', getPriorityColor(ticket.priority))}>
                        {ticket.priority || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
