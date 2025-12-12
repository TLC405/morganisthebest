import { useState } from 'react';
import { Heart, Hash, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PinEntryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  eventName: string;
}

export const PinEntryModal = ({ open, onClose, onSubmit, eventName }: PinEntryModalProps) => {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (pin.length !== 4) return;
    
    setIsSubmitting(true);
    await onSubmit(pin);
    setIsSubmitting(false);
    setPin('');
  };

  const handlePinChange = (value: string) => {
    // Only allow digits, max 4 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setPin(cleaned);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Enter Their PIN
          </DialogTitle>
          <DialogDescription>
            Enter the 4-digit PIN from someone's nametag at {eventName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* PIN Input */}
          <div className="flex items-center justify-center gap-2">
            <Hash className="h-8 w-8 text-primary" />
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="0000"
              className="text-center text-4xl tracking-[0.5em] font-bold h-16 w-48"
            />
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            <p>When both of you enter each other's PIN,</p>
            <p className="text-primary font-medium">you'll match and names will be revealed! 💕</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={pin.length !== 4 || isSubmitting}
              className="flex-1"
            >
              <Heart className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Checking...' : 'Submit PIN'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
