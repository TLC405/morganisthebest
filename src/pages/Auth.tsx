import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Compass, Mail, Lock, User, Shield, Users, Sparkles } from 'lucide-react';
import { FloatingLogo, BrandWatermark } from '@/components/brand/FloatingLogo';

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
          navigate('/explore', { replace: true });
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
          toast({ variant: 'destructive', title: 'Sign in failed', description: error.message });
        } else {
          toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
        }
      } else {
        if (!name.trim()) {
          toast({ variant: 'destructive', title: 'Name required', description: 'Please enter your name to create an account.' });
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({ variant: 'destructive', title: 'Sign up failed', description: error.message });
        } else {
          toast({ title: 'Account created!', description: 'Please check your email to confirm your account.' });
        }
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'An unexpected error occurred.' });
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 border-4 border-foreground bg-foreground animate-pulse flex items-center justify-center">
            <Compass className="h-7 w-7 text-background" />
          </div>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background bg-dots">
      <BrandWatermark />
      
      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8 animate-fade-in-up opacity-0 stagger-1">
          <FloatingLogo size="md" showTagline={true} />
        </div>
        
        <Card variant="brutal" className="animate-scale-in">
          <CardHeader className="text-center space-y-4 pb-2">
            <div className="space-y-2">
              <CardTitle className="text-xl">
                {isLogin ? 'Welcome Back' : 'Join the Community'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Sign in to find your people in OKC' 
                  : 'Create an account to cure isolation'
                }
              </CardDescription>
            </div>
          </CardHeader>
        
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold font-mono uppercase tracking-wider">Full Name</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 border-2 border-foreground bg-muted flex items-center justify-center">
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
                <Label htmlFor="email" className="text-sm font-bold font-mono uppercase tracking-wider">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 border-2 border-foreground bg-muted flex items-center justify-center">
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
                <Label htmlFor="password" className="text-sm font-bold font-mono uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 border-2 border-foreground bg-muted flex items-center justify-center">
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
                className="w-full h-12 text-base"
                variant="primary"
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
                className="text-sm text-primary hover:underline font-bold font-mono uppercase tracking-wider transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Shield className="h-3.5 w-3.5" />
                Real People Only
              </Badge>
              <Badge variant="outline" className="gap-2 py-2 px-4">
                <Users className="h-3.5 w-3.5" />
                In-Person Events
              </Badge>
            </div>
            
            <div className="mt-5 text-center">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Cure isolation. Get out. <span className="text-primary font-bold">Inspire OKC</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
