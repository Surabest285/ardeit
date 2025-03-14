
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface EnrolledCourse {
  id: string;
  course: {
    id: string;
    title: string;
    description: string;
    image: string;
    duration: string;
    level: string;
    lessons: number;
    rating: number;
  };
  progress: any;
  enrolled_at: string;
}

export const useEnrolledCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('enrollments')
          .select(`
            id,
            progress,
            enrolled_at,
            course:course_id (
              id, 
              title, 
              description, 
              image, 
              duration, 
              level, 
              lessons,
              rating
            )
          `)
          .eq('user_id', user.id)
          .order('enrolled_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching enrolled courses:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your courses. Please try again.",
          });
        } else {
          setEnrolledCourses(data || []);
        }
      } catch (error) {
        console.error('Exception fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user, toast]);

  const getInProgressCourses = () => {
    return enrolledCourses.filter(course => !course.progress?.completed);
  };

  const getCompletedCourses = () => {
    return enrolledCourses.filter(course => course.progress?.completed);
  };

  return {
    enrolledCourses,
    loading,
    getInProgressCourses,
    getCompletedCourses
  };
};
