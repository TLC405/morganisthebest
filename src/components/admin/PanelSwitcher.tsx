import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, Users, Heart, ChevronDown, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type ViewMode = 'admin' | 'team' | 'member';

interface PanelConfig {
  id: ViewMode;
  label: string;
  icon: React.ElementType;
  path: string;
  color: string;
  bgColor: string;
}

const panels: PanelConfig[] = [
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: Crown,
    path: '/admin/dashboard',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    id: 'team',
    label: 'Volunteer Panel',
    icon: Users,
    path: '/team/dashboard',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    id: 'member',
    label: 'Member Panel',
    icon: Heart,
    path: '/dashboard',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
];

export const PanelSwitcher = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Only show for admins
  if (role !== 'admin') return null;

  const getCurrentPanel = (): ViewMode => {
    if (location.pathname.startsWith('/admin')) return 'admin';
    if (location.pathname.startsWith('/team')) return 'team';
    return 'member';
  };

  const currentPanel = getCurrentPanel();
  const currentConfig = panels.find(p => p.id === currentPanel) || panels[0];

  const handlePanelSwitch = (panel: PanelConfig) => {
    navigate(panel.path);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="lg"
            className={cn(
              "gap-2 shadow-hard-sm border-2 border-foreground",
              "hover:translate-y-0.5 hover:shadow-none transition-all",
              "px-4 py-3 h-auto"
            )}
          >
            <Eye className="h-4 w-4" />
            <span className="font-medium">Viewing:</span>
            <currentConfig.icon className={cn("h-4 w-4", currentConfig.color)} />
            <span className={currentConfig.color}>{currentConfig.label}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-64 border-2 border-border shadow-depth-lg bg-popover"
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">
            Switch Panel View
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {panels.map((panel) => (
            <DropdownMenuItem
              key={panel.id}
              onClick={() => handlePanelSwitch(panel)}
              className={cn(
                "flex items-center gap-3 py-3 cursor-pointer",
                currentPanel === panel.id && panel.bgColor
              )}
            >
              <div className={cn("p-2", panel.bgColor)}>
                <panel.icon className={cn("h-4 w-4", panel.color)} />
              </div>
              <div className="flex-1">
                <p className={cn("font-medium", currentPanel === panel.id && panel.color)}>
                  {panel.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {panel.id === 'admin' && 'Full system access'}
                  {panel.id === 'team' && 'Event & check-in management'}
                  {panel.id === 'member' && 'Member experience'}
                </p>
              </div>
              {currentPanel === panel.id && (
                <div className={cn("w-2 h-2", panel.color.replace('text-', 'bg-'))} />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
