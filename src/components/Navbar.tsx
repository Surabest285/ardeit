
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-serif font-semibold text-ethiopia-terracotta">
            <span className="text-ethiopia-amber">Mezmur</span> Melodies
          </span>
        </a>
        
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
          <li><a href="#courses" className="nav-link">Courses</a></li>
          <li><a href="#instruments" className="nav-link">Instruments</a></li>
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
          <li>
            <a 
              href="#join" 
              className="btn-primary flex items-center gap-2 hover:translate-y-[-2px]"
            >
              Join Now
            </a>
          </li>
        </ul>
        
        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 pt-20 p-6 md:hidden animate-fade-in-up">
            <ul className="flex flex-col gap-6 text-lg">
              <li className="border-b border-ethiopia-sand pb-3">
                <a 
                  href="#courses" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </a>
              </li>
              <li className="border-b border-ethiopia-sand pb-3">
                <a 
                  href="#instruments" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instruments
                </a>
              </li>
              <li className="border-b border-ethiopia-sand pb-3">
                <a 
                  href="#about" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </a>
              </li>
              <li className="border-b border-ethiopia-sand pb-3">
                <a 
                  href="#contact" 
                  className="block nav-link" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </li>
              <li className="mt-4">
                <a 
                  href="#join" 
                  className="btn-primary block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Now
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
