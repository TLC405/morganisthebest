import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Shield, Sparkles, ArrowRight, MessageCircle, ShieldCheck, Star } from 'lucide-react';
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
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: MessageCircle,
    title: 'Zero Ghosting',
    description: 'Response rates are tracked and visible. Accountability breeds respect.',
    gradient: 'from-secondary/20 to-secondary/5',
  },
  {
    icon: Users,
    title: 'Meet First, Reveal Later',
    description: 'Profiles stay mysterious until you attend the same event. Real chemistry, not filtered photos.',
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    icon: Shield,
    title: '100% Privacy',
    description: 'No geo-tracking. No data selling. Check in with your nametag PIN. Your safety matters.',
    gradient: 'from-[hsl(160_50%_50%)]/20 to-[hsl(160_50%_50%)]/5',
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
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="blur-orb blur-orb-primary w-[500px] h-[500px] -top-40 -right-40 animate-float" />
        <div className="blur-orb blur-orb-accent w-[400px] h-[400px] -bottom-20 -left-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 gradient-spotlight" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Trust Badges */}
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              <Badge variant="premium" className="gap-2 py-2.5 px-5 animate-fade-in-up opacity-0 stagger-1">
                <ShieldCheck className="h-4 w-4" />
                Zero Catfishing
              </Badge>
              <Badge variant="premium" className="gap-2 py-2.5 px-5 animate-fade-in-up opacity-0 stagger-2">
                <MessageCircle className="h-4 w-4" />
                Zero Ghosting
              </Badge>
              <Badge variant="premium" className="gap-2 py-2.5 px-5 animate-fade-in-up opacity-0 stagger-3">
                <Heart className="h-4 w-4" />
                100% Real
              </Badge>
            </div>
            
            {/* Headlines */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl animate-fade-in-up opacity-0 stagger-2">
              Meet People First.
              <span className="block text-gradient mt-2">In Real Life.</span>
            </h1>
            
            <p className="mb-12 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0 stagger-3">
              We're not another dating app. We host real events where real singles meet face-to-face. 
              No swiping. No ghosting. No catfishing. Just genuine human connection.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-4">
              <Button size="xl" className="gap-3 shadow-glow" asChild>
                <Link to="/events">
                  <Calendar className="h-5 w-5" />
                  Find an Event
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="gap-3" asChild>
                <Link to="/auth">
                  <Sparkles className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up opacity-0 stagger-5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background flex items-center justify-center"
                  >
                    <span className="text-xs font-medium text-foreground/70">👤</span>
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-foreground">500+ singles in OKC</p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="ml-1">4.9 average rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora" />
        <div className="mx-auto max-w-7xl px-4 relative">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Why We're Different</Badge>
            <h2 className="mb-6 text-3xl md:text-5xl font-bold text-foreground">
              Dating apps are broken.
              <span className="text-gradient block mt-1">We're fixing that.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We solve the real problems: fake profiles, ghosting, and endless swiping.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="glass"
                className="group hover-lift opacity-0 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 100 + 200}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className={`mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-foreground text-center">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 relative">
        <div className="blur-orb blur-orb-secondary w-[300px] h-[300px] top-1/2 left-0 -translate-y-1/2" />
        <div className="mx-auto max-w-7xl px-4 relative">
          <div className="text-center mb-16">
            <Badge variant="accent" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              How It Works
            </h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div 
                key={item.step} 
                className="relative text-center group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute right-0 top-10 hidden h-6 w-6 -translate-x-4 text-primary/40 md:block group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="mx-auto max-w-7xl px-4 relative">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge variant="default" className="mb-4">Featured</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground mt-3 text-lg">Find your next opportunity to connect</p>
            </div>
            <Button variant="ghost" className="gap-2 group self-start" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-[420px] rounded-2xl" />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={event.id}
                  className="opacity-0 animate-slide-up-spring"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <Card variant="glass" className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No upcoming events. Check back soon!</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="blur-orb blur-orb-primary w-[400px] h-[400px] top-0 right-0" />
        <div className="blur-orb blur-orb-accent w-[300px] h-[300px] bottom-0 left-1/4" />
        
        <div className="mx-auto max-w-3xl px-4 text-center relative">
          <div className="mb-10 mx-auto">
            <div className="h-28 w-28 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-glow-lg animate-float">
              <Heart className="h-14 w-14 text-primary-foreground" fill="currentColor" />
            </div>
          </div>
          <h2 className="mb-6 text-3xl md:text-5xl font-bold text-foreground">
            Ready to Meet Someone Real?
          </h2>
          <p className="mb-12 text-lg text-muted-foreground max-w-xl mx-auto">
            Join hundreds of OKC singles who are tired of catfishing and ghosting.
            Real connections start with real meetings.
          </p>
          <Button size="xl" className="gap-3 shadow-glow-lg" asChild>
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
