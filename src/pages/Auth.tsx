import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Heart, Mail, Lock, User, Shield, Users } from 'lucide-react';

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
          <div className="h-12 w-12 rounded-sm bg-primary animate-pulse" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card variant="elevated" className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-4 pb-2">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-primary flex items-center justify-center shadow-hard-sm">
              <Heart className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-foreground tracking-tight">
                Social Singles <span className="text-primary">OKC</span>
              </span>
              <p className="text-sm text-muted-foreground font-medium">Where Science Meets Chemistry</p>
            </div>
          </div>
          
          <CardTitle className="text-xl font-semibold text-foreground">
            {isLogin ? 'Welcome Back' : 'Join the Community'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
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
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-14 h-12 bg-input border-border focus:border-primary transition-colors"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-muted flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-14 h-12 bg-input border-border focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-muted flex items-center justify-center">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-14 h-12 bg-input border-border focus:border-primary transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 shadow-hard-sm hover:translate-y-0.5 hover:shadow-none transition-all text-base font-semibold"
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
              className="text-sm text-primary hover:underline font-medium transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-foreground bg-muted border-2 border-border px-3 py-2">
              <Shield className="h-3 w-3 text-primary" />
              Zero Catfishing
            </span>
            <span className="flex items-center gap-1.5 text-xs text-foreground bg-muted border-2 border-border px-3 py-2">
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
