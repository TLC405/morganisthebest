import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EventRoleSelector, RoleType } from '@/components/events/EventRoleSelector';
import { ProfilePrompts, Prompt } from '@/components/profiles/ProfilePrompts';
import { 
  Star, MapPin, Briefcase, GraduationCap, Heart, Calendar, 
  MessageCircle, TrendingUp, CheckCircle, Clock, Users, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MemberData, EventRole } from './MemberCard';

interface MemberDetailProps {
  member: MemberData | null;
  open: boolean;
  onClose: () => void;
  eventRoles?: EventRole[];
  onRolesChange?: (roles: RoleType[], description?: string) => void;
  prompts?: Prompt[];
  checkInStatus?: 'checked_in' | 'pending' | 'late';
  onCheckIn?: () => void;
  mode?: 'admin' | 'team' | 'member';
}

export const MemberDetail = ({
  member,
  open,
  onClose,
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

  if (!member) return null;

  const initials = member.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || '?';

  const handleSaveRoles = () => {
    onRolesChange?.(selectedRoles, roleDescription);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 pt-8 pb-16 px-6">
          <DialogHeader className="sr-only">
            <DialogTitle>{member.name}'s Profile</DialogTitle>
          </DialogHeader>
          
          {/* Close is handled by DialogContent */}
          
          {/* Community trusted badge */}
          {member.community_trusted && (
            <Badge className="absolute top-4 right-12 bg-primary/20 text-primary border-primary/30">
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
                <Badge variant="outline" className="mt-2">
                  <Heart className="h-3 w-3 mr-1" />
                  Looking for {member.looking_for}
                </Badge>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 mx-auto mb-1 text-primary" />
                <div className="text-lg font-bold">{member.events_attended || 0}</div>
                <div className="text-xs text-muted-foreground">Events</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                <div className="text-lg font-bold">{member.show_up_rate || 0}%</div>
                <div className="text-xs text-muted-foreground">Show-up</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
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

            {/* Event Roles (for team/admin) */}
            {(mode === 'admin' || mode === 'team') && onRolesChange && (
              <div className="pt-4 border-t border-border">
                <EventRoleSelector
                  selectedRoles={selectedRoles}
                  onRolesChange={setSelectedRoles}
                  roleDescription={roleDescription}
                  onDescriptionChange={setRoleDescription}
                />
                <Button className="w-full mt-4" onClick={handleSaveRoles}>
                  Save Roles
                </Button>
              </div>
            )}

            {/* Check-in button (for team) */}
            {mode === 'team' && checkInStatus && checkInStatus !== 'checked_in' && onCheckIn && (
              <Button className="w-full" onClick={onCheckIn}>
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
