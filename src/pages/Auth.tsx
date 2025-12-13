import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary animate-pulse" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated Aurora Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient mesh */}
        <div className="absolute inset-0 bg-aurora" />
        
        {/* Animated floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/25 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-[10%] w-32 h-32 bg-primary/30 rounded-full blur-3xl float" />
        <div className="absolute bottom-32 right-[15%] w-40 h-40 bg-accent/25 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-[20%] w-24 h-24 bg-secondary/30 rounded-full blur-2xl float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-[20%] w-20 h-20 bg-primary/25 rounded-full blur-2xl float" style={{ animationDelay: '3s' }} />
        
        {/* Particle overlay */}
        <div className="absolute inset-0 particles opacity-40" />
      </div>
      
      <Card className="w-full max-w-md glass-strong border-primary/10 shadow-glow-lg rounded-3xl relative z-10 overflow-hidden">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        
        <CardHeader className="text-center space-y-4 pb-2 relative">
          {/* Animated Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-xl opacity-50 animate-pulse" />
              {/* Main logo */}
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-glow-lg">
                <Heart className="h-10 w-10 text-primary-foreground fill-primary-foreground drop-shadow-lg" />
              </div>
              {/* Sparkle accent */}
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-3xl font-bold text-foreground tracking-tight">
                Social Singles <span className="text-gradient">OKC</span>
              </span>
              <p className="text-sm text-muted-foreground font-medium">Where Science Meets Chemistry ✨</p>
            </div>
          </div>
          
          <CardTitle className="text-2xl font-semibold text-foreground">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {isLogin 
              ? 'Sign in to connect with genuine singles' 
              : 'Create an account to start meeting real people'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-2 relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transition-all group-focus-within:from-primary/30 group-focus-within:to-primary/20">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-14 h-12 rounded-xl border-border bg-card/60 focus:bg-card focus:border-primary/50 focus:ring-primary/20 transition-all"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transition-all group-focus-within:from-primary/30 group-focus-within:to-primary/20">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-14 h-12 rounded-xl border-border bg-card/60 focus:bg-card focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center transition-all group-focus-within:from-primary/30 group-focus-within:to-primary/20">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-14 h-12 rounded-xl border-border bg-card/60 focus:bg-card focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-13 rounded-xl bg-gradient-to-r from-primary via-primary to-secondary shadow-glow hover:shadow-glow-lg transition-all duration-300 text-base font-semibold hover:scale-[1.02] active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? 'Please wait...' 
                : isLogin ? 'Sign In' : 'Create Account'
              }
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          {/* Trust badges with animation */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-foreground bg-card/80 border border-border/50 px-3 py-2 rounded-full hover:bg-card transition-colors">
              <Shield className="h-3 w-3 text-primary" />
              Zero Catfishing
            </span>
            <span className="flex items-center gap-1.5 text-xs text-foreground bg-card/80 border border-border/50 px-3 py-2 rounded-full hover:bg-card transition-colors">
              <Users className="h-3 w-3 text-secondary" />
              Zero Ghosting
            </span>
          </div>
          
          {/* Social proof counter */}
          <div className="mt-4 text-center">
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