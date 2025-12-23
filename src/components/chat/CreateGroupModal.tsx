import { useState } from 'react';
import { X, Users, Calendar, Heart, UserPlus, Search, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type GroupType = 'event' | 'match_group' | 'friend_group';

interface Contact {
  id: string;
  name: string;
  photoUrl?: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (type: GroupType, name: string, memberIds: string[]) => void;
  contacts: Contact[];
}

const groupTypes = [
  { 
    type: 'event' as GroupType, 
    label: 'Event Group', 
    description: 'Chat with event attendees',
    icon: Calendar 
  },
  { 
    type: 'match_group' as GroupType, 
    label: 'Match Group', 
    description: 'Curated group of compatible singles',
    icon: Heart 
  },
  { 
    type: 'friend_group' as GroupType, 
    label: 'Friend Group', 
    description: 'Bring your squad',
    icon: UserPlus 
  },
];

export const CreateGroupModal = ({ isOpen, onClose, onCreate, contacts }: CreateGroupModalProps) => {
  const [step, setStep] = useState<'type' | 'details' | 'members'>('type');
  const [selectedType, setSelectedType] = useState<GroupType | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectType = (type: GroupType) => {
    setSelectedType(type);
    setStep('details');
  };

  const handleContinueToMembers = () => {
    if (groupName.trim()) {
      setStep('members');
    }
  };

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (selectedType && groupName.trim() && selectedMembers.length > 0) {
      onCreate(selectedType, groupName.trim(), selectedMembers);
      handleClose();
    }
  };

  const handleClose = () => {
    setStep('type');
    setSelectedType(null);
    setGroupName('');
    setSelectedMembers([]);
    setSearchQuery('');
    onClose();
  };

  const handleBack = () => {
    if (step === 'members') setStep('details');
    else if (step === 'details') setStep('type');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            {step !== 'type' && (
              <Button variant="ghost" size="sm" onClick={handleBack} className="text-muted-foreground">
                Back
              </Button>
            )}
            <DialogTitle className="text-center flex-1 text-base font-semibold">
              {step === 'type' && 'New Group'}
              {step === 'details' && 'Group Details'}
              {step === 'members' && 'Add Members'}
            </DialogTitle>
            {step === 'members' ? (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCreate}
                disabled={selectedMembers.length === 0}
                className="text-primary font-semibold"
              >
                Create
              </Button>
            ) : (
              <div className="w-12" />
            )}
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {/* Step 1: Select Type */}
          {step === 'type' && (
            <div className="space-y-2">
              {groupTypes.map((gt) => (
                <button
                  key={gt.type}
                  onClick={() => handleSelectType(gt.type)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <gt.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-foreground">{gt.label}</h3>
                    <p className="text-xs text-muted-foreground">{gt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Group Details */}
          {step === 'details' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Group name"
                  className="text-center h-12 text-lg font-medium bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary"
                  autoFocus
                />
              </div>
              <Button 
                onClick={handleContinueToMembers}
                disabled={!groupName.trim()}
                className="w-full h-11 rounded-xl"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: Add Members */}
          {step === 'members' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search people"
                  className="pl-10 h-10 bg-muted/50 border-0 rounded-xl"
                />
              </div>

              {selectedMembers.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedMembers.map(id => {
                    const contact = contacts.find(c => c.id === id);
                    if (!contact) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => toggleMember(id)}
                        className="flex flex-col items-center gap-1 flex-shrink-0"
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={contact.photoUrl} />
                            <AvatarFallback className="bg-muted text-sm">{contact.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                            <X className="h-3 w-3 text-primary-foreground" />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground truncate max-w-[60px]">
                          {contact.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedMembers.includes(contact.id);
                  return (
                    <button
                      key={contact.id}
                      onClick={() => toggleMember(contact.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.photoUrl} />
                        <AvatarFallback className="bg-muted text-sm">{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1 text-sm font-medium text-foreground text-left">{contact.name}</span>
                      <div className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                        isSelected 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground/30"
                      )}>
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
