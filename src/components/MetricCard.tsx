import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'primary';
  className?: string;
  children?: ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
  children
}: MetricCardProps) {
  const variants = {
    default: 'bg-card border-border',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
  };

  const iconVariants = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
    primary: 'text-primary'
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border shadow-card hover:shadow-elevated transition-all duration-200",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={cn("h-5 w-5", iconVariants[variant])} />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      
      {children && (
        <div className="mt-4 pt-4 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  );
}