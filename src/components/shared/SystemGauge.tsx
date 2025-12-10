import { cn } from '@/lib/utils';

interface SystemGaugeProps {
  value: number;
  label: string;
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  colorThresholds?: { warning: number; danger: number };
}

export function SystemGauge({
  value,
  label,
  icon,
  size = 'md',
  colorThresholds = { warning: 70, danger: 90 },
}: SystemGaugeProps) {
  const sizes = {
    sm: { outer: 80, inner: 60, stroke: 8, text: 'text-lg' },
    md: { outer: 120, inner: 92, stroke: 10, text: 'text-2xl' },
    lg: { outer: 160, inner: 124, stroke: 12, text: 'text-3xl' },
  };

  const { outer, inner, stroke, text } = sizes[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  const getColor = () => {
    if (value >= colorThresholds.danger) return 'text-destructive';
    if (value >= colorThresholds.warning) return 'text-warning';
    return 'text-success';
  };

  const getStrokeColor = () => {
    if (value >= colorThresholds.danger) return 'hsl(var(--destructive))';
    if (value >= colorThresholds.warning) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg
          className="transform -rotate-90"
          width={outer}
          height={outer}
          viewBox={`0 0 ${outer} ${outer}`}
        >
          {/* Background circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="gauge-ring"
            style={
              {
                '--gauge-value': progress,
              } as React.CSSProperties
            }
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', text, getColor())}>{value}%</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
}
