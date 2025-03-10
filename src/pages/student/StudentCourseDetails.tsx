
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Loader2, 
  BookOpen, 
  Star, 
  BarChart, 
  Users, 
  Calendar, 
  ChevronDown,
  Check,
  Lock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TeacherInfo {
  full_name: string | null;
  avatar_url: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  lessons: number;
  rating: number;
  created_at: string;
  teacher_id: string;
  teacher: TeacherInfo;
}

interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  is_free: boolean;
}

const StudentCourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!user || !courseId) return;
      
      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            description,
            image,
            duration,
            level,
            lessons,
            rating,
            created_at,
            teacher_id
          `)
          .eq('id', courseId)
          .single();
          
        if (courseError) {
          console.error('Error fetching course:', courseError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load course details. Please try again.",
          });
          return;
        }

        // Get teacher info from profiles table
        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', courseData.teacher_id)
          .maybeSingle();

        if (teacherError) {
          console.error('Error fetching teacher data:', teacherError);
        }

        // Combine course and teacher data
        const courseWithTeacher = {
          ...courseData,
          teacher: teacherData || { full_name: null, avatar_url: null }
        };
          
        setCourse(courseWithTeacher);
        
        // Check if user is enrolled
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (!enrollmentError) {
          setIsEnrolled(!!enrollmentData);
        }
        
        // Fetch course sections and lessons
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('course_sections')
          .select('id, title, position')
          .eq('course_id', courseId)
          .order('position', { ascending: true });
          
        if (sectionsError) {
          console.error('Error fetching sections:', sectionsError);
        } else if (sectionsData) {
          // Fetch lessons for each section
          const sectionsWithLessons = await Promise.all(
            sectionsData.map(async (section) => {
              const { data: lessonsData, error: lessonsError } = await supabase
                .from('course_lessons')
                .select('id, title, description, duration, is_free')
                .eq('section_id', section.id)
                .order('position', { ascending: true });
                
              if (lessonsError) {
                console.error(`Error fetching lessons for section ${section.id}:`, lessonsError);
                return { ...section, lessons: [] };
              }
              
              return { ...section, lessons: lessonsData || [] };
            })
          );
          
          setSections(sectionsWithLessons);
        }
      } catch (error) {
        console.error('Exception fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [user, courseId, toast]);

  const handleEnroll = async () => {
    if (!user || !courseId) return;
    
    setEnrolling(true);
    
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          course_id: courseId,
          user_id: user.id,
          progress: { completed: false, lessons_completed: 0 }
        })
        .select();
        
      if (error) {
        console.error('Error enrolling in course:', error);
        toast({
          variant: "destructive",
          title: "Enrollment Failed",
          description: error.message || "Failed to enroll in this course. Please try again.",
        });
      } else {
        setIsEnrolled(true);
        toast({
          title: "Enrolled Successfully",
          description: "You've been enrolled in this course. Start learning now!",
        });
      }
    } catch (error) {
      console.error('Exception in course enrollment:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
          <div className="container-custom text-center py-20">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-4">Course Not Found</h1>
            <p className="text-lg text-ethiopia-earth mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/student/explore')} 
              className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          {/* Course Hero Section */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
            <div className="relative h-64 md:h-80">
              <img 
                src={course.image || "/placeholder.svg"} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 md:p-8 w-full">
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{course.title}</h1>
                  <div className="flex items-center text-white/80 gap-4 flex-wrap">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-ethiopia-amber text-ethiopia-amber" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="mr-1 h-4 w-4" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">About This Course</h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{course.description}</p>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Placeholder learning outcomes */}
                    <div className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
                      <span>Master the fundamentals of Ethiopian music</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
                      <span>Learn traditional instrument techniques</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
                      <span>Understand the cultural significance</span>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
                      <span>Practice with authentic compositions</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">Course Content</h2>
                  {sections.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {sections.map((section, index) => (
                        <AccordionItem key={section.id} value={section.id}>
                          <AccordionTrigger className="text-ethiopia-earth hover:text-ethiopia-terracotta">
                            <div className="text-left">
                              <span className="font-medium">Section {index + 1}: {section.title}</span>
                              <div className="text-sm text-gray-500 font-normal">
                                {section.lessons.length} lessons • {section.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)} min
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-3 pt-2">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <li key={lesson.id} className="flex items-start justify-between bg-ethiopia-parchment/20 p-3 rounded">
                                  <div className="flex items-start gap-3">
                                    <div className="bg-ethiopia-parchment rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-ethiopia-earth flex-shrink-0 mt-0.5">
                                      {lessonIndex + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-ethiopia-earth">{lesson.title}</h4>
                                      {lesson.description && (
                                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 ms-4">
                                    {lesson.duration && (
                                      <span className="text-xs text-gray-500">{lesson.duration} min</span>
                                    )}
                                    {lesson.is_free ? (
                                      <span className="text-xs bg-ethiopia-amber/10 text-ethiopia-amber px-2 py-0.5 rounded">Preview</span>
                                    ) : (
                                      <Lock className="h-3.5 w-3.5 text-gray-400" />
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-500 italic">No content available yet for this course.</p>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/3">
                <div className="bg-ethiopia-parchment/30 rounded-xl p-6 sticky top-24">
                  {isEnrolled ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
                        You're enrolled in this course
                      </div>
                      <Button 
                        onClick={() => navigate(`/student/classroom/${course.id}`)} 
                        className="w-full bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90 mb-4"
                      >
                        Go to Classroom
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <p className="text-2xl font-bold text-ethiopia-terracotta mb-2">Free</p>
                      <p className="text-gray-600 mb-6">Full lifetime access</p>
                      <Button 
                        onClick={handleEnroll} 
                        className="w-full bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90 mb-4"
                        disabled={enrolling}
                      >
                        {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enroll Now
                      </Button>
                    </div>
                  )}
                  
                  <div className="border-t border-ethiopia-sand/30 pt-4 mt-4">
                    <h3 className="font-medium text-ethiopia-earth mb-3">This course includes:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700">
                        <BookOpen className="mr-2 h-4 w-4 text-ethiopia-amber" />
                        {course.lessons} lessons
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Clock className="mr-2 h-4 w-4 text-ethiopia-amber" />
                        {course.duration} of content
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Users className="mr-2 h-4 w-4 text-ethiopia-amber" />
                        Access on desktop and mobile
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <Calendar className="mr-2 h-4 w-4 text-ethiopia-amber" />
                        <span>Created <time dateTime={course.created_at}>{new Date(course.created_at).toLocaleDateString()}</time></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCourseDetails;
