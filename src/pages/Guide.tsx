import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Calendar,
  MapPin,
  MessageCircle,
  CheckCircle,
  Users,
  Shield,
  ClipboardCheck,
  BarChart3,
  Settings,
  Sparkles,
  UserCheck,
  Bell,
  Star,
} from 'lucide-react';

const SinglesGuide = () => {
  const steps = [
    {
      icon: UserCheck,
      title: 'Complete Your Profile',
      description: 'Add your photo, bio, and interests. A complete profile gets 3x more matches!',
      tips: ['Use a clear, smiling photo', 'Be authentic in your bio', 'List 5+ interests'],
    },
    {
      icon: Sparkles,
      title: 'Take the Compatibility Quiz',
      description: 'Answer 10 quick questions to unlock your personality insights and find better matches.',
      tips: ['Answer honestly', 'No right or wrong answers', 'Takes about 3 minutes'],
    },
    {
      icon: Calendar,
      title: 'RSVP to Events',
      description: 'Browse upcoming events and RSVP. You\'ll get a unique door code for check-in.',
      tips: ['Check venue location', 'Note the dress code', 'Save your door code'],
    },
    {
      icon: MapPin,
      title: 'Check In at Events',
      description: 'Show your door code at the venue. GPS verification ensures everyone is really there!',
      tips: ['Arrive on time', 'Have your code ready', 'Enjoy the mixer!'],
    },
    {
      icon: Heart,
      title: 'Send Waves',
      description: 'Met someone you like? Send them a "wave" to show extra interest.',
      tips: ['Waves show genuine interest', 'Limited waves = more meaningful', 'Check your inbox for waves!'],
    },
    {
      icon: MessageCircle,
      title: 'Start Conversations',
      description: 'When there\'s a mutual match, you can start chatting! Use the gentle exit feature if needed.',
      tips: ['Be respectful', 'Ask about shared interests', 'Move to a real date soon!'],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <Card key={index} variant="elevated" className="hover-lift">
          <CardHeader className="pb-2">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-primary bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">
                Step {index + 1}
              </Badge>
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{step.description}</p>
            <ul className="space-y-1">
              {step.tips.map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const TeamGuide = () => {
  const steps = [
    {
      icon: ClipboardCheck,
      title: 'Event Check-In',
      description: 'Verify attendees using their unique PIN or door code at the entrance.',
      tips: ['Scan or enter PIN manually', 'Check photo matches person', 'Mark late arrivals'],
    },
    {
      icon: MapPin,
      title: 'GPS Verification',
      description: 'The app automatically verifies attendees are at the venue using GPS.',
      tips: ['Ensure venue geofence is set', 'Handle edge cases manually', 'Check signal strength'],
    },
    {
      icon: Users,
      title: 'Managing Attendees',
      description: 'Track who\'s checked in, late, or no-shows in real-time.',
      tips: ['Monitor the live dashboard', 'Flag suspicious behavior', 'Help lost attendees'],
    },
    {
      icon: Bell,
      title: 'Issue Reporting',
      description: 'Report any problems during the event for admin review.',
      tips: ['Document issues clearly', 'Take photos if needed', 'Escalate serious issues'],
    },
    {
      icon: BarChart3,
      title: 'View Your Performance',
      description: 'Check your performance metrics and attendee feedback.',
      tips: ['Track your check-in speed', 'Review feedback regularly', 'Aim for high ratings'],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <Card key={index} variant="elevated" className="hover-lift">
          <CardHeader className="pb-2">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-secondary bg-secondary/10">
                <step.icon className="h-5 w-5 text-secondary" />
              </div>
              <Badge variant="secondary">Step {index + 1}</Badge>
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{step.description}</p>
            <ul className="space-y-1">
              {step.tips.map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-secondary" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AdminGuide = () => {
  const steps = [
    {
      icon: Calendar,
      title: 'Create Events',
      description: 'Set up new dating events with venue, time, capacity, and age ranges.',
      tips: ['Choose popular venues', 'Set realistic capacity', 'Define age range clearly'],
    },
    {
      icon: MapPin,
      title: 'Manage Venues',
      description: '10 real OKC venues are available. Configure GPS geofencing for each.',
      tips: ['Verify GPS coordinates', 'Set geofence radius', 'Keep venue info updated'],
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Assign team members to events and track their performance.',
      tips: ['Assign based on experience', 'Balance workload', 'Review performance weekly'],
    },
    {
      icon: Shield,
      title: 'User Moderation',
      description: 'Review reports, manage user accounts, and ensure community safety.',
      tips: ['Respond to reports quickly', 'Follow moderation guidelines', 'Document decisions'],
    },
    {
      icon: Star,
      title: 'Review Feedback',
      description: 'Analyze user feedback to improve events and the overall experience.',
      tips: ['Look for patterns', 'Address common issues', 'Celebrate positive feedback'],
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track key metrics: user growth, event attendance, match rates.',
      tips: ['Check weekly trends', 'Compare event performance', 'Set improvement goals'],
    },
    {
      icon: Settings,
      title: 'System Settings',
      description: 'Configure app settings, notifications, and feature toggles.',
      tips: ['Test changes carefully', 'Communicate updates', 'Keep documentation updated'],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <Card key={index} variant="elevated" className="hover-lift">
          <CardHeader className="pb-2">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-accent bg-accent/10">
                <step.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <Badge variant="outline">
                Admin
              </Badge>
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">{step.description}</p>
            <ul className="space-y-1">
              {step.tips.map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-accent" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Guide = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold uppercase tracking-tight">
            How to Use the App
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know to make the most of your experience
          </p>
        </div>

        {/* Role-based Tabs */}
        <Tabs defaultValue="singles" className="w-full">
          <TabsList className="mx-auto mb-8 grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="singles" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Singles
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="singles" className="animate-fade-in">
            <SinglesGuide />
          </TabsContent>

          <TabsContent value="team" className="animate-fade-in">
            <TeamGuide />
          </TabsContent>

          <TabsContent value="admin" className="animate-fade-in">
            <AdminGuide />
          </TabsContent>
        </Tabs>

        {/* Pro Tips */}
        <Card variant="accent" className="mt-8">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border-2 border-primary bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Need more help?</h3>
              <p className="text-sm text-muted-foreground">
                Click the chat bubble in the bottom-right corner to talk to Lady Evans, your personal concierge!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Guide;
