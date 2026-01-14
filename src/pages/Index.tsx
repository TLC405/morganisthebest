import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Shield, Sparkles, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingEvents } from '@/hooks/useEvents';
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

// Map database events to display format
const mapEventForDisplay = (event: any) => ({
  id: event.id,
  title: event.title,
  date: event.date,
  time: event.start_time,
  location: event.venues?.name || 'TBD',
  description: event.description || '',
  category: 'mixer' as const,
  attendeeCount: 0,
  maxCapacity: event.max_attendees || 50,
  imageUrl: 'https://images.unsplash.com/photo-1529543544277-068cc8eda7b4?w=800',
});

const Index = () => {
  const { events: dbEvents, isLoading } = useUpcomingEvents(3);
  const upcomingEvents = dbEvents.map(mapEventForDisplay);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background min-h-[80vh] flex items-center border-b-4 border-primary">
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="gap-1.5 py-2 px-4 animate-fade-in-up opacity-0 stagger-1">
                <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                Zero Catfishing
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-2 px-4 animate-fade-in-up opacity-0 stagger-2">
                <MessageCircle className="h-3.5 w-3.5 text-secondary" />
                Zero Ghosting
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-2 px-4 animate-fade-in-up opacity-0 stagger-3">
                <Heart className="h-3.5 w-3.5 text-primary" />
                100% Real
              </Badge>
            </div>
            
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-7xl uppercase animate-fade-in-up opacity-0 stagger-2">
              Meet People First.
            </h1>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-5xl uppercase animate-fade-in-up opacity-0 stagger-2">
              In Real Life.
            </h2>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-fade-in-up opacity-0 stagger-3">
              We're not another dating app. We host real events where real singles meet face-to-face. 
              No swiping. No ghosting. No catfishing. Just genuine human connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-4">
              <Button size="xl" className="gap-2" asChild>
                <Link to="/events">
                  <Calendar className="h-5 w-5" />
                  Find an Event
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="gap-2" asChild>
                <Link to="/auth">
                  <Sparkles className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-card border-b-4 border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
              Why We're Different
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We solve the real problems with dating apps: fake profiles, ghosting, and endless swiping.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="elevated"
                className="hover-lift opacity-0 animate-fade-in-up border-l-4 border-l-primary"
                style={{ animationDelay: `${index * 100 + 200}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="mb-5 mx-auto flex h-16 w-16 items-center justify-center rounded-sm border-2 border-primary bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold text-foreground uppercase">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-background border-b-4 border-border">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-16 text-center text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div 
                key={item.step} 
                className="relative text-center group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-sm border-4 border-primary bg-primary text-primary-foreground shadow-hard-sm group-hover:shadow-hard transition-all duration-200">
                  <span className="text-3xl font-bold">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground uppercase">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute right-0 top-10 hidden h-6 w-6 -translate-x-4 text-primary/50 md:block group-hover:translate-x-0 group-hover:text-primary transition-all" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-muted py-20 md:py-28 border-b-4 border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground mt-2">Find your next opportunity to connect</p>
            </div>
            <Button variant="ghost" className="gap-2 group" asChild>
              <Link to="/events">
                View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[420px]" />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No upcoming events. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-8 mx-auto">
            <div className="h-24 w-24 mx-auto rounded-sm border-4 border-primary bg-primary flex items-center justify-center shadow-hard">
              <Heart className="h-12 w-12 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
            Ready to Meet Someone Real?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto">
            Join hundreds of OKC singles who are tired of catfishing and ghosting.
            Real connections start with real meetings.
          </p>
          <Button size="xl" className="gap-2" asChild>
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
