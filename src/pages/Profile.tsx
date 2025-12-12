import { useState } from 'react';
import { User, Camera, Save } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { currentUser } from '@/data/mockData';

const allInterests = [
  'hiking', 'coffee', 'live music', 'travel', 'food', 'photography',
  'art', 'reading', 'fitness', 'cooking', 'dogs', 'cats', 'movies',
  'dancing', 'gaming', 'wine', 'beer', 'yoga', 'running', 'concerts'
];

const Profile = () => {
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age.toString());
  const [bio, setBio] = useState(currentUser.bio);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);
  const { toast } = useToast();

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

  const handleSave = () => {
    toast({
      title: "Profile Updated! ✨",
      description: "Your changes have been saved.",
    });
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          </div>
          <p className="text-muted-foreground">
            This is how you'll appear to other singles after revealing
          </p>
        </div>

        {/* Profile Photo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>This will be blurred until you meet at events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={currentUser.photoUrl}
                  alt="Your profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of yourself. Your face should be visible and well-lit.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Change Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="mb-6">
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
            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others a bit about yourself..."
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Interests</CardTitle>
            <CardDescription>Select up to 6 interests to show on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Selected: {interests.length}/6
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full gap-2" size="lg">
          <Save className="h-5 w-5" />
          Save Profile
        </Button>
      </div>
    </Layout>
  );
};

export default Profile;
