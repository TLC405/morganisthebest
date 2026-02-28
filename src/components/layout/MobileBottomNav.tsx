import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, 
  Calendar, 
  MessageCircle, 
  User,
  Users,
  LayoutDashboard,
  ClipboardList,
  Star,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const singlesNav = [
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/matches', icon: Users, label: 'Connect' },
  { to: '/chats', icon: MessageCircle, label: 'Chats' },
  { to: '/profile', icon: User, label: 'Me' },
];

const teamNav = [
  { to: '/team/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/team/events', icon: Calendar, label: 'Events' },
  { to: '/team/check-ins', icon: ClipboardList, label: 'Check-Ins' },
  { to: '/team/performance', icon: Star, label: 'Stats' },
];

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
  { to: '/admin/venues', icon: Building2, label: 'Venues' },
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user, role } = useAuth();

  if (!user) return null;

  const getNavItems = () => {
    switch (role) {
      case 'admin': return adminNav;
      case 'team': return teamNav;
      default: return singlesNav;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t-2 border-foreground">
      <div className="flex items-center justify-around py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to));
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 transition-all",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="font-mono font-bold text-[8px] uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
