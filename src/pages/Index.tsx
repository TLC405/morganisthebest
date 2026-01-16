import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Shield, Sparkles, ArrowRight, MessageCircle, ShieldCheck, Star, CheckCircle, MapPin, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { TrustBadgeRow } from '@/components/trust/TrustBadge';
import { FloatingLogo, BrandWatermark } from '@/components/brand/FloatingLogo';
import { TLCBadge } from '@/components/brand/TLCBadge';

const features = [
  {
    icon: Users,
    title: 'Meet First',
    subtitle: 'Real People, No Swiping',
    description: 'Connect at curated singles events. See who they really are before matching online.',
  },
  {
    icon: ShieldCheck,
    title: 'No Catfishing',
    subtitle: 'Identity Verified, Fake-Free',
    description: 'Every member is ID verified, selfie checked, and background screened.',
  },
  {
    icon: EyeOff,
    title: 'Complete Privacy',
    subtitle: 'Blurred Until You Meet',
    description: 'Photos stay blurred until you meet in person. Real chemistry, not filtered photos.',
  },
  {
    icon: Calendar,
    title: 'Real Events',
    subtitle: 'Admin-Vetted Community',
    description: 'Professionally hosted events with vetted attendees. A safer way to date.',
  },
];

const trustFeatures = [
  { icon: CheckCircle, label: 'Meet in person first' },
  { icon: EyeOff, label: 'No browsing profiles' },
  { icon: ShieldCheck, label: 'Admin-vetted names' },
  { icon: MapPin, label: 'Oklahoma matches' },
  { icon: Shield, label: 'Fraud checked' },
  { icon: Users, label: 'OK Resident verified' },
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
        {/* Background */}
        <div className="absolute inset-0 gradient-champagne-radial" />
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        
        {/* Brand Watermark */}
        <BrandWatermark />
        
        {/* Decorative Elements */}
        <div className="blur-orb blur-orb-primary w-[500px] h-[500px] -top-40 -right-40 opacity-15" />
        <div className="blur-orb blur-orb-accent w-[400px] h-[400px] bottom-20 -left-40 opacity-10" />
        <div className="blur-orb blur-orb-secondary w-[300px] h-[300px] top-1/4 right-1/4 opacity-10" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 w-full">
          <div className="mx-auto max-w-4xl text-center">
            {/* Floating Logo */}
            <div className="mb-10 flex justify-center animate-fade-in-up opacity-0 stagger-1">
              <FloatingLogo size="hero" showTagline={true} showTLC={true} />
            </div>
            
            {/* Trust Badges Row */}
            <div className="mb-8 flex flex-wrap justify-center gap-2 animate-fade-in-up opacity-0 stagger-2">
              <TrustBadgeRow 
                badges={['id-verified', 'selfie-verified', 'background-checked']} 
                size="md"
                showLabels={true}
              />
            </div>
            
            {/* Headlines */}
            <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl animate-fade-in-up opacity-0 stagger-3">
              Elevated Dating
              <span className="block text-gradient mt-2">+ Complete Privacy</span>
            </h1>
            
            <p className="mb-8 text-base text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0 stagger-3">
              Blurred profiles. Only revealed at events. Meet real Oklahoma singles 
              at curated events with complete identity verification.
            </p>

            {/* Feature Pills */}
            <div className="mb-10 flex flex-wrap justify-center gap-2 animate-fade-in-up opacity-0 stagger-4">
              {trustFeatures.slice(0, 4).map((feature, i) => (
                <div 
                  key={feature.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-sm text-foreground shadow-soft"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.label}
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-5">
              <Button size="xl" className="gap-3" asChild>
                <Link to="/events">
                  <Calendar className="h-5 w-5" />
                  Find an Event
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="gap-3 bg-card/50 backdrop-blur-sm" asChild>
                <Link to="/auth">
                  <Sparkles className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up opacity-0 stagger-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i} 
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-card flex items-center justify-center shadow-soft"
                  >
                    <span className="text-xs font-medium text-muted-foreground">👤</span>
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-foreground">500+ verified singles in OKC</p>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                  ))}
                  <span className="ml-1">4.9 average rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-card">
        <div className="mx-auto max-w-7xl px-4 relative">
          <div className="text-center mb-14">
            <Badge variant="premium" className="mb-4">Why We're Different</Badge>
            <h2 className="mb-4 text-3xl md:text-5xl font-bold text-foreground">
              Dating apps are broken.
            </h2>
            <p className="text-gradient text-2xl md:text-3xl font-bold">
              We're fixing that.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                variant="feature"
                className="group opacity-0 animate-fade-in-up text-center"
                style={{ animationDelay: `${index * 100 + 200}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="mb-5 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-foreground">{feature.title}</h3>
                  <p className="mb-3 text-sm font-medium text-primary">{feature.subtitle}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 relative gradient-champagne">
        <div className="mx-auto max-w-7xl px-4 relative">
          <div className="text-center mb-14">
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
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl gradient-secondary shadow-glow group-hover:scale-105 transition-transform duration-300">
                  <span className="text-3xl font-bold text-primary-foreground">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute right-0 top-10 hidden h-6 w-6 -translate-x-4 text-primary/30 md:block group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-card">
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
            <Card variant="champagne" className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No upcoming events. Check back soon!</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden gradient-champagne-radial">
        <BrandWatermark />
        <div className="blur-orb blur-orb-primary w-[300px] h-[300px] top-0 right-1/4 opacity-10" />
        <div className="blur-orb blur-orb-accent w-[250px] h-[250px] bottom-0 left-1/4 opacity-10" />
        
        <div className="mx-auto max-w-3xl px-4 text-center relative">
          <div className="mb-10 mx-auto">
            <FloatingLogo size="lg" showTagline={false} showTLC={true} />
          </div>
          <h2 className="mb-6 text-3xl md:text-5xl font-bold text-foreground">
            Ready to Meet Someone Real?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto">
            Join hundreds of OKC singles who are tired of catfishing and ghosting.
            Real connections start with real meetings.
          </p>
          <Button size="xl" variant="premium" className="gap-3" asChild>
            <Link to="/auth">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          
          <div className="mt-10">
            <TLCBadge variant="block" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
