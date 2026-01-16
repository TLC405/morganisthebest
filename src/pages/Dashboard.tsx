import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Sparkles, ArrowRight, CheckCircle, Send, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useUserRSVPs } from '@/hooks/useEvents';
import { useProfiles } from '@/hooks/useProfiles';
import { VerificationBadge } from '@/components/profiles/VerificationBadge';
import type { VerificationLevel } from '@/types/database';

const Dashboard = () => {
  const { profile, isLoading: profileLoading } = useCurrentUser();
  const { upcoming, past, isLoading: rsvpsLoading } = useUserRSVPs();
  const { profiles: revealedProfiles, isLoading: profilesLoading } = useProfiles({ limit: 10 });

  const isLoading = profileLoading || rsvpsLoading || profilesLoading;

  const stats = [
    { label: 'Events Attended', value: past.length, icon: Calendar, color: 'primary' },
    { label: 'People Met', value: revealedProfiles.length, icon: Users, color: 'secondary' },
    { label: 'Waves Sent', value: 0, icon: Send, color: 'accent' },
    { label: 'Mutual Matches', value: 0, icon: Heart, color: 'primary' },
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-10 w-64 mb-4 rounded-xl" />
          <Skeleton className="h-6 w-48 mb-8 rounded-xl" />
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 relative">
        {/* Background Effects */}
        <div className="blur-orb blur-orb-primary w-[300px] h-[300px] -top-40 -right-40 opacity-30" />
        
        {/* Welcome Header */}
        <div className="mb-10 animate-fade-in-up relative">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome back, {profile?.name || 'there'}!
            </h1>
            {profile?.verification_level && (
              <VerificationBadge level={profile.verification_level as VerificationLevel} showLabel size="lg" />
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            Zero Catfishing • Zero Ghosting • 100% Real
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                variant="glass" 
                className="group hover-lift opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-colors`}>
                      <Icon className={`h-7 w-7 text-${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming RSVPs */}
          <Card 
            variant="elevated" 
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-foreground" />
                  </div>
                  Upcoming Events
                </CardTitle>
                <CardDescription className="mt-1">Your confirmed RSVPs</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 group" asChild>
                <Link to="/events">
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcoming.length > 0 ? (
                <div className="space-y-3">
                  {upcoming.map((rsvp) => {
                    const event = rsvp.events;
                    if (!event) return null;
                    return (
                      <div key={rsvp.id} className="flex items-center gap-4 rounded-xl glass-subtle p-4 hover:border-primary/30 transition-all group">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date} at {event.start_time}</p>
                          {rsvp.nametag_pin && (
                            <Badge variant="default" className="mt-2">
                              PIN: {rsvp.nametag_pin}
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" variant="premium" asChild>
                          <Link to="/check-in">Check In</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No upcoming RSVPs</p>
                  <Button variant="premium" asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Revealed */}
          <Card 
            variant="elevated"
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-secondary flex items-center justify-center">
                    <Users className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  People You've Met
                </CardTitle>
                <CardDescription className="mt-1">Send a wave to connect</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 group" asChild>
                <Link to="/matches">
                  View All
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {revealedProfiles.length > 0 ? (
                <div className="space-y-3">
                  {revealedProfiles.slice(0, 3).map((person) => (
                    <div key={person.id} className="flex items-center gap-4 rounded-xl glass-subtle p-4 hover:border-primary/30 transition-all group">
                      {person.photo_url ? (
                        <img
                          src={person.photo_url}
                          alt={person.name}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{person.name}{person.age ? `, ${person.age}` : ''}</h4>
                          {person.verification_level && (
                            <VerificationBadge level={person.verification_level as VerificationLevel} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{person.bio || 'No bio yet'}</p>
                      </div>
                      <Button size="sm" variant="premium" className="gap-1.5">
                        <Send className="h-3.5 w-3.5" />
                        Wave
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">Attend events to meet people!</p>
                  <Button variant="premium" asChild>
                    <Link to="/events">Find Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Events */}
          <Card 
            variant="elevated"
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[hsl(160_50%_50%)]/20 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-[hsl(160_50%_50%)]" />
                </div>
                Event History
              </CardTitle>
              <CardDescription>Events you've attended</CardDescription>
            </CardHeader>
            <CardContent>
              {past.length > 0 ? (
                <div className="space-y-2">
                  {past.slice(0, 5).map((rsvp) => {
                    const event = rsvp.events;
                    if (!event) return null;
                    return (
                      <div key={rsvp.id} className="flex items-center gap-3 text-sm p-3 rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-[hsl(160_50%_50%)]/10 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-[hsl(160_50%_50%)]" />
                        </div>
                        <span className="text-foreground font-medium flex-1">{event.title}</span>
                        <span className="text-muted-foreground text-xs">{event.date}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">No events attended yet</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card 
            variant="elevated"
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '650ms', animationFillMode: 'forwards' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                </div>
                Quick Actions
              </CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Edit My Profile', to: '/profile', icon: Users },
                { label: 'Find New Events', to: '/events', icon: Calendar },
                { label: 'View Matches', to: '/matches', icon: Heart },
              ].map((action) => (
                <Button 
                  key={action.label}
                  className="w-full justify-between group" 
                  variant="outline" 
                  asChild
                >
                  <Link to={action.to}>
                    <span className="flex items-center gap-3">
                      <action.icon className="h-4 w-4 text-primary" />
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
