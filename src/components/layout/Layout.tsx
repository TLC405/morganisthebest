import { ReactNode } from 'react';
import { RoleBasedNavbar } from './RoleBasedNavbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { LoveBotWidget } from '@/components/chat/LoveBotWidget';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <RoleBasedNavbar />
      <main className="flex-1 page-transition pb-20 md:pb-0">{children}</main>
      <Footer className="hidden md:block" />
      <MobileBottomNav />
      <LoveBotWidget />
    </div>
  );
};
