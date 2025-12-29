import { Layers, Circle, Grid3X3, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeVariant, ThemeVariant } from '@/contexts/ThemeVariantContext';

const variants: { id: ThemeVariant; label: string; icon: typeof Layers; description: string }[] = [
  { id: 'glass', label: 'Glass', icon: Layers, description: 'Frosted depth layers' },
  { id: 'neumorphic', label: 'Soft', icon: Circle, description: 'Tactile soft UI' },
  { id: 'swiss', label: 'Swiss', icon: Grid3X3, description: 'Clean typography' },
  { id: 'luxe', label: 'Luxe', icon: Sparkles, description: 'Dark & premium' },
];

export const ThemeVariantSwitcher = () => {
  const { variant, setVariant } = useThemeVariant();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
      {variants.map((v) => {
        const Icon = v.icon;
        const isActive = variant === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            className={cn(
              'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            )}
            title={v.description}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden md:inline">{v.label}</span>
          </button>
        );
      })}
    </div>
  );
};
