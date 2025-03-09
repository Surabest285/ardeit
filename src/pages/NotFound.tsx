
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ethiopia-parchment/30 p-4">
      <div className="glass-card p-8 md:p-12 max-w-md w-full text-center">
        <h1 className="text-6xl md:text-7xl font-serif font-medium text-ethiopia-terracotta mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">The page you're looking for cannot be found</p>
        
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
