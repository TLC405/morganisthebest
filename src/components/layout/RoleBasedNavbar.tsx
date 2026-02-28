import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { 
  Compass, 
  Calendar, 
  MessageCircle, 
  User, 
  Menu, 
  X,
  LayoutDashboard,
  Users,
  Building2,
  Star,
  ClipboardList,
  LogOut,
  LogIn,
  Crown,
  Shield,
  Brain,
  ShoppingBag,
  Ticket,
  Package,
  MessageSquare,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const singlesLinks = [
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/matches', label: 'Connect', icon: Users },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
  { to: '/profile', label: 'Me', icon: User },
];

const teamLinks = [
  { to: '/team/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/team/events', label: 'Events', icon: Calendar },
  { to: '/team/check-ins', label: 'Check-Ins', icon: ClipboardList },
  { to: '/team/performance', label: 'Stats', icon: Star },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/venues', label: 'Venues', icon: Building2 },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { to: '/admin/team', label: 'Team', icon: Star },
  { to: '/admin/shop', label: 'Shop', icon: ShoppingBag },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/market-intel', label: 'Intel', icon: Brain },
];

export const RoleBasedNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const location = useLocation();
  const { user, role, signOut } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('name, photo_url')
        .eq('id', user.id)
        .single();
      if (data) {
        setUserName(data.name);
        setUserPhoto(data.photo_url);
      }
    };
    fetchProfile();
  }, [user]);

  const getNavLinks = () => {
    if (!user) return singlesLinks.slice(0, 2);
    switch (role) {
      case 'admin': return adminLinks;
      case 'team': return teamLinks;
      default: return singlesLinks;
    }
  };

  const navLinks = getNavLinks();
  const getFirstName = () => userName?.split(' ')[0] || null;
  const getInitials = () => {
    if (!userName) return 'U';
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = () => {
    if (!role || role === 'single') return null;
    const isAdmin = role === 'admin';
    const Icon = isAdmin ? Crown : Shield;
    return (
      <span className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-foreground',
        isAdmin ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
      )}>
        <Icon className="h-3 w-3" />
        {role}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b-2 border-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 bg-foreground border-2 border-foreground flex items-center justify-center">
              <Compass className="h-5 w-5 text-background" />
            </div>
            <span className="hidden sm:block font-mono font-bold text-xs text-foreground uppercase tracking-widest">
              INSPIRE<span className="text-primary">OKC</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || 
                (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider transition-all duration-150',
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user && getFirstName() && (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border-2 border-foreground rounded-none">
                  <AvatarImage src={userPhoto || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-mono font-bold rounded-none">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-[10px] text-foreground uppercase tracking-wider">
                    {getFirstName()}
                  </span>
                  {getRoleBadge()}
                </div>
              </div>
            )}
            
            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut} className="font-mono font-bold text-[10px]">
                <LogOut className="h-3.5 w-3.5 mr-1" />
                OUT
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="primary">
                  <LogIn className="h-3.5 w-3.5 mr-1" />
                  SIGN IN
                </Button>
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t-2 border-foreground animate-fade-in">
            {user && getFirstName() && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b-2 border-foreground">
                <Avatar className="h-10 w-10 border-2 border-foreground rounded-none">
                  <AvatarImage src={userPhoto || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground rounded-none font-mono font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span className="font-mono font-bold text-xs text-foreground uppercase tracking-wider">
                    {getFirstName()}
                  </span>
                  {getRoleBadge()}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to ||
                  (link.to !== '/' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 font-mono font-bold text-xs uppercase tracking-wider transition-all',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t-2 border-foreground mt-2 pt-2">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left font-mono font-bold text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    SIGN OUT
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-mono font-bold text-xs uppercase tracking-wider text-primary hover:bg-muted"
                  >
                    <LogIn className="h-4 w-4" />
                    SIGN IN
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
