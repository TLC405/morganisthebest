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

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
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

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{currentUser.eventsAttended.length}</p>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{revealedProfiles.length}</p>
                  <p className="text-sm text-muted-foreground">People Met</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{currentUser.totalConnections}</p>
                  <p className="text-sm text-muted-foreground">Waves Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Mutual Waves</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming RSVPs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Your confirmed RSVPs</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/events">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {upcomingRSVPs.length > 0 ? (
                <div className="space-y-4">
                  {upcomingRSVPs.map((rsvp) => {
                    const event = mockEvents.find(e => e.id === rsvp.eventId);
                    if (!event) return null;
                    return (
                      <div key={rsvp.eventId} className="flex items-center gap-4 rounded-lg bg-muted p-4">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                          <Badge variant="outline" className="mt-1">
                            Code: {rsvp.doorCode}
                          </Badge>
                        </div>
                        <Button size="sm" asChild>
                          <Link to="/check-in">Check In</Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No upcoming RSVPs</p>
                  <Button asChild>
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recently Revealed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>People You've Met</CardTitle>
                <CardDescription>Send a wave to connect</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/community">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {revealedProfiles.length > 0 ? (
                <div className="space-y-4">
                  {revealedProfiles.slice(0, 3).map((profile) => (
                    <div key={profile.id} className="flex items-center gap-4 rounded-lg bg-muted p-4">
                      <img
                        src={profile.photoUrl}
                        alt={profile.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{profile.name}, {profile.age}</h4>
                          <VerificationBadge level={profile.verificationLevel} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{profile.bio}</p>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Send className="h-3 w-3" />
                        Wave
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Attend events to meet people!</p>
                  <Button asChild>
                    <Link to="/events">Find Events</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Events */}
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>Events you've attended</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checkedInEvents.map((rsvp) => {
                  const event = mockEvents.find(e => e.id === rsvp.eventId);
                  if (!event) return null;
                  return (
                    <div key={rsvp.eventId} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{event.title}</span>
                      <span className="text-muted-foreground">— {event.date}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between" variant="outline" asChild>
                <Link to="/profile">
                  Edit My Profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button className="w-full justify-between" variant="outline" asChild>
                <Link to="/events">
                  Find New Events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button className="w-full justify-between" variant="outline" asChild>
                <Link to="/community">
                  Browse Singles
                  <ArrowRight className="h-4 w-4" />
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
