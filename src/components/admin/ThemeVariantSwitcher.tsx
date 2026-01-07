import { Layers, Circle, Grid3X3, Sparkles, Smartphone, Square, Newspaper, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeVariant, ThemeVariant, variantConfigs } from '@/contexts/ThemeVariantContext';

const variantIcons: Record<ThemeVariant, typeof Layers> = {
  glass: Layers,
  neumorphic: Circle,
  swiss: Grid3X3,
  luxe: Sparkles,
  flutter: Smartphone,
  brutal: Square,
  editorial: Newspaper,
  aurora: Waves,
};

export const ThemeVariantSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { variant, setVariant } = useThemeVariant();
  const variants = Object.values(variantConfigs);

  if (compact) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/50">
        {variants.map((v) => {
          const Icon = variantIcons[v.id];
          const isActive = variant === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setVariant(v.id)}
              className={cn(
                'relative flex items-center justify-center p-2 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              )}
              title={`${v.label}: ${v.description}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 p-2 rounded-2xl bg-muted/30 border border-border/30">
      {variants.map((v) => {
        const Icon = variantIcons[v.id];
        const isActive = variant === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setVariant(v.id)}
            className={cn(
              'group relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300',
              isActive
                ? 'bg-card text-foreground shadow-lg ring-2 ring-primary/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
            )}
          >
            <div className={cn(
              'p-2 rounded-lg transition-all duration-300',
              isActive ? 'bg-primary/20' : 'bg-muted/50 group-hover:bg-muted'
            )}>
              <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold">{v.label}</p>
              <p className="text-[10px] text-muted-foreground hidden md:block">{v.description}</p>
            </div>
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
};
