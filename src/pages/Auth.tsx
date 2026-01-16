import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Mail, Lock, User, Shield, Users, Sparkles } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isLoading && role) {
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'team':
          navigate('/team/dashboard', { replace: true });
          break;
        case 'single':
        default:
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [user, role, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Sign in failed',
            description: error.message
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.'
          });
          navigate('/');
        }
      } else {
        if (!name.trim()) {
          toast({
            variant: 'destructive',
            title: 'Name required',
            description: 'Please enter your name to create an account.'
          });
          setIsSubmitting(false);
          return;
        }
        
        const { error } = await signUp(email, password, name);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: 'destructive',
              title: 'Account exists',
              description: 'This email is already registered. Try signing in instead.'
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Sign up failed',
              description: error.message
            });
          }
        } else {
          toast({
            title: 'Account created!',
            description: 'Please check your email to confirm your account, or sign in directly if email confirmation is disabled.'
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.'
      });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl gradient-primary animate-pulse shadow-glow" />
          <p className="text-muted-foreground animate-pulse-soft">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="blur-orb blur-orb-primary w-[400px] h-[400px] -top-40 -right-40 animate-float" />
      <div className="blur-orb blur-orb-accent w-[300px] h-[300px] -bottom-20 -left-20 animate-float" style={{ animationDelay: '3s' }} />
      <div className="blur-orb blur-orb-secondary w-[200px] h-[200px] top-1/3 left-1/4 animate-float" style={{ animationDelay: '1.5s' }} />
      
      <Card variant="spotlight" className="w-full max-w-md animate-scale-in relative">
        <CardHeader className="text-center space-y-6 pb-2">
          {/* Logo */}
          <div className="flex flex-col items-center gap-5">
            <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow-lg">
              <Heart className="h-10 w-10 text-primary-foreground" fill="currentColor" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                Social Singles <span className="text-gradient">OKC</span>
              </span>
              <p className="text-sm text-muted-foreground">Where Science Meets Chemistry</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold text-foreground">
              {isLogin ? 'Welcome Back' : 'Join the Community'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to connect with genuine singles' 
                : 'Create an account to start meeting real people'
              }
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-muted/80 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-14 h-12"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-muted/80 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-14 h-12"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-muted/80 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-14 h-12"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-glow"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Please wait...
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline font-medium transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="premium" className="gap-2 py-2 px-4">
              <Shield className="h-3.5 w-3.5" />
              Zero Catfishing
            </Badge>
            <Badge variant="premium" className="gap-2 py-2 px-4">
              <Users className="h-3.5 w-3.5" />
              Zero Ghosting
            </Badge>
          </div>
          
          {/* Social proof counter */}
          <div className="mt-5 text-center">
            <p className="text-xs text-muted-foreground">
              Join <span className="text-primary font-semibold">500+</span> OKC singles finding real connections
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
