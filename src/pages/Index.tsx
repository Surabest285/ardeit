
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CourseCategories from '@/components/CourseCategories';
import InstrumentShowcase from '@/components/InstrumentShowcase';
import AboutSection from '@/components/AboutSection';
import NewsletterForm from '@/components/NewsletterForm';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Fetch real courses from Supabase
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);
          
        if (error) {
          console.error('Error fetching courses:', error);
        } else {
          setCourses(data || []);
        }
      } catch (error) {
        console.error('Exception fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  return (
    <div className={`min-h-screen font-sans ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <Navbar />
      <Hero />
      
      {/* Courses Section */}
      <section id="courses" className="section-padding relative">
        <div className="container-custom">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-ethiopia-deepgreen/10 text-ethiopia-deepgreen inline-block mb-4">
              Our Courses
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Discover Our Sacred Music Courses</h2>
            <p className="text-muted-foreground">
              Immerse yourself in the rich traditions of Ethiopian Orthodox music through our carefully crafted courses.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
            </div>
          ) : courses.length > 0 ? (
            <CourseCategories courses={courses} />
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No courses available</h3>
              <p className="text-gray-500 mb-6">There are no courses available at the moment.</p>
              <Button 
                onClick={() => navigate('/auth')} 
                className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
              >
                Sign In to Create Courses
              </Button>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button 
              onClick={() => navigate('/student/explore')}
              className="inline-flex items-center gap-2 bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90 px-8 group"
            >
              Explore All Courses
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </div>
        </div>
      </section>
      
      <InstrumentShowcase />
      
      <AboutSection />
      
      {/* Newsletter Section */}
      <section id="newsletter" className="section-padding relative bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_transparent_70%,_rgba(166,75,42,0.08))]"></div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Join Our Community</h2>
            <p className="text-muted-foreground">
              Stay updated with new courses, events, and resources dedicated to Ethiopian Orthodox music.
            </p>
          </div>
          
          <NewsletterForm />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
