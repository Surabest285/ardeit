
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ethiopia-parchment/30 p-4">
      <div className="glass-card p-8 md:p-12 max-w-md w-full text-center">
        <div className="mx-auto rounded-full bg-red-100 p-3 w-16 h-16 flex items-center justify-center mb-6">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-serif font-medium text-ethiopia-terracotta mb-4">
          Access Denied
        </h1>
        
        <p className="text-base text-foreground mb-6">
          You don't have permission to access this page. Please contact an administrator or return to the home page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={() => navigate('/')} 
            className="btn-primary"
          >
            Return to Home
          </Button>
          
          <Button 
            onClick={handleSignOut} 
            variant="outline"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
