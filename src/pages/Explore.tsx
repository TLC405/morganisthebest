import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Users, Dumbbell, Heart, Cross, Rainbow, Compass, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandWatermark } from '@/components/brand/FloatingLogo';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

const verticals = [
  { id: 'all', label: 'All', icon: Compass },
  { id: 'singles', label: 'Singles OKC', icon: Heart },
  { id: 'workout', label: 'Workout OKC', icon: Dumbbell },
  { id: 'inperson', label: 'InPerson OKC', icon: Users },
  { id: 'faith', label: 'Faith OKC', icon: Cross },
  { id: 'lgbtq', label: 'LGBTQ+ OKC', icon: Rainbow },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVertical, setActiveVertical] = useState('all');
  const { events: dbEvents, isLoading } = useUpcomingEvents();

  const events = dbEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.start_time,
    location: event.venues?.name || 'TBD',
    description: event.description || '',
    category: 'singles',
  }));

  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Layout>
      {/* Hero Search */}
      <div className="border-b-4 border-foreground bg-card relative overflow-hidden">
        <BrandWatermark />
        <div className="relative mx-auto max-w-3xl px-4 py-12 md:py-16">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-mono font-black text-4xl md:text-6xl text-foreground uppercase tracking-tight mb-3">
              INSPIRE<span className="text-primary">OKC</span>
            </h1>
            <p className="font-mono text-sm md:text-base text-muted-foreground uppercase tracking-[0.3em]">
              What do you want to do in Oklahoma City?
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 animate-fade-in-up stagger-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search events, meetups, workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base border-4 border-foreground shadow-brutal font-mono"
            />
          </div>

          {/* Vertical Pills */}
          <div className="flex flex-wrap gap-2 justify-center animate-fade-in-up stagger-3">
            {verticals.map((v) => {
              const Icon = v.icon;
              const isActive = activeVertical === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVertical(v.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 border-2 border-foreground font-mono font-bold text-xs uppercase tracking-wider transition-all duration-150',
                    isActive
                      ? 'bg-foreground text-background shadow-none translate-x-0 translate-y-0'
                      : 'bg-card text-foreground shadow-brutal-sm brutal-hover'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-primary border-2 border-foreground" />
            <h2 className="font-mono font-bold text-lg uppercase tracking-wider text-foreground">
              {activeVertical === 'all' ? 'All Events' : verticals.find(v => v.id === activeVertical)?.label}
            </h2>
            <Badge variant="outline">{filteredEvents.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/events">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-muted border-2 border-foreground animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event, index) => (
              <Card 
                key={event.id} 
                variant="stacked"
                className="opacity-0 animate-fade-in-up brutal-hover cursor-pointer"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline">{event.category}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-lg text-foreground uppercase tracking-tight mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{event.time}</span>
                    <span className="text-foreground">•</span>
                    <span>{event.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="inset" className="text-center py-16">
            <Compass className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="font-mono text-muted-foreground uppercase tracking-wider">
              No events found. Check back soon!
            </p>
          </Card>
        )}

        {/* Host CTA */}
        <Card variant="brutal" className="mt-8 text-center">
          <CardContent className="py-8">
            <h3 className="font-mono font-bold text-xl text-foreground uppercase tracking-wider mb-2">
              Host Your Own Event
            </h3>
            <p className="text-muted-foreground mb-4">
              Create meetups, fitness sessions, or community gatherings.
            </p>
            <Button variant="primary" size="lg">
              <Calendar className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Explore;
