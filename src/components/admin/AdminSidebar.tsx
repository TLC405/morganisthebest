import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, Building2, MessageCircle, 
  UsersRound, ShoppingBag, Tag, Receipt, TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const adminGroups = [
  {
    label: 'Intelligence',
    items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/admin/market-intel', icon: TrendingUp, label: 'Market Intel' },
    ],
  },
  {
    label: 'Community',
    items: [
      { to: '/admin/members', icon: Users, label: 'Members' },
      { to: '/admin/users', icon: UsersRound, label: 'Users' },
      { to: '/admin/team', icon: UsersRound, label: 'Team' },
      { to: '/admin/feedback', icon: MessageCircle, label: 'Feedback' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/events', icon: Calendar, label: 'Events' },
      { to: '/admin/venues', icon: Building2, label: 'Venues' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/admin/shop', icon: ShoppingBag, label: 'Shop' },
      { to: '/admin/coupons', icon: Tag, label: 'Coupons' },
      { to: '/admin/orders', icon: Receipt, label: 'Orders' },
    ],
  },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r-4 border-foreground bg-card transition-all duration-200 flex-shrink-0",
      collapsed ? "w-16" : "w-56"
    )}>
      {/* Header */}
      <div className="p-3 border-b-2 border-foreground flex items-center justify-between">
        {!collapsed && (
          <span className="font-mono font-black text-xs uppercase tracking-widest text-foreground">Admin</span>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-2">
        {adminGroups.map((group) => (
          <div key={group.label} className="mb-2">
            {!collapsed && (
              <div className="px-3 py-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                  {group.label}
                </span>
              </div>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 mx-1 transition-all font-mono text-xs uppercase tracking-wider",
                    isActive
                      ? "bg-foreground text-background font-bold"
                      : "text-foreground hover:bg-muted"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
