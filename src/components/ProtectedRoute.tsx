import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePandit?: boolean;
  requireUser?: boolean;
}

export function ProtectedRoute({ children, requirePandit = false, requireUser = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (requirePandit && profile && !profile.is_pandit) {
        navigate('/dashboard');
        return;
      }

      if (requireUser && profile && profile.is_pandit) {
        navigate('/pandit-dashboard');
        return;
      }
    }
  }, [user, profile, loading, navigate, requirePandit, requireUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requirePandit && profile && !profile.is_pandit) {
    return null;
  }

  if (requireUser && profile && profile.is_pandit) {
    return null;
  }

  return <>{children}</>;
}