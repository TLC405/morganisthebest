import { Link } from 'react-router-dom';
import { Heart, Calendar, Users, Sparkles, ArrowRight, CheckCircle, Send } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { currentUser, mockProfiles, mockEvents, userRSVPs, canRevealProfile } from '@/data/mockData';
import { VerificationBadge } from '@/components/profiles/VerificationBadge';

const Dashboard = () => {
  const revealedProfiles = mockProfiles.filter(p => canRevealProfile(p.id));
  const upcomingRSVPs = userRSVPs.filter(r => !r.checkedIn);
  const checkedInEvents = userRSVPs.filter(r => r.checkedIn);

  const stats = [
    { label: 'Events Attended', value: currentUser.eventsAttended.length, icon: Calendar, color: 'primary' },
    { label: 'People Met', value: revealedProfiles.length, icon: Sparkles, color: 'secondary' },
    { label: 'Waves Sent', value: currentUser.totalConnections, icon: Send, color: 'accent' },
    { label: 'Mutual Waves', value: 3, icon: Heart, color: 'primary' },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Header with animation */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
            <VerificationBadge level={currentUser.verificationLevel} showLabel size="lg" />
          </div>
          <p className="text-muted-foreground">
            Zero Catfishing • Zero Ghosting • 100% Real
          </p>
        </div>

        {/* Stats Grid - Premium glass cards with animated counters */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                variant="glass" 
                className="hover-lift opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}/10 shadow-inner-glow`}>
                      <Icon className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground animate-count-up">{stat.value}</p>
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
            variant="glass" 
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Your confirmed RSVPs</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="group" asChild>
                <Link to="/events">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingRSVPs.length > 0 ? (
                <div className="space-y-4">
                  {upcomingRSVPs.map((rsvp) => {
                    const event = mockEvents.find(e => e.id === rsvp.eventId);
                    if (!event) return null;
                    return (
                      <div key={rsvp.eventId} className="flex items-center gap-4 rounded-xl bg-muted/50 p-4 hover:bg-muted/70 transition-colors group">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-16 w-16 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                          <Badge variant="premium" className="mt-1">
                            Code: {rsvp.doorCode}
                          </Badge>
                        </div>
                        <Button size="sm" variant="glow" asChild>
                          <Link to="/check-in">Check In</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">No upcoming RSVPs</p>
                  <Button variant="gradient" asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Revealed */}
          <Card 
            variant="glass"
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  People You've Met
                </CardTitle>
                <CardDescription>Send a wave to connect</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="group" asChild>
                <Link to="/matches">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {revealedProfiles.length > 0 ? (
                <div className="space-y-4">
                  {revealedProfiles.slice(0, 3).map((profile) => (
                    <div key={profile.id} className="flex items-center gap-4 rounded-xl bg-muted/50 p-4 hover:bg-muted/70 transition-colors group">
                      <img
                        src={profile.photoUrl}
                        alt={profile.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{profile.name}, {profile.age}</h4>
                          <VerificationBadge level={profile.verificationLevel} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{profile.bio}</p>
                      </div>
                      <Button size="sm" variant="premium" className="gap-1">
                        <Send className="h-3 w-3" />
                        Wave
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">Attend events to meet people!</p>
                  <Button variant="gradient" asChild>
                    <Link to="/events">Find Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Events */}
          <Card 
            variant="glass"
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Event History
              </CardTitle>
              <CardDescription>Events you've attended</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checkedInEvents.map((rsvp) => {
                  const event = mockEvents.find(e => e.id === rsvp.eventId);
                  if (!event) return null;
                  return (
                    <div key={rsvp.eventId} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{event.title}</span>
                      <span className="text-muted-foreground">— {event.date}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card 
            variant="glass"
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Quick Actions
              </CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between rounded-xl group" variant="outline" asChild>
                <Link to="/profile">
                  Edit My Profile
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button className="w-full justify-between rounded-xl group" variant="outline" asChild>
                <Link to="/events">
                  Find New Events
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button className="w-full justify-between rounded-xl group" variant="outline" asChild>
                <Link to="/matches">
                  View Matches
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
