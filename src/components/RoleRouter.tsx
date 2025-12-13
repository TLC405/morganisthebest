import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleRouterProps {
  children: React.ReactNode;
}

export const RoleRouter = ({ children }: RoleRouterProps) => {
  const { user, role, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;

    // Only redirect from root or auth page after login
    const isRootOrAuth = location.pathname === '/' || location.pathname === '/auth';
    
    if (user && role && isRootOrAuth) {
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'team':
          navigate('/team/dashboard', { replace: true });
          break;
        case 'single':
        default:
          navigate('/dashboard', { replace: true });
          break;
      }
    }
  }, [user, role, isLoading, navigate, location.pathname]);

  return <>{children}</>;
};
