import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'unresolved' | 'pending' | 'resolved' | 'approved' | 'rejected';
  showPulse?: boolean;
}

export function StatusBadge({ status, showPulse = false }: StatusBadgeProps) {
  const config: Record<
    string,
    { bg: string; text: string; dot: string; label: string }
  > = {
    online: {
      bg: 'bg-success/10',
      text: 'text-success',
      dot: 'bg-success',
      label: 'Online',
    },
    offline: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      dot: 'bg-muted-foreground',
      label: 'Offline',
    },
    unresolved: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      dot: 'bg-destructive',
      label: 'Unresolved',
    },
    pending: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      dot: 'bg-warning',
      label: 'Pending',
    },
    resolved: {
      bg: 'bg-success/10',
      text: 'text-success',
      dot: 'bg-success',
      label: 'Resolved',
    },
    approved: {
      bg: 'bg-success/10',
      text: 'text-success',
      dot: 'bg-success',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-destructive/10',
      text: 'text-destructive',
      dot: 'bg-destructive',
      label: 'Rejected',
    },
  };

  const { bg, text, dot, label } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        bg,
        text
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dot, showPulse && 'animate-pulse')} />
      {label}
    </span>
  );
}
