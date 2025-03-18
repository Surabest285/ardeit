
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Video, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
}

const TeacherCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching courses:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load courses. Please try again.",
          });
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
  }, [user, toast]);

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast({
          variant: "destructive",
          title: "Delete Failed",
          description: "There was a problem deleting this course. Please try again.",
        });
      } else {
        setCourses(courses.filter(course => course.id !== courseToDelete));
        toast({
          title: "Course Deleted",
          description: "The course has been deleted successfully.",
        });
      }
    } catch (error) {
      console.error('Exception deleting course:', error);
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
    }
  };

  const startLiveClass = (courseId: string) => {
    navigate(`/teacher/live-class/${courseId}`);
  };
  
  const editCourse = (courseId: string) => {
    navigate(`/teacher/courses/edit/${courseId}`);
  };

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta">Manage Courses</h1>
            <Button 
              onClick={() => navigate('/teacher/courses/create')} 
              className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Course
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    image={course.image}
                    duration={course.duration}
                    level={course.level}
                    lessons={course.lessons}
                    rating={course.rating}
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Button 
                      onClick={() => startLiveClass(course.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Start Live
                    </Button>
                    <Button 
                      onClick={() => editCourse(course.id)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm"
                          variant="destructive"
                          onClick={() => setCourseToDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                            Delete Course
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{course.title}"? This action cannot be undone 
                            and will remove all course content, including chapters, lessons, and student enrollments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setCourseToDelete(null)}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteCourse}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                          >
                            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
              <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No courses yet</h3>
              <p className="text-gray-500 mb-6">You haven't created any courses yet. Start teaching by creating your first course.</p>
              <Button 
                onClick={() => navigate('/teacher/courses/create')} 
                className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
              >
                <Plus className="mr-2 h-4 w-4" /> Create Your First Course
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherCourses;
