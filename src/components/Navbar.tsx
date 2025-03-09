
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isTeacher = profile?.role === 'teacher';
  const dashboardLink = isTeacher ? '/teacher/dashboard' : '/student/dashboard';

  const handleDashboardClick = () => {
    if (user) {
      navigate(dashboardLink);
    } else {
      navigate('/auth');
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <nav className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-serif font-semibold text-ethiopia-terracotta">
            <span className="text-ethiopia-amber">Mezmur</span> Melodies
          </span>
        </Link>
        
        {/* Mobile Menu Button */}
        <button 
          className="block md:hidden text-foreground" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
          <li><Link to="/#courses" className="nav-link">Courses</Link></li>
          <li><Link to="/#instruments" className="nav-link">Instruments</Link></li>
          <li><Link to="/#about" className="nav-link">About</Link></li>
          <li><Link to="/#contact" className="nav-link">Contact</Link></li>
          {user && (
            <li>
              <Button 
                onClick={handleDashboardClick} 
                variant="outline" 
                className="border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
              >
                Dashboard
              </Button>
            </li>
          )}
          <li>
            <ProfileMenu />
          </li>
        </ul>
        
        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-20 p-6 md:hidden animate-fade-in-up">
            <ul className="flex flex-col gap-6 text-lg">
              <li className="border-b border-ethiopia-sand pb-3">
                <Link 
                  to="/#courses" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
              </li>
              <li className="border-b border-ethiopia-sand pb-3">
                <Link 
                  to="/#instruments" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instruments
                </Link>
              </li>
              <li className="border-b border-ethiopia-sand pb-3">
                <Link 
                  to="/#about" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li className="border-b border-ethiopia-sand pb-3">
                <Link 
                  to="/#contact" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              {user && (
                <li className="border-b border-ethiopia-sand pb-3">
                  <Button 
                    onClick={handleDashboardClick} 
                    variant="outline" 
                    className="w-full border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
                  >
                    Dashboard
                  </Button>
                </li>
              )}
              <li className="mt-4 flex justify-center">
                <ProfileMenu />
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
