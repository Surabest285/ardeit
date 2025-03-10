
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: Array<'student' | 'teacher'>;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles,
}) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // If not loading, check authentication immediately
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
        navigate('/unauthorized');
      }
      setShowLoading(false);
    } else {
      // Add a timeout to prevent infinite loading state
      const timer = setTimeout(() => {
        setShowLoading(false);
        if (!user) {
          navigate('/auth');
        }
      }, 3000); // 3 seconds timeout

      return () => clearTimeout(timer);
    }
  }, [user, profile, loading, navigate, allowedRoles]);

  if (loading && showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber mb-4" />
        <p className="text-ethiopia-earth">Loading your content...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
