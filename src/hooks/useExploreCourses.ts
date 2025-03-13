
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Json } from '@/integrations/supabase/types';

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
  category_id?: string;
  features?: Json;
  instructor_info?: Json;
  is_popular?: boolean;
  is_trending?: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CourseTag {
  id: string;
  name: string;
}

export const useExploreCourses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<CourseTag[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('course_categories')
          .select('*')
          .order('name');
          
        if (!categoriesError) {
          console.log('Fetched categories:', categoriesData);
          setCategories(categoriesData || []);
        }
        
        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('course_tags')
          .select('*')
          .order('name');
          
        if (!tagsError) {
          console.log('Fetched tags:', tagsData);
          setTags(tagsData || []);
        }
        
        // Fetch all courses with extended information
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select(`
            *,
            category:category_id(id, name)
          `)
          .order('created_at', { ascending: false });
          
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load courses. Please try again.",
          });
        } else {
          console.log('Fetched courses:', coursesData);
          setCourses(coursesData || []);
        }
        
        // Fetch user enrollments to know which courses the user is already enrolled in
        if (user) {
          const { data: enrollmentsData, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('user_id', user.id);
            
          if (!enrollmentsError && enrollmentsData) {
            const enrolledIds = enrollmentsData.map(enrollment => enrollment.course_id);
            setEnrolledCourseIds(enrolledIds);
          }
        }
      } catch (error) {
        console.error('Exception fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  return {
    courses,
    enrolledCourseIds,
    loading,
    categories,
    tags
  };
};
