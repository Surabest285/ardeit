
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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

export const useCourseDetails = (courseId: string | undefined) => {
  const { user } = useAuth();
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

  return {
    course,
    sections,
    isEnrolled,
    loading,
    enrolling,
    handleEnroll
  };
};
