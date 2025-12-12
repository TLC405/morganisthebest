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
      {/* Hero Section - Premium gradient with floating elements */}
      <section className="relative overflow-hidden gradient-hero min-h-[80vh] flex items-center">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-52 h-52 bg-accent/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl float" style={{ animationDelay: '4s' }} />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Trust Badges - Glass style */}
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <Badge className="gap-1.5 py-2 px-4 glass border-0 text-foreground shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                Zero Catfishing
              </Badge>
              <Badge className="gap-1.5 py-2 px-4 glass border-0 text-foreground shadow-sm">
                <MessageCircle className="h-3.5 w-3.5 text-secondary" />
                Zero Ghosting
              </Badge>
              <Badge className="gap-1.5 py-2 px-4 glass border-0 text-foreground shadow-sm">
                <Heart className="h-3.5 w-3.5 text-primary" />
                100% Real
              </Badge>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Meet Singles{' '}
              <span className="text-gradient-warm">In Person</span>
              <br />
              <span className="text-4xl md:text-5xl text-muted-foreground font-medium">Not Just Online</span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Every face is verified. Every connection is earned.
              Real people, real events, real chemistry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 h-14 px-8 rounded-2xl gradient-primary shadow-glow hover:shadow-glow-lg transition-all text-base" asChild>
                <Link to="/events">
                  <Calendar className="h-5 w-5" />
                  Find an Event
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 h-14 px-8 rounded-2xl glass border-0 hover:bg-card/80 transition-all text-base" asChild>
                <Link to="/auth">
                  <Sparkles className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Glass cards */}
      <section className="gradient-section py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
              Why We're <span className="text-gradient">Different</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We solve the real problems with dating apps: fake profiles, ghosting, and endless swiping.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="glass border-0 hover-lift rounded-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="mb-5 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Premium timeline */}
      <section className="py-20 md:py-28 bg-card relative overflow-hidden">
        <div className="absolute inset-0 gradient-premium opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4">
          <h2 className="mb-16 text-center text-3xl md:text-4xl font-bold text-foreground">
            How It <span className="text-gradient">Works</span>
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center group">
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute right-0 top-10 hidden h-6 w-6 -translate-x-4 text-primary/50 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview - Glass design */}
      <section className="gradient-warm py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Upcoming <span className="text-gradient">Events</span>
              </h2>
              <p className="text-muted-foreground mt-2">Find your next opportunity to connect</p>
            </div>
            <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10 rounded-xl" asChild>
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

      {/* CTA Section - Premium glass */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-section" />
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-accent/10 rounded-full blur-3xl float" style={{ animationDelay: '3s' }} />
        
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="mb-8 mx-auto relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl pulse-glow" />
            <div className="relative h-24 w-24 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow-lg">
              <Heart className="h-12 w-12 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Ready to Meet Someone <span className="text-gradient">Real</span>?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto">
            Join hundreds of OKC singles who are tired of catfishing and ghosting.
            Real connections start with real meetings.
          </p>
          <Button size="lg" className="gap-2 h-14 px-10 rounded-2xl gradient-primary shadow-glow hover:shadow-glow-lg transition-all text-base" asChild>
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
