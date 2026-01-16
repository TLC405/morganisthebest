import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Calendar, 
  MessageCircle, 
  MapPin, 
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
  HelpCircle,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation links by role
const singlesLinks = [
  { to: '/', label: 'Home', icon: Heart },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/matches', label: 'Matches', icon: Heart },
  { to: '/chats', label: 'Chats', icon: MessageCircle },
  { to: '/check-in', label: 'Check In', icon: MapPin },
  { to: '/guide', label: 'Guide', icon: HelpCircle },
  { to: '/profile', label: 'Profile', icon: User },
];

const teamLinks = [
  { to: '/team/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/team/events', label: 'Events', icon: Calendar },
  { to: '/team/check-ins', label: 'Check-Ins', icon: ClipboardList },
  { to: '/team/performance', label: 'My Performance', icon: Star },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/venues', label: 'Venues', icon: Building2 },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageCircle },
  { to: '/admin/team', label: 'Team', icon: Star },
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
      case 'admin':
        return adminLinks;
      case 'team':
        return teamLinks;
      default:
        return singlesLinks;
    }
  };

  const navLinks = getNavLinks();

  const getFirstName = () => {
    if (!userName) return null;
    return userName.split(' ')[0];
  };

  const getInitials = () => {
    if (!userName) return 'U';
    const names = userName.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleBadge = () => {
    if (!role || role === 'single') return null;
    
    const isAdmin = role === 'admin';
    const Icon = isAdmin ? Crown : Shield;
    
    return (
      <span className={cn(
        'flex items-center gap-1.5 px-2 py-0.5 text-xs font-bold uppercase tracking-wider border-2',
        isAdmin 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-secondary text-secondary-foreground border-secondary'
      )}>
        <Icon className="h-3 w-3" />
        {role}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Minimal Logo - Just icon on mobile, small on desktop */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-soft group-hover:shadow-glow transition-shadow">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="hidden sm:block text-sm font-bold text-foreground">
              SS<span className="text-primary">OKC</span>
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-full transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user && getFirstName() && (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-primary rounded-sm">
                  <AvatarImage src={userPhoto || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold rounded-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">
                    {getFirstName()}
                  </span>
                  {getRoleBadge()}
                </div>
              </div>
            )}
            
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            {/* Mobile User Greeting */}
            {user && getFirstName() && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-border">
                <Avatar className="h-10 w-10 border-2 border-primary rounded-xl">
                  <AvatarImage src={userPhoto || undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground rounded-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {getFirstName()}
                  </span>
                  {getRoleBadge()}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t-2 border-border mt-2 pt-2">
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/10"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In
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
