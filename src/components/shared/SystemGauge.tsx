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
    sm: { outer: 100, stroke: 8, text: 'text-xl', labelText: 'text-xs' },
    md: { outer: 140, stroke: 10, text: 'text-2xl', labelText: 'text-sm' },
    lg: { outer: 180, stroke: 12, text: 'text-4xl', labelText: 'text-base' },
  };

  const { outer, stroke, text, labelText } = sizes[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  const getColor = () => {
    if (value >= colorThresholds.danger) return 'text-destructive';
    if (value >= colorThresholds.warning) return 'text-warning';
    return 'text-success';
  };

  const getStrokeColor = () => {
    if (value >= colorThresholds.danger) return 'url(#gradient-danger)';
    if (value >= colorThresholds.warning) return 'url(#gradient-warning)';
    return 'url(#gradient-success)';
  };

  const getGlowColor = () => {
    if (value >= colorThresholds.danger) return 'hsl(0 84% 60% / 0.4)';
    if (value >= colorThresholds.warning) return 'hsl(38 92% 50% / 0.4)';
    return 'hsl(142 76% 36% / 0.4)';
  };

  return (
    <div className="flex flex-col items-center gap-3 group">
      <div 
        className="relative transition-transform duration-300 group-hover:scale-105" 
        style={{ width: outer, height: outer }}
      >
        <svg
          className="transform -rotate-90"
          width={outer}
          height={outer}
          viewBox={`0 0 ${outer} ${outer}`}
        >
          <defs>
            <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(142 76% 46%)" />
              <stop offset="100%" stopColor="hsl(160 84% 39%)" />
            </linearGradient>
            <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(38 92% 50%)" />
              <stop offset="100%" stopColor="hsl(25 95% 53%)" />
            </linearGradient>
            <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0 84% 60%)" />
              <stop offset="100%" stopColor="hsl(350 89% 55%)" />
            </linearGradient>
            <filter id={`glow-${label}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="hsl(222 47% 16%)"
            strokeWidth={stroke}
            className="opacity-50"
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
            filter={`url(#glow-${label})`}
            style={{
              filter: `drop-shadow(0 0 8px ${getGlowColor()})`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold tracking-tight', text, getColor())} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {value}%
          </span>
        </div>
      </div>
      
      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl">{icon}</span>
        <span className={cn('font-semibold text-muted-foreground', labelText)}>{label}</span>
      </div>
    </div>
  );
}