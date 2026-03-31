import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Search, Calendar, MessageCircle, User, Users,
  LayoutDashboard, ClipboardList, Star, Building2, MoreHorizontal,
  X, ShoppingBag, Tag, Receipt, TrendingUp, UsersRound, MessageSquare
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

const adminPrimaryNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/events', icon: Calendar, label: 'Events' },
];

const adminMoreItems = [
  { to: '/admin/venues', icon: Building2, label: 'Venues' },
  { to: '/admin/users', icon: UsersRound, label: 'Users' },
  { to: '/admin/team', icon: UsersRound, label: 'Team' },
  { to: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/admin/shop', icon: ShoppingBag, label: 'Shop' },
  { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
  { to: '/admin/orders', icon: Receipt, label: 'Orders' },
  { to: '/admin/market-intel', icon: TrendingUp, label: 'Intel' },
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user, role } = useAuth();
  const [showMore, setShowMore] = useState(false);

  if (!user) return null;

  const isAdmin = role === 'admin';
  const isTeam = role === 'team';

  const getNavItems = () => {
    if (isAdmin) return adminPrimaryNav;
    if (isTeam) return teamNav;
    return singlesNav;
  };

  const navItems = getNavItems();

  const isActive = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <>
      {/* More Drawer */}
      {showMore && isAdmin && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowMore(false)} />
          <div className="absolute bottom-[60px] left-0 right-0 bg-card border-t-4 border-x-4 border-foreground p-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-foreground">All Admin</span>
              <button onClick={() => setShowMore(false)} className="p-1 border-2 border-foreground hover:bg-foreground hover:text-background">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {adminMoreItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setShowMore(false)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 border-2 border-foreground transition-all",
                      active ? "bg-foreground text-background" : "bg-card text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-mono font-bold text-[8px] uppercase tracking-wider">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t-2 border-foreground">
        <div className="flex items-center justify-around py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 transition-all",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                <span className="font-mono font-bold text-[8px] uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
          {/* More button for admin */}
          {isAdmin && (
            <button
              onClick={() => setShowMore(!showMore)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 transition-all",
                showMore ? "text-primary" : "text-muted-foreground"
              )}
            >
              <MoreHorizontal className={cn("h-5 w-5", showMore && "scale-110")} />
              <span className="font-mono font-bold text-[8px] uppercase tracking-wider">More</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};
