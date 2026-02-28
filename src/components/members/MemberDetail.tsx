import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { EventRoleSelector, RoleType } from '@/components/events/EventRoleSelector';
import { ProfilePrompts, Prompt } from '@/components/profiles/ProfilePrompts';
import { 
  Star, MapPin, Briefcase, Heart, Calendar, 
  MessageCircle, TrendingUp, CheckCircle, Send, Clock, AlertTriangle,
  ThumbsUp, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MemberData, EventRole, BehaviorMetrics } from './MemberCard';

interface MemberDetailProps {
  member: MemberData | null;
  open: boolean;
  onClose: () => void;
  behaviorMetrics?: BehaviorMetrics | null;
  eventRoles?: EventRole[];
  onRolesChange?: (roles: RoleType[], description?: string) => void;
  prompts?: Prompt[];
  checkInStatus?: 'checked_in' | 'pending' | 'late';
  onCheckIn?: () => void;
  mode?: 'admin' | 'team' | 'member';
}

const trustLevelLabels: Record<string, { label: string; color: string }> = {
  rising_star: { label: 'Rising Star', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  community_trusted: { label: 'Community Trusted', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  veteran: { label: 'Veteran', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export const MemberDetail = ({
  member,
  open,
  onClose,
  behaviorMetrics,
  eventRoles = [],
  onRolesChange,
  prompts = [],
  checkInStatus,
  onCheckIn,
  mode = 'admin',
}: MemberDetailProps) => {
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>(
    eventRoles.map((r) => r.role_type)
  );
  const [roleDescription, setRoleDescription] = useState(
    eventRoles[0]?.role_description || ''
  );
  const [activeTab, setActiveTab] = useState('profile');

  if (!member) return null;

  const initials = member.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleSaveRoles = () => {
    onRolesChange?.(selectedRoles, roleDescription);
  };

  const trustIndex = behaviorMetrics?.trust_index ?? member.trust_index ?? 50;
  const trustLevel = behaviorMetrics?.trust_level ?? member.trust_level ?? 'rising_star';
  const trustLevelInfo = trustLevelLabels[trustLevel] || trustLevelLabels.rising_star;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden glass border-primary/20">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 pt-8 pb-16 px-6">
          <DialogHeader className="sr-only">
            <DialogTitle>{member.name}'s Profile</DialogTitle>
          </DialogHeader>
          
          {/* Community trusted badge */}
          {member.community_trusted && (
            <Badge className="absolute top-4 right-12 bg-primary/20 text-primary border-primary/30 shadow-glow">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Community Trusted
            </Badge>
          )}
        </div>

        {/* Avatar overlapping header */}
        <div className="relative -mt-12 px-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={member.photo_url || ''} alt={member.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="px-6 pb-6 space-y-6">
            {/* Name and basic info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {member.name}{member.age && `, ${member.age}`}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                {member.area && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {member.area}
                  </span>
                )}
                {member.occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {member.occupation}
                  </span>
                )}
              </div>
              {member.looking_for && (
                <Badge variant="default" className="mt-2">
                  <Heart className="h-3 w-3 mr-1" />
                  Looking for {member.looking_for}
                </Badge>
              )}
            </div>

            {/* Tabs for Profile / Behavior Tracking */}
            {(mode === 'admin' || mode === 'team') && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 glass border-0 p-1 rounded-xl">
                  <TabsTrigger value="profile" className="rounded-lg data-[state=active]:shadow-glow">
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="behavior" className="rounded-lg data-[state=active]:shadow-glow-thunder">
                    <Activity className="h-4 w-4 mr-1" />
                    Behavior
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-4 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                      <div className="text-lg font-bold">{member.events_attended || 0}</div>
                      <div className="text-xs text-muted-foreground">Events</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                      <div className="text-lg font-bold">{member.show_up_rate || 0}%</div>
                      <div className="text-xs text-muted-foreground">Show-up</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/50">
                      <MessageCircle className="h-5 w-5 mx-auto mb-1 text-secondary" />
                      <div className="text-lg font-bold">{member.response_rate || 0}%</div>
                      <div className="text-xs text-muted-foreground">Response</div>
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">About</h3>
                      <p className="text-muted-foreground">{member.bio}</p>
                    </div>
                  )}

                  {/* Interests */}
                  {member.interests && member.interests.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.interests.map((interest, i) => (
                          <Badge key={i} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prompts */}
                  {prompts.length > 0 && (
                    <ProfilePrompts prompts={prompts} editable={false} />
                  )}
                </TabsContent>

                <TabsContent value="behavior" className="mt-4 space-y-4">
                  {/* Trust Index Gauge */}
                  <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">Trust Index</span>
                      </div>
                      <Badge variant="outline" className={trustLevelInfo.color}>
                        {trustLevelInfo.label}
                      </Badge>
                    </div>
                    <Progress value={trustIndex} className="h-3" />
                    <p className="text-2xl font-bold text-center">{Math.round(trustIndex)}<span className="text-sm text-muted-foreground">/100</span></p>
                  </div>

                  {/* Wave Activity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/50 p-4 text-center">
                      <Send className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-xl font-bold">{behaviorMetrics?.waves_sent || 0}</div>
                      <div className="text-xs text-muted-foreground">Waves Sent</div>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4 text-center">
                      <Send className="h-6 w-6 mx-auto mb-2 text-secondary rotate-180" />
                      <div className="text-xl font-bold">{behaviorMetrics?.waves_received || 0}</div>
                      <div className="text-xs text-muted-foreground">Waves Received</div>
                    </div>
                  </div>

                  {/* Chat Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-muted/50 p-4 text-center">
                      <MessageCircle className="h-6 w-6 mx-auto mb-2 text-secondary" />
                      <div className="text-xl font-bold">{behaviorMetrics?.messages_sent || 0}</div>
                      <div className="text-xs text-muted-foreground">Messages Sent</div>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-4 text-center">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <div className="text-xl font-bold">{behaviorMetrics?.avg_response_time_mins || 0}</div>
                      <div className="text-xs text-muted-foreground">Avg Response (min)</div>
                    </div>
                  </div>

                  {/* Feedback & Reports */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                      <ThumbsUp className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
                      <div className="text-xl font-bold text-emerald-400">{behaviorMetrics?.positive_feedback_received || 0}</div>
                      <div className="text-xs text-muted-foreground">Positive Feedback</div>
                    </div>
                    <div className={cn(
                      "rounded-xl p-4 text-center",
                      (behaviorMetrics?.reports_received || 0) > 0 
                        ? "bg-destructive/10 border border-destructive/20" 
                        : "bg-muted/50"
                    )}>
                      <AlertTriangle className={cn(
                        "h-6 w-6 mx-auto mb-2",
                        (behaviorMetrics?.reports_received || 0) > 0 ? "text-destructive" : "text-muted-foreground"
                      )} />
                      <div className={cn(
                        "text-xl font-bold",
                        (behaviorMetrics?.reports_received || 0) > 0 ? "text-destructive" : ""
                      )}>{behaviorMetrics?.reports_received || 0}</div>
                      <div className="text-xs text-muted-foreground">Reports</div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}

            {/* Simple view for member mode */}
            {mode === 'member' && (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <div className="text-lg font-bold">{member.events_attended || 0}</div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                    <div className="text-lg font-bold">{member.show_up_rate || 0}%</div>
                    <div className="text-xs text-muted-foreground">Show-up</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <MessageCircle className="h-5 w-5 mx-auto mb-1 text-secondary" />
                    <div className="text-lg font-bold">{member.response_rate || 0}%</div>
                    <div className="text-xs text-muted-foreground">Response</div>
                  </div>
                </div>

                {member.bio && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">About</h3>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                )}

                {member.interests && member.interests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {member.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {prompts.length > 0 && (
                  <ProfilePrompts prompts={prompts} editable={false} />
                )}
              </>
            )}

            {/* Event Roles (for team/admin) */}
            {(mode === 'admin' || mode === 'team') && onRolesChange && (
              <div className="pt-4 border-t border-border">
                <EventRoleSelector
                  selectedRoles={selectedRoles}
                  onRolesChange={setSelectedRoles}
                  roleDescription={roleDescription}
                  onDescriptionChange={setRoleDescription}
                />
                <Button className="w-full mt-4" variant="primary" onClick={handleSaveRoles}>
                  Save Roles
                </Button>
              </div>
            )}

            {/* Check-in button (for team) */}
            {mode === 'team' && checkInStatus && checkInStatus !== 'checked_in' && onCheckIn && (
              <Button className="w-full" variant="primary" onClick={onCheckIn}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Check In
              </Button>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
