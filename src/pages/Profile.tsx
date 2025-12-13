import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, Sparkles, Check, ChevronRight, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { HingePrompt, HINGE_PROMPTS } from '@/components/profiles/HingePrompt';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const allInterests = [
  'hiking', 'coffee', 'live music', 'travel', 'food', 'photography',
  'art', 'reading', 'fitness', 'cooking', 'dogs', 'cats', 'movies',
  'dancing', 'gaming', 'wine', 'beer', 'yoga', 'running', 'concerts'
];

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [area, setArea] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.name || '');
        setAge(data.age?.toString() || '');
        setBio(data.bio || '');
        setInterests(data.interests || []);
        setArea(data.area || '');
        setLookingFor(data.looking_for || '');
        setPhotoUrl(data.photo_url || '');
        setQuizCompleted(data.quiz_completed || false);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else if (interests.length < 6) {
      setInterests([...interests, interest]);
    } else {
      toast({
        title: "Maximum 6 interests",
        description: "Remove an interest before adding a new one.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        age: age ? parseInt(age) : null,
        bio,
        interests,
        area,
        looking_for: lookingFor,
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated! ✨",
        description: "Your changes have been saved.",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="space-y-4">
            <div className="h-8 skeleton-shimmer rounded-xl w-1/3" />
            <div className="h-64 skeleton-shimmer rounded-3xl" />
            <div className="h-48 skeleton-shimmer rounded-3xl" />
          </div>
        </div>
      </Layout>
    );
  }

  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <User className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">This is how you'll appear to other singles</p>
            </div>
          </div>
        </div>

        {/* Photo Section - Tinder style large photo */}
        <Card 
          variant="photo-card" 
          className="mb-6 opacity-0 animate-slide-up-spring overflow-hidden"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <div className="relative aspect-[4/5] bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Your profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl font-bold text-foreground/20">{initials}</span>
              </div>
            )}
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 photo-card-gradient" />
            
            {/* Camera button */}
            <button className="absolute bottom-4 right-4 h-14 w-14 rounded-full gradient-primary text-primary-foreground shadow-glow flex items-center justify-center hover:scale-110 transition-transform">
              <Camera className="h-6 w-6" />
            </button>
            
            {/* Name overlay */}
            <div className="absolute bottom-4 left-4">
              <p className="text-2xl font-bold text-white">
                {name || 'Your Name'}{age && `, ${age}`}
              </p>
              {area && <p className="text-white/80 text-sm">{area}</p>}
            </div>
          </div>
        </Card>

        {/* Carousel Dots Indicator */}
        <div className="carousel-dots mb-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="carousel-dot active" />
          <div className="carousel-dot" />
          <div className="carousel-dot" />
        </div>

        {/* Basic Info */}
        <Card 
          variant="glass" 
          className="mb-6 opacity-0 animate-slide-up-spring"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your first name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="18"
                  max="99"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Midtown OKC"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lookingFor">Looking For</Label>
                <Input
                  id="lookingFor"
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  placeholder="e.g., Long-term relationship"
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hinge-Style Prompt Section */}
        <Card 
          variant="glass" 
          className="mb-6 opacity-0 animate-slide-up-spring"
          style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              About Me
            </CardTitle>
            <CardDescription>Share your personality with prompts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others a bit about yourself..."
              rows={4}
              maxLength={200}
              className="rounded-xl"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Share what makes you unique</span>
              <span>{bio.length}/200</span>
            </div>
          </CardContent>
        </Card>

        {/* Compatibility Quiz CTA */}
        <Card 
          variant={quizCompleted ? "glass" : "neon"}
          className="mb-6 opacity-0 animate-slide-up-spring cursor-pointer hover-lift"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          onClick={() => navigate('/quiz')}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center",
                quizCompleted 
                  ? "bg-primary/20" 
                  : "gradient-primary shadow-glow animate-pulse-ring"
              )}>
                <Sparkles className={cn("h-7 w-7", quizCompleted ? "text-primary" : "text-primary-foreground")} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {quizCompleted ? 'Compatibility Quiz Complete!' : 'Take the Compatibility Quiz'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {quizCompleted ? 'Your matches are being calculated' : 'Answer 8 quick questions to find your best matches'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        {/* Interests - Interactive Pills */}
        <Card 
          variant="glass" 
          className="mb-6 opacity-0 animate-slide-up-spring"
          style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg">Interests</CardTitle>
            <CardDescription>Select up to 6 interests that represent you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "interest-pill transition-all",
                    interests.includes(interest) && "selected"
                  )}
                >
                  {interests.includes(interest) && <Check className="h-3.5 w-3.5" />}
                  {interest}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Selected: <span className="text-primary font-semibold">{interests.length}/6</span>
              </p>
              <div className="flex gap-1">
                {interests.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary" />
                ))}
                {[...Array(6 - interests.length)].map((_, i) => (
                  <div key={i + interests.length} className="w-2 h-2 rounded-full bg-muted" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          variant="glow"
          className="w-full gap-2 rounded-2xl opacity-0 animate-slide-up-spring h-14 text-lg" 
          size="lg"
          disabled={saving}
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
