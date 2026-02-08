import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AppRole = 'single' | 'team' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: AppRole[];
  redirectTo?: string;
}

/**
 * ProtectedRoute component that verifies user roles server-side
 * before rendering protected content. Uses the has_role() database
 * function to ensure role verification happens on the server.
 */
export const ProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo = '/events'
}: ProtectedRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyRole = async () => {
      if (!user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      try {
        // Server-side role verification using the has_role database function
        // Check each allowed role until one matches
        for (const role of allowedRoles) {
          const { data, error } = await supabase.rpc('has_role', {
            _user_id: user.id,
            _role: role
          });
          
          if (error) {
            console.error('Role verification error:', error);
            continue;
          }
          
          if (data === true) {
            setIsAuthorized(true);
            setIsChecking(false);
            return;
          }
        }
        
        // No matching role found
        setIsAuthorized(false);
        setIsChecking(false);
        toast.error('Access denied. You do not have permission to view this page.');
      } catch (error) {
        console.error('Role verification failed:', error);
        setIsAuthorized(false);
        setIsChecking(false);
      }
    };

    if (!authLoading) {
      verifyRole();
    }
  }, [user, authLoading, allowedRoles]);

  // Show nothing while checking auth state
  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to appropriate page if not authorized
  if (!isAuthorized) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
