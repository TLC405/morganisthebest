import { ReactNode } from 'react';
import { RoleBasedNavbar } from './RoleBasedNavbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <RoleBasedNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
