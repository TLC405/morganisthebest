import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Shield, Sparkles, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { mockEvents } from '@/data/mockData';
import { EventCard } from '@/components/events/EventCard';

const features = [
  {
    icon: ShieldCheck,
    title: 'Zero Catfishing',
    description: 'Every profile is verified. Live selfie check + event attendance proof. No fakes allowed.',
  },
  {
    icon: MessageCircle,
    title: 'Zero Ghosting',
    description: 'Response rates are tracked and visible. Accountability breeds respect.',
  },
  {
    icon: Users,
    title: 'Meet First, Reveal Later',
    description: 'Profiles stay mysterious until you attend the same event. Real chemistry, not filtered photos.',
  },
  {
    icon: Shield,
    title: '100% Privacy',
    description: 'No geo-tracking. No data selling. Check in with your nametag PIN. Your safety matters.',
  },
];

const howItWorks = [
  { step: 1, title: 'Browse Events', description: 'Find singles events that match your interests' },
  { step: 2, title: 'RSVP & Show Up', description: 'Reserve your spot and arrive ready to mingle' },
  { step: 3, title: 'Check In & Get PIN', description: 'Check in at the door and get your nametag PIN' },
  { step: 4, title: 'Match & Connect', description: 'Exchange PINs with people you like - mutual matches unlock chat!' },
];

const Index = () => {
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section - Warm gradient */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Trust Badges */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="gap-1 py-1.5 px-3 bg-card/50 backdrop-blur-sm">
                <ShieldCheck className="h-3 w-3 text-green-500" />
                Zero Catfishing
              </Badge>
              <Badge variant="outline" className="gap-1 py-1.5 px-3 bg-card/50 backdrop-blur-sm">
                <MessageCircle className="h-3 w-3 text-secondary" />
                Zero Ghosting
              </Badge>
              <Badge variant="outline" className="gap-1 py-1.5 px-3 bg-card/50 backdrop-blur-sm">
                <Heart className="h-3 w-3 text-primary" />
                100% Real
              </Badge>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Meet Singles{' '}
              <span className="text-primary">In Person</span>
              <br />
              Not Just Online
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Every face is verified. Every connection is earned.
              Real people, real events, real chemistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/events">
                  <Calendar className="h-5 w-5" />
                  Find an Event
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link to="/auth">
                  <Sparkles className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Warm section bg */}
      <section className="border-t border-border gradient-section py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            Why We're Different
          </h2>
          <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
            We solve the real problems with dating apps: fake profiles, ghosting, and endless swiping.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/30">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-primary-foreground shadow-lg">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute right-0 top-8 hidden h-6 w-6 -translate-x-4 text-primary md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="border-t border-border gradient-warm py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
            <Button variant="ghost" className="gap-2" asChild>
              <Link to="/events">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-6 mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
            <Heart className="h-10 w-10 text-primary" fill="currentColor" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to Meet Someone Real?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of OKC singles who are tired of catfishing and ghosting.
            Real connections start with real meetings.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/auth">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
