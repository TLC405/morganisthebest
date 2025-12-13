import { ReactNode } from 'react';
import { RoleBasedNavbar } from './RoleBasedNavbar';
import { Footer } from './Footer';
import { LoveBotWidget } from '@/components/chat/LoveBotWidget';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none opacity-50" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
      
      <RoleBasedNavbar />
      <main className="flex-1 relative z-10 page-transition">{children}</main>
      <Footer />
      <LoveBotWidget />
    </div>
  );
};
