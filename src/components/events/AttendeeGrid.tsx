import { useState } from 'react';
import { MemberCard, MemberData, EventRole } from '@/components/members/MemberCard';
import { MemberDetail } from '@/components/members/MemberDetail';
import { RoleType } from '@/components/events/EventRoleSelector';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, Clock, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Attendee extends MemberData {
  attendance_id: string;
  check_in_status: 'checked_in' | 'pending' | 'late' | null;
  checked_in_at: string | null;
  nametag_pin: string | null;
  door_code: string | null;
  event_roles: EventRole[];
}

interface AttendeeGridProps {
  attendees: Attendee[];
  onCheckIn?: (attendanceId: string) => void;
  onRolesChange?: (attendanceId: string, roles: RoleType[], description?: string) => void;
  loading?: boolean;
}

export const AttendeeGrid = ({
  attendees,
  onCheckIn,
  onRolesChange,
  loading = false,
}: AttendeeGridProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'checked_in' | 'pending' | 'newcomers'>('all');

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearch =
      attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.nametag_pin?.includes(searchQuery) ||
      attendee.door_code?.includes(searchQuery);

    const matchesFilter =
      filter === 'all' ||
      (filter === 'checked_in' && attendee.check_in_status === 'checked_in') ||
      (filter === 'pending' && (!attendee.check_in_status || attendee.check_in_status === 'pending')) ||
      (filter === 'newcomers' && (attendee.events_attended || 0) <= 1);

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter((a) => a.check_in_status === 'checked_in').length,
    pending: attendees.filter((a) => !a.check_in_status || a.check_in_status === 'pending').length,
    newcomers: attendees.filter((a) => (a.events_attended || 0) <= 1).length,
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleAttendeeClick = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setDetailOpen(true);
  };

  const handleRolesChange = (roles: RoleType[], description?: string) => {
    if (selectedAttendee && onRolesChange) {
      onRolesChange(selectedAttendee.attendance_id, roles, description);
    }
    setDetailOpen(false);
  };

  const handleCheckIn = () => {
    if (selectedAttendee && onCheckIn) {
      onCheckIn(selectedAttendee.attendance_id);
    }
    setDetailOpen(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="h-40 rounded-lg animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('all')}
        >
          <Users className="h-3 w-3 mr-1" />
          All ({stats.total})
        </Badge>
        <Badge
          variant={filter === 'checked_in' ? 'default' : 'outline'}
          className={cn('cursor-pointer', filter === 'checked_in' && 'bg-emerald-500')}
          onClick={() => setFilter('checked_in')}
        >
          <CheckCircle className="h-3 w-3 mr-1" />
          Checked In ({stats.checkedIn})
        </Badge>
        <Badge
          variant={filter === 'pending' ? 'default' : 'outline'}
          className={cn('cursor-pointer', filter === 'pending' && 'bg-amber-500')}
          onClick={() => setFilter('pending')}
        >
          <Clock className="h-3 w-3 mr-1" />
          Pending ({stats.pending})
        </Badge>
        <Badge
          variant={filter === 'newcomers' ? 'default' : 'outline'}
          className={cn('cursor-pointer', filter === 'newcomers' && 'bg-secondary')}
          onClick={() => setFilter('newcomers')}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          Newcomers ({stats.newcomers})
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, PIN, or door code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Grid */}
      {filteredAttendees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No attendees found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredAttendees.map((attendee) => (
            <MemberCard
              key={attendee.attendance_id}
              member={attendee}
              eventRoles={attendee.event_roles}
              checkInStatus={
                attendee.check_in_status === 'checked_in'
                  ? 'checked_in'
                  : attendee.check_in_status === 'late'
                  ? 'late'
                  : 'pending'
              }
              checkInTime={formatTime(attendee.checked_in_at)}
              onClick={() => handleAttendeeClick(attendee)}
              compact
            />
          ))}
        </div>
      )}

      {/* Member Detail Modal */}
      <MemberDetail
        member={selectedAttendee}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        eventRoles={selectedAttendee?.event_roles}
        onRolesChange={handleRolesChange}
        checkInStatus={
          selectedAttendee?.check_in_status === 'checked_in'
            ? 'checked_in'
            : selectedAttendee?.check_in_status === 'late'
            ? 'late'
            : 'pending'
        }
        onCheckIn={handleCheckIn}
        mode="team"
      />
    </div>
  );
};
