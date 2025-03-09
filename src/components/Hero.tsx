
import { useState, useEffect } from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-ethiopia-parchment opacity-70 -z-10"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-ethiopia-sand/30 -z-10"></div>
      
      <div 
        className={`container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-1000`}
      >
        {/* Content */}
        <div className="order-2 lg:order-1 max-w-2xl lg:pt-0 pt-10">
          <div className="space-y-6">
            <div className={`transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-amber/10 text-ethiopia-amber inline-block mb-4">
                Ethiopian Orthodox Tradition
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight text-foreground">
                <span className="relative">
                  A Journey into 
                  <span className="absolute -bottom-1 left-0 w-full h-[6px] bg-ethiopia-amber/30 rounded-full"></span>
                </span>
                <br />
                <span className="text-ethiopia-terracotta">Sacred Mezmur</span>
              </h1>
            </div>
            
            <p className={`text-lg md:text-xl text-muted-foreground transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Immerse yourself in centuries of Ethiopian Orthodox musical heritage. Learn Mezmur and traditional instruments through our carefully crafted courses.
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 pt-2 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <a 
                href="#courses" 
                className="btn-primary group flex items-center justify-center sm:justify-start gap-2 text-lg"
              >
                Explore Courses
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </a>
              
              <a 
                href="#demo" 
                className="flex items-center justify-center sm:justify-start gap-2 text-lg text-foreground hover:text-ethiopia-amber transition-colors px-6 py-3"
              >
                <PlayCircle size={24} />
                Watch Demo
              </a>
            </div>
          </div>
          
          <div className={`mt-12 flex items-center gap-4 transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div 
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-ethiopia-sand flex items-center justify-center text-xs font-medium"
                >
                  {i}
                </div>
              ))}
            </div>
            <div>
              <p className="text-muted-foreground">Join <span className="text-ethiopia-amber font-medium">500+</span> students</p>
            </div>
          </div>
        </div>
        
        {/* Image */}
        <div className={`order-1 lg:order-2 relative transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative">
            <div className="absolute -inset-4 bg-ethiopia-amber/10 rounded-full animate-soft-pulse"></div>
            <div className="relative bg-white rounded-2xl p-2 rotate-2 shadow-soft">
              <img 
                src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Ethiopian Orthodox Music" 
                className="rounded-xl object-cover h-[500px] w-full"
              />
            </div>
            <div className="glass-card absolute -bottom-8 -left-8 p-4 max-w-[260px] animate-float">
              <div className="flex items-start gap-3">
                <div className="bg-ethiopia-amber/20 p-2 rounded-full">
                  <span className="text-ethiopia-amber">🎵</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Begena Mastery</h3>
                  <p className="text-xs text-muted-foreground mt-1">Learn the ancient Ethiopian harp used in spiritual practice</p>
                </div>
              </div>
            </div>
            <div className="glass-card absolute -top-8 -right-8 p-4 max-w-[260px] animate-float animation-delay-1000">
              <div className="flex items-start gap-3">
                <div className="bg-ethiopia-terracotta/20 p-2 rounded-full">
                  <span className="text-ethiopia-terracotta">🎚️</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Mezmur Vocal Techniques</h3>
                  <p className="text-xs text-muted-foreground mt-1">Master the distinctive chanting styles of Ethiopian Orthodox hymns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
