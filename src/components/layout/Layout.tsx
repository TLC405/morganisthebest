import { ReactNode } from 'react';
import { RoleBasedNavbar } from './RoleBasedNavbar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <RoleBasedNavbar />
      <main>{children}</main>
    </div>
  );
};
