
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import LiveClassroom from '@/components/LiveClassroom';
import { useToast } from '@/components/ui/use-toast';

const TeacherLiveClass = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [courseTitle, setCourseTitle] = useState('');
  const [isTeacherOfCourse, setIsTeacherOfCourse] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCourseOwnership = async () => {
      if (!user || !courseId) return;
      
      try {
        // Verify the teacher owns this course
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('title')
          .eq('id', courseId)
          .eq('teacher_id', user.id)
          .single();
          
        if (courseError) {
          console.error('Error verifying course ownership:', courseError);
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You are not authorized to teach this course.",
          });
          setIsTeacherOfCourse(false);
          return;
        }
        
        setCourseTitle(courseData.title);
        setIsTeacherOfCourse(true);
      } catch (error) {
        console.error('Exception verifying course ownership:', error);
        setIsTeacherOfCourse(false);
      } finally {
        setLoading(false);
      }
    };

    verifyCourseOwnership();
  }, [user, courseId, toast]);

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="h-screen">
        {courseId && courseTitle && isTeacherOfCourse && (
          <LiveClassroom 
            roomName={courseId} 
            courseTitle={courseTitle} 
            isTeacher={true}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default TeacherLiveClass;
