import { Link } from 'react-router-dom';
import { Compass, Calendar, Users, Shield, ArrowRight, CheckCircle, MapPin, Dumbbell, Heart, Cross, Rainbow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { Skeleton } from '@/components/ui/skeleton';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { FloatingLogo, BrandWatermark } from '@/components/brand/FloatingLogo';
import { TLCBadge } from '@/components/brand/TLCBadge';

const verticals = [
  { icon: Heart, label: 'Singles OKC', desc: 'Dating events, mixers, speed dating' },
  { icon: Dumbbell, label: 'Workout OKC', desc: 'Fitness classes, group runs, gym meetups' },
  { icon: Users, label: 'InPerson OKC', desc: 'Social meetups, networking, community' },
  { icon: Cross, label: 'Faith OKC', desc: 'Faith-based community gatherings' },
  { icon: Rainbow, label: 'LGBTQ+ OKC', desc: 'Inclusive community events' },
  { icon: Calendar, label: 'Host Events', desc: 'Create your own community events' },
];

const trustFeatures = [
  { icon: CheckCircle, label: 'Meet in person first' },
  { icon: Shield, label: 'Verified members' },
  { icon: MapPin, label: 'Oklahoma City only' },
  { icon: Users, label: 'Real community' },
];

const howItWorks = [
  { step: 1, title: 'Explore', description: 'Find events across all verticals' },
  { step: 2, title: 'RSVP & Show Up', description: 'Reserve your spot and arrive ready' },
  { step: 3, title: 'Check In & Get PIN', description: 'Check in at the door, get your nametag PIN' },
  { step: 4, title: 'Connect', description: 'Exchange PINs — mutual matches unlock chat!' },
];

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

const Social = () => {
  const { events: dbEvents, isLoading } = useUpcomingEvents(3);
  const upcomingEvents = dbEvents.map(mapEventForDisplay);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center border-b-4 border-foreground bg-card">
        <BrandWatermark />
        <div className="absolute inset-0 bg-dots opacity-50" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24 w-full">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-10 flex justify-center animate-fade-in-up opacity-0 stagger-1">
              <FloatingLogo size="hero" showTagline={true} />
            </div>
            
            <h1 className="mb-6 text-3xl font-mono font-black tracking-tight text-foreground md:text-5xl lg:text-6xl uppercase animate-fade-in-up opacity-0 stagger-3">
              The Search Engine For Real Life
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto font-mono uppercase tracking-wider animate-fade-in-up opacity-0 stagger-3">
              Cure Isolation. Get Out.
            </p>

            {/* Trust Pills */}
            <div className="mb-10 flex flex-wrap justify-center gap-2 animate-fade-in-up opacity-0 stagger-4">
              {trustFeatures.map((feature) => (
                <div 
                  key={feature.label}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-foreground bg-card text-sm text-foreground font-mono font-bold uppercase tracking-wider"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  {feature.label}
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0 stagger-5">
              <Button size="xl" variant="primary" asChild>
                <Link to="/explore">
                  <Compass className="h-5 w-5" />
                  Explore OKC
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/auth">
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Verticals Section */}
      <section className="py-16 md:py-24 bg-background border-b-4 border-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Community Verticals</Badge>
            <h2 className="mb-4 text-3xl md:text-5xl font-mono font-black text-foreground uppercase tracking-tight">
              Find Your People
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verticals.map((v, index) => (
              <Card 
                key={v.label} 
                variant="feature"
                className="group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100 + 200}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center border-2 border-foreground bg-foreground">
                    <v.icon className="h-7 w-7 text-background" />
                  </div>
                  <h3 className="mb-2 text-lg font-mono font-bold text-foreground uppercase tracking-wider">{v.label}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-card border-b-4 border-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">Simple Process</Badge>
            <h2 className="text-3xl md:text-5xl font-mono font-black text-foreground uppercase tracking-tight">
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
                <div className="mb-6 mx-auto flex h-20 w-20 items-center justify-center border-4 border-foreground bg-foreground shadow-brutal-sm">
                  <span className="text-3xl font-mono font-black text-background">{item.step}</span>
                </div>
                <h3 className="mb-3 text-xl font-mono font-bold text-foreground uppercase tracking-wider">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="absolute right-0 top-10 hidden h-6 w-6 -translate-x-4 text-muted-foreground md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 md:py-24 bg-background border-b-4 border-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge variant="default" className="mb-4">Featured</Badge>
              <h2 className="text-3xl md:text-5xl font-mono font-black text-foreground uppercase tracking-tight">
                Upcoming Events
              </h2>
            </div>
            <Button variant="ghost" className="gap-2 group self-start" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[420px] bg-muted border-2 border-foreground animate-pulse" />
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
            <Card variant="inset" className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground font-mono uppercase tracking-wider">No upcoming events. Check back soon!</p>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-10 mx-auto flex justify-center">
            <FloatingLogo size="lg" showTagline={false} />
          </div>
          <h2 className="mb-6 text-3xl md:text-5xl font-mono font-black text-foreground uppercase tracking-tight">
            Ready to Get Out?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground max-w-xl mx-auto">
            Join the Inspire OKC community. Real connections start with real meetings.
          </p>
          <Button size="xl" variant="primary" asChild>
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

export default Social;
