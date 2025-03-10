
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Compass, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    created_at: string;
  };
  progress: any;
  enrolled_at: string;
}

const StudentCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('in-progress');

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

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta">My Courses</h1>
            <Button 
              onClick={() => navigate('/student/explore')} 
              className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
            >
              <Compass className="mr-2 h-4 w-4" /> Explore Courses
            </Button>
          </div>

          <Tabs defaultValue="in-progress" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Courses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="in-progress">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
                </div>
              ) : getInProgressCourses().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getInProgressCourses().map((enrollment) => (
                    <CourseCard
                      key={enrollment.id}
                      id={enrollment.course.id}
                      title={enrollment.course.title}
                      description={enrollment.course.description}
                      image={enrollment.course.image}
                      duration={enrollment.course.duration}
                      level={enrollment.course.level}
                      lessons={enrollment.course.lessons}
                      rating={enrollment.course.rating || 0}
                      isEnrolled={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
                  <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No courses in progress</h3>
                  <p className="text-gray-500 mb-6">You haven't started any courses yet.</p>
                  <Button 
                    onClick={() => navigate('/student/explore')} 
                    className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                  >
                    <Compass className="mr-2 h-4 w-4" /> Find Courses to Enroll
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
                </div>
              ) : getCompletedCourses().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCompletedCourses().map((enrollment) => (
                    <CourseCard
                      key={enrollment.id}
                      id={enrollment.course.id}
                      title={enrollment.course.title}
                      description={enrollment.course.description}
                      image={enrollment.course.image}
                      duration={enrollment.course.duration}
                      level={enrollment.course.level}
                      lessons={enrollment.course.lessons}
                      rating={enrollment.course.rating || 0}
                      isEnrolled={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
                  <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No completed courses</h3>
                  <p className="text-gray-500 mb-6">You haven't completed any courses yet.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrollment) => (
                    <CourseCard
                      key={enrollment.id}
                      id={enrollment.course.id}
                      title={enrollment.course.title}
                      description={enrollment.course.description}
                      image={enrollment.course.image}
                      duration={enrollment.course.duration}
                      level={enrollment.course.level}
                      lessons={enrollment.course.lessons}
                      rating={enrollment.course.rating || 0}
                      isEnrolled={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
                  <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No enrolled courses</h3>
                  <p className="text-gray-500 mb-6">You haven't enrolled in any courses yet.</p>
                  <Button 
                    onClick={() => navigate('/student/explore')} 
                    className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
                  >
                    <Compass className="mr-2 h-4 w-4" /> Explore Courses
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCourses;
