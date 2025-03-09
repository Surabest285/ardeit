
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CourseCard from '@/components/CourseCard';
import InstrumentShowcase from '@/components/InstrumentShowcase';
import AboutSection from '@/components/AboutSection';
import NewsletterForm from '@/components/NewsletterForm';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Beginner Mezmur Vocal Techniques',
    description: 'Learn the fundamentals of Ethiopian Orthodox hymn singing, including basic scales and vocal techniques.',
    image: 'https://images.unsplash.com/photo-1592591452788-6e2edb7426cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '6 weeks',
    level: 'Beginner',
    lessons: 12,
    rating: 4.8
  },
  {
    id: 2,
    title: 'Begena for Worship',
    description: 'Master the begena, the ancient Ethiopian harp used in spiritual practice and meditation.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '8 weeks',
    level: 'Intermediate',
    lessons: 16,
    rating: 4.7
  },
  {
    id: 3,
    title: 'Advanced Mezmur Composition',
    description: 'Learn to compose traditional Mezmur hymns following authentic Ethiopian Orthodox musical structures.',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    duration: '10 weeks',
    level: 'Advanced',
    lessons: 20,
    rating: 4.9
  },
  {
    id: 4,
    title: 'Traditional Kirar Techniques',
    description: 'Explore the techniques and styles of playing the kirar in both religious and secular Ethiopian music.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    duration: '7 weeks',
    level: 'All Levels',
    lessons: 14,
    rating: 4.6
  }
];

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                description={course.description}
                image={course.image}
                duration={course.duration}
                level={course.level}
                lessons={course.lessons}
                rating={course.rating}
                className="animate-fade-in-up"
                style={{ animationDelay: `${course.id * 100}ms` }}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="#all-courses"
              className="inline-flex items-center gap-2 btn-primary px-8 group"
            >
              View All Courses
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </a>
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
