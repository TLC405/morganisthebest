import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Calendar, Users, Dumbbell, Heart, Cross, Rainbow, Compass, 
  ArrowRight, Activity, Zap, MapPin, ChevronDown, ChevronUp, Terminal
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandWatermark } from '@/components/brand/FloatingLogo';
import { useUpcomingEvents } from '@/hooks/useEvents';
import { cn } from '@/lib/utils';

const verticals = [
  { id: 'singles', label: 'Singles OKC', icon: Heart, color: 'text-primary', desc: 'Dating events, mixers, speed dating', pulse: 3 },
  { id: 'workout', label: 'Workout OKC', icon: Dumbbell, color: 'text-primary', desc: 'Fitness classes, group runs, gym meetups', pulse: 5 },
  { id: 'inperson', label: 'InPerson OKC', icon: Users, color: 'text-primary', desc: 'Social meetups, networking, community', pulse: 2 },
  { id: 'faith', label: 'Faith OKC', icon: Cross, color: 'text-primary', desc: 'Faith-based community gatherings', pulse: 1 },
  { id: 'lgbtq', label: 'LGBTQ+ OKC', icon: Rainbow, color: 'text-primary', desc: 'Inclusive community events', pulse: 2 },
];

const stats = [
  { label: 'Events This Week', value: '12', icon: Calendar },
  { label: 'People Active', value: '247', icon: Activity },
  { label: 'Communities', value: '5', icon: Zap },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedVertical, setExpandedVertical] = useState<string | null>(null);
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
    const matchesVertical = !expandedVertical || event.category === expandedVertical;
    return matchesSearch && matchesVertical;
  });

  const toggleVertical = (id: string) => {
    setExpandedVertical(prev => prev === id ? null : id);
  };

  return (
    <Layout>
      {/* Command Center Hero */}
      <div className="border-b-4 border-foreground bg-card relative overflow-hidden">
        <BrandWatermark />
        <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-16">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-foreground bg-foreground text-background font-mono text-xs uppercase tracking-[0.3em] mb-4">
              <Compass className="h-3 w-3" />
              Command Center
            </div>
            <h1 className="font-mono font-black text-4xl md:text-6xl lg:text-7xl text-foreground uppercase tracking-tight mb-2">
              INSPIRE<span className="text-primary">OKC</span>
            </h1>
            <p className="font-mono text-xs md:text-sm text-muted-foreground uppercase tracking-[0.4em]">
              The Search Engine For Real Life
            </p>
          </div>

          {/* Terminal Command Bar */}
          <div className="relative mb-8 animate-fade-in-up stagger-2">
            <div className="flex items-center border-4 border-foreground bg-foreground">
              <div className="flex items-center gap-2 px-4 py-3 border-r-2 border-background/20">
                <Terminal className="h-5 w-5 text-primary" />
                <span className="font-mono text-xs text-background/60 hidden sm:inline">&gt;_</span>
              </div>
              <Input
                placeholder="FIND ANYTHING IN OKC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 text-base border-0 bg-foreground text-background font-mono uppercase tracking-wider placeholder:text-background/40 focus-visible:ring-0 focus-visible:border-0"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground font-mono font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up stagger-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="border-2 border-foreground bg-background p-3 md:p-4 text-center shadow-brutal-sm">
                  <Icon className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <div className="font-mono font-black text-xl md:text-2xl text-foreground">{stat.value}</div>
                  <div className="font-mono text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Vertical Sectors */}
      <div className="mx-auto max-w-5xl px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-3 w-3 bg-primary border-2 border-foreground" />
          <h2 className="font-mono font-bold text-sm uppercase tracking-[0.3em] text-foreground">
            Community Verticals
          </h2>
        </div>

        {/* Compass Grid */}
        <div className="space-y-3">
          {verticals.map((v, index) => {
            const Icon = v.icon;
            const isExpanded = expandedVertical === v.id;
            return (
              <div 
                key={v.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                {/* Sector Card */}
                <button
                  onClick={() => toggleVertical(v.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 md:p-5 border-4 border-foreground transition-all duration-150 text-left group",
                    isExpanded
                      ? "bg-foreground text-background shadow-none"
                      : "bg-card text-foreground shadow-brutal brutal-hover"
                  )}
                >
                  {/* Icon Box */}
                  <div className={cn(
                    "flex-shrink-0 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center border-2 transition-colors",
                    isExpanded 
                      ? "border-background/30 bg-primary text-primary-foreground" 
                      : "border-foreground bg-foreground text-background"
                  )}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-mono font-black text-base md:text-lg uppercase tracking-wider truncate">
                        {v.label}
                      </h3>
                      {/* Pulse Dot */}
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 bg-primary" />
                      </span>
                      <span className={cn(
                        "font-mono text-xs",
                        isExpanded ? "text-background/60" : "text-muted-foreground"
                      )}>
                        {v.pulse} live
                      </span>
                    </div>
                    <p className={cn(
                      "font-mono text-xs uppercase tracking-wider mt-0.5 truncate",
                      isExpanded ? "text-background/60" : "text-muted-foreground"
                    )}>
                      {v.desc}
                    </p>
                  </div>

                  {/* Expand Arrow */}
                  <div className={cn(
                    "flex-shrink-0 transition-transform",
                    isExpanded && "rotate-180"
                  )}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>

                {/* Expanded Events */}
                {isExpanded && (
                  <div className="border-x-4 border-b-4 border-foreground bg-background p-4 space-y-3 animate-fade-in-up">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[1, 2].map(i => (
                          <div key={i} className="h-20 bg-muted border-2 border-foreground animate-pulse" />
                        ))}
                      </div>
                    ) : filteredEvents.length > 0 ? (
                      <>
                        {filteredEvents.slice(0, 4).map((event) => (
                          <div 
                            key={event.id}
                            className="flex items-center gap-4 p-3 border-2 border-foreground bg-card shadow-brutal-sm brutal-hover cursor-pointer"
                          >
                            <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground">
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-mono font-bold text-sm uppercase tracking-wider text-foreground truncate">
                                {event.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span>•</span>
                                <span>{event.time}</span>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        ))}
                        <Link 
                          to="/events" 
                          className="flex items-center justify-center gap-2 p-3 border-2 border-foreground font-mono font-bold text-xs uppercase tracking-wider text-foreground hover:bg-foreground hover:text-background transition-all"
                        >
                          View All {v.label} Events
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Compass className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                          No events in this vertical yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Host CTA */}
        <div className="mt-8 border-4 border-foreground bg-foreground text-background p-6 md:p-8 text-center shadow-brutal">
          <h3 className="font-mono font-black text-xl md:text-2xl uppercase tracking-wider mb-2">
            Host Your Own Event
          </h3>
          <p className="text-background/70 font-mono text-sm mb-4">
            Create meetups, fitness sessions, or community gatherings in OKC.
          </p>
          <Button variant="outline" size="lg" className="border-2 border-background text-background hover:bg-background hover:text-foreground font-mono font-bold uppercase tracking-wider">
            <Calendar className="h-5 w-5 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
