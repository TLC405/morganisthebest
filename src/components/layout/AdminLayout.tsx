import { ReactNode } from 'react';
import { RoleBasedNavbar } from './RoleBasedNavbar';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <RoleBasedNavbar />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 page-transition pb-20 md:pb-0">{children}</main>
      </div>
      <Footer className="hidden md:block" />
      <MobileBottomNav />
    </div>
  );
};
