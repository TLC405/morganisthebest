import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Sparkles, Target, Heart, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RoleType = 'host' | 'icebreaker' | 'mentor' | 'newcomer' | 'regular' | 'success_story';

interface EventRoleSelectorProps {
  selectedRoles: RoleType[];
  onRolesChange: (roles: RoleType[]) => void;
  roleDescription?: string;
  onDescriptionChange?: (description: string) => void;
  compact?: boolean;
}

const roles: { type: RoleType; label: string; icon: typeof Crown; description: string }[] = [
  { type: 'host', label: 'Host', icon: Crown, description: 'Running the event' },
  { type: 'icebreaker', label: 'Icebreaker', icon: Users, description: 'Great at introductions' },
  { type: 'mentor', label: 'Mentor', icon: Star, description: 'Helps newcomers' },
  { type: 'newcomer', label: 'Newcomer', icon: Sparkles, description: 'First-time attendee' },
  { type: 'regular', label: 'Regular', icon: Target, description: 'Consistent attendee' },
  { type: 'success_story', label: 'Success Story', icon: Heart, description: 'Found a match!' },
];

const roleColors: Record<RoleType, string> = {
  host: 'bg-primary/20 text-primary border-primary hover:bg-primary/30',
  icebreaker: 'bg-secondary/20 text-secondary border-secondary hover:bg-secondary/30',
  mentor: 'bg-amber-500/20 text-amber-400 border-amber-500 hover:bg-amber-500/30',
  newcomer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500 hover:bg-emerald-500/30',
  regular: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
  success_story: 'bg-pink-500/20 text-pink-400 border-pink-500 hover:bg-pink-500/30',
};

export const EventRoleSelector = ({
  selectedRoles,
  onRolesChange,
  roleDescription = '',
  onDescriptionChange,
  compact = false,
}: EventRoleSelectorProps) => {
  const toggleRole = (roleType: RoleType) => {
    if (selectedRoles.includes(roleType)) {
      onRolesChange(selectedRoles.filter((r) => r !== roleType));
    } else {
      onRolesChange([...selectedRoles, roleType]);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role) => {
          const isSelected = selectedRoles.includes(role.type);
          const Icon = role.icon;
          return (
            <Badge
              key={role.type}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all',
                isSelected ? roleColors[role.type] : 'hover:bg-muted'
              )}
              onClick={() => toggleRole(role.type)}
            >
              <Icon className="h-3 w-3 mr-1" />
              {role.label}
              {isSelected && <Check className="h-3 w-3 ml-1" />}
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Assign Event Roles</Label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map((role) => {
            const isSelected = selectedRoles.includes(role.type);
            const Icon = role.icon;
            return (
              <Button
                key={role.type}
                type="button"
                variant="outline"
                className={cn(
                  'justify-start h-auto py-2 px-3',
                  isSelected && roleColors[role.type]
                )}
                onClick={() => toggleRole(role.type)}
              >
                <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-sm">{role.label}</div>
                  <div className="text-xs opacity-70">{role.description}</div>
                </div>
                {isSelected && <Check className="h-4 w-4 ml-auto flex-shrink-0" />}
              </Button>
            );
          })}
        </div>
      </div>

      {onDescriptionChange && (
        <div>
          <Label htmlFor="roleDescription" className="text-sm font-medium mb-2 block">
            Role Notes (Optional)
          </Label>
          <Textarea
            id="roleDescription"
            value={roleDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., Great at making newcomers feel welcome..."
            className="resize-none h-20"
          />
        </div>
      )}
    </div>
  );
};
