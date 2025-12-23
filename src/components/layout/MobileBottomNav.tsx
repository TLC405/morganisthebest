import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Heart, 
  Calendar, 
  MessageCircle, 
  MapPin, 
  User,
  LayoutDashboard,
  ClipboardList,
  Star,
  Users,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation items by role
const singlesNav = [
  { to: '/', icon: Heart, label: 'Home' },
  { to: '/events', icon: Calendar, label: 'Events' },
  { to: '/matches', icon: Heart, label: 'Matches' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/profile', icon: User, label: 'Profile' },
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
      case 'admin':
        return adminNav;
      case 'team':
        return teamNav;
      default:
        return singlesNav;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "bottom-nav-item",
                isActive && "active"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
