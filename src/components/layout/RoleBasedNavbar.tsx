import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
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
  LogIn
} from 'lucide-react';

// Navigation links by role
const singlesLinks = [
  { to: '/', label: 'Home', icon: Heart },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/connections', label: 'My Connections', icon: MessageCircle },
  { to: '/check-in', label: 'Check In', icon: MapPin },
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
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/venues', label: 'Venues', icon: Building2 },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageCircle },
  { to: '/admin/team', label: 'Team', icon: Star },
];

export const RoleBasedNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, role, signOut, isLoading } = useAuth();

  const getNavLinks = () => {
    if (!user) return singlesLinks.slice(0, 2); // Only Home and Events for guests
    
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

  const getRoleBadge = () => {
    if (!role || role === 'single') return null;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        role === 'admin' 
          ? 'bg-destructive/10 text-destructive' 
          : 'bg-secondary/20 text-secondary-foreground'
      }`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">
                Social Singles OKC
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">by TLC</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth & Role Badge */}
          <div className="hidden md:flex items-center gap-3">
            {getRoleBadge()}
            {user ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t border-border mt-2 pt-2">
                {getRoleBadge() && (
                  <div className="px-4 py-2">{getRoleBadge()}</div>
                )}
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg"
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
