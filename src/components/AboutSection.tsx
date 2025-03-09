
import { PlayCircle } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-ethiopia-parchment/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_transparent_70%,_rgba(212,164,76,0.1))]"></div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-deepgreen/10 text-ethiopia-deepgreen inline-block">
              Our Mission
            </span>
            
            <h2 className="text-3xl md:text-4xl font-serif leading-tight">
              Preserving Sacred Traditions for Future Generations
            </h2>
            
            <p className="text-muted-foreground">
              Since our founding, Mezmur Melodies Academy has been committed to preserving the rich heritage of Ethiopian Orthodox sacred music through education and community building. Our platform serves as a bridge between ancient traditions and modern learning methods.
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="bg-ethiopia-amber/20 p-1.5 rounded-full mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#A64B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Authentic Learning Experience</h3>
                  <p className="text-sm text-muted-foreground mt-1">Learn from masters who have decades of experience in Ethiopian Orthodox musical traditions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-ethiopia-amber/20 p-1.5 rounded-full mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#A64B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Community Connection</h3>
                  <p className="text-sm text-muted-foreground mt-1">Join a global community of learners passionate about Ethiopian Orthodox music</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-ethiopia-amber/20 p-1.5 rounded-full mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#A64B2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Modern Learning Tools</h3>
                  <p className="text-sm text-muted-foreground mt-1">Access high-quality video lessons, interactive tutorials, and performance feedback</p>
                </div>
              </div>
            </div>
            
            <a 
              href="#learn-more" 
              className="inline-flex items-center gap-2 text-ethiopia-terracotta hover:text-ethiopia-amber transition-colors mt-4"
            >
              <PlayCircle size={20} />
              Watch our story
            </a>
          </div>
          
          <div className="relative">
            <div className="relative z-10 bg-white p-2 rounded-xl shadow-soft rotate-[-2deg]">
              <img
                src="https://images.unsplash.com/photo-1566454825481-9c31a3a46efa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Ethiopian Orthodox Ceremony"
                className="rounded-lg h-[500px] w-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 transform translate-x-4 translate-y-4 bg-ethiopia-deepgreen/10 rounded-xl -z-[1]"></div>
            
            <div className="glass-card absolute -bottom-8 right-12 p-4 max-w-[260px]">
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-10 h-10 bg-ethiopia-amber/20 rounded-full flex items-center justify-center">
                  <span className="text-ethiopia-amber font-semibold">10+</span>
                </div>
                <p className="text-sm">Years preserving Ethiopian Orthodox musical heritage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
