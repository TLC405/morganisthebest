import { useState } from 'react';
import { Settings, X, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ThemeVariantSwitcher } from '@/components/admin/ThemeVariantSwitcher';

export const SettingsPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Appearance
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ThemeVariantSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
};
