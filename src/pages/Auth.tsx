import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Mail, Lock, User } from 'lucide-react';

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
      // Role-based redirect after login
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 via-background to-primary/10">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-premium p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl float" style={{ animationDelay: '4s' }} />
      
      <Card className="w-full max-w-md glass-strong border-0 shadow-glow-lg rounded-3xl relative z-10">
        <CardHeader className="text-center space-y-4 pb-2">
          {/* Animated Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl pulse-glow" />
              <div className="relative h-16 w-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                <Heart className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
            <span className="text-2xl font-bold text-foreground">
              Social Singles <span className="text-gradient">OKC</span>
            </span>
          </div>
          
          <CardTitle className="text-xl font-semibold">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </CardTitle>
          <CardDescription className="text-base">
            {isLogin 
              ? 'Sign in to connect with genuine singles' 
              : 'Create an account to start meeting real people'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-14 h-12 rounded-xl border-border/50 bg-card/50 focus:bg-card transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-14 h-12 rounded-xl border-border/50 bg-card/50 focus:bg-card transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-14 h-12 rounded-xl border-border/50 bg-card/50 focus:bg-card transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl gradient-primary shadow-glow hover:shadow-glow-lg transition-all text-base font-semibold"
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
              className="text-sm text-primary hover:underline font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              ✓ Zero Catfishing
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              ✓ Zero Ghosting
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
