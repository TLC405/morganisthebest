import { 
  Shield, Camera, UserCheck, MapPin, AlertTriangle, 
  CheckCircle, Star, BadgeCheck 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BadgeType = 
  | 'id-verified' 
  | 'selfie-verified' 
  | 'background-checked' 
  | 'ok-resident' 
  | 'fraud-checked'
  | 'community-trusted'
  | 'admin-vetted';

interface TrustBadgeProps {
  type: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const badgeConfig: Record<BadgeType, { 
  icon: typeof Shield; 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  'id-verified': {
    icon: Shield,
    label: 'ID Verified',
    color: 'text-primary',
    bgColor: 'bg-primary/10 border-primary/20',
  },
  'selfie-verified': {
    icon: Camera,
    label: 'Selfie Verified',
    color: 'text-primary',
    bgColor: 'bg-primary/10 border-primary/20',
  },
  'background-checked': {
    icon: UserCheck,
    label: 'Background Checked',
    color: 'text-primary',
    bgColor: 'bg-primary/10 border-primary/20',
  },
  'ok-resident': {
    icon: MapPin,
    label: 'OK Resident',
    color: 'text-accent',
    bgColor: 'bg-accent/10 border-accent/20',
  },
  'fraud-checked': {
    icon: AlertTriangle,
    label: 'Fraud Checked',
    color: 'text-[hsl(160_50%_40%)]',
    bgColor: 'bg-[hsl(160_50%_45%)]/10 border-[hsl(160_50%_45%)]/20',
  },
  'community-trusted': {
    icon: Star,
    label: 'Community Trusted',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10 border-secondary/20',
  },
  'admin-vetted': {
    icon: BadgeCheck,
    label: 'Admin Vetted',
    color: 'text-primary',
    bgColor: 'bg-primary/10 border-primary/20',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-[10px]',
    icon: 'h-3 w-3',
    gap: 'gap-1',
  },
  md: {
    container: 'px-3 py-1.5 text-xs',
    icon: 'h-3.5 w-3.5',
    gap: 'gap-1.5',
  },
  lg: {
    container: 'px-4 py-2 text-sm',
    icon: 'h-4 w-4',
    gap: 'gap-2',
  },
};

export const TrustBadge = ({ 
  type, 
  size = 'md', 
  showLabel = true,
  className 
}: TrustBadgeProps) => {
  const config = badgeConfig[type];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'inline-flex items-center rounded-full border font-semibold transition-all duration-200',
        config.bgColor,
        sizes.container,
        sizes.gap,
        className
      )}
    >
      <Icon className={cn(sizes.icon, config.color)} />
      {showLabel && (
        <span className={config.color}>{config.label}</span>
      )}
    </div>
  );
};

interface TrustBadgeRowProps {
  badges: BadgeType[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export const TrustBadgeRow = ({ 
  badges, 
  size = 'sm', 
  showLabels = true,
  className 
}: TrustBadgeRowProps) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((badge) => (
        <TrustBadge 
          key={badge} 
          type={badge} 
          size={size} 
          showLabel={showLabels} 
        />
      ))}
    </div>
  );
};
