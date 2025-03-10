
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import LiveClassroom from '@/components/LiveClassroom';
import { useToast } from '@/components/ui/use-toast';

const StudentLiveClass = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!user || !courseId) return;
      
      try {
        // Check enrollment first
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (enrollmentError || !enrollmentData) {
          console.error('Error checking enrollment:', enrollmentError);
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not enrolled in this course.",
          });
          return;
        }
        
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('title')
          .eq('id', courseId)
          .single();
          
        if (courseError) {
          console.error('Error fetching course:', courseError);
          return;
        }
        
        setCourseTitle(courseData.title);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [user, courseId, toast]);

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="h-screen">
        {courseId && courseTitle && (
          <LiveClassroom 
            roomName={courseId} 
            courseTitle={courseTitle} 
            isTeacher={false}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default StudentLiveClass;
