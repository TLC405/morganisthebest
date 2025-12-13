import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
            <Card variant="glass" className="h-40 skeleton-shimmer" />
            <Card variant="glass" className="h-40 skeleton-shimmer" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header with animation */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          </div>
          <p className="text-muted-foreground">
            This is how you'll appear to other singles after revealing
          </p>
        </div>

        {/* Profile Photo */}
        <Card 
          variant="glass" 
          className="mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>This will be blurred until you meet at events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={photoUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'}
                  alt="Your profile"
                  className="h-24 w-24 rounded-2xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                />
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-glow hover:scale-110 transition-transform">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of yourself. Your face should be visible and well-lit.
                </p>
                <Button variant="premium" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card 
          variant="glass" 
          className="mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
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
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area">Area/Neighborhood</Label>
                <Input
                  id="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Midtown OKC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lookingFor">Looking For</Label>
                <Input
                  id="lookingFor"
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  placeholder="e.g., Long-term relationship"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others a bit about yourself..."
                rows={4}
                maxLength={200}
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200 characters
              </p>
            </div>
        </CardContent>
        </Card>

        {/* Compatibility Quiz CTA */}
        <Card 
          variant={quizCompleted ? "glass" : "neon"}
          className="mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {quizCompleted ? 'Compatibility Quiz Complete!' : 'Take the Compatibility Quiz'}
            </CardTitle>
            <CardDescription>
              {quizCompleted 
                ? 'Your matches are being calculated based on your answers.'
                : 'Answer 8 quick questions to find your best matches!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/quiz')}
              variant={quizCompleted ? 'premium' : 'glow'}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {quizCompleted ? 'Retake Quiz' : 'Start Quiz'}
            </Button>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card 
          variant="glass" 
          className="mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Select up to 6 interests to show on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? 'glow' : 'outline'}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Selected: <span className="text-primary font-medium">{interests.length}/6</span>
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          variant="glow"
          className="w-full gap-2 rounded-2xl opacity-0 animate-fade-in-up" 
          size="xl"
          disabled={saving}
          style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
        >
          <Save className="h-5 w-5" />
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
