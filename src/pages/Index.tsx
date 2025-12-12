import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { mockEvents } from '@/data/mockData';
import { EventCard } from '@/components/events/EventCard';

const features = [
  {
    icon: Calendar,
    title: 'Real Events, Real People',
    description: 'Attend curated singles events in OKC. No endless swiping—just show up and connect.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'No geo-tracking. Check in with your door code when you arrive. Your location stays private.',
  },
  {
    icon: Users,
    title: 'Profile Reveal System',
    description: 'Profiles stay blurred until you both attend the same event. Meet in person first!',
  },
  {
    icon: Sparkles,
    title: 'Spark Connections',
    description: 'After meeting at an event, send a "Spark" to let them know you\'re interested.',
  },
];

const howItWorks = [
  { step: 1, title: 'Browse Events', description: 'Find singles events that match your interests' },
  { step: 2, title: 'RSVP & Get Code', description: 'Reserve your spot and receive your private door code' },
  { step: 3, title: 'Show Up & Check In', description: 'Enter your code or scan QR at the event entrance' },
  { step: 4, title: 'Reveal & Connect', description: 'See unblurred profiles of people you met!' },
];

const Index = () => {
  const upcomingEvents = mockEvents.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              <Heart className="h-4 w-4" fill="currentColor" />
              Oklahoma City's Privacy-First Dating Platform
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Meet Singles{' '}
              <span className="text-primary">In Person</span>
              <br />
              Not Just Online
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              No swiping. No geo-tracking. Just real connections at real events. 
              Profiles stay blurred until you meet face-to-face.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/events">
                  <Calendar className="h-5 w-5" />
                  Browse Events
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link to="/community">
                  <Users className="h-5 w-5" />
                  View Singles
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-card py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Why Social Singles OKC?
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border bg-background">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
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
      <section className="border-t border-border bg-card py-16 md:py-24">
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
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Heart className="mx-auto mb-6 h-16 w-16 text-primary" fill="currentColor" />
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to Meet Someone Special?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join hundreds of OKC singles who are tired of endless swiping 
            and ready for real connections.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link to="/events">
              Find Your First Event
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
