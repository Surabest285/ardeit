
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseCard from '@/components/CourseCard';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const StudentExplore = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  
  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      if (!user) return;
      
      try {
        // Fetch all courses
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load courses. Please try again.",
          });
        } else {
          setCourses(coursesData || []);
        }
        
        // Fetch user enrollments to know which courses the user is already enrolled in
        const { data: enrollmentsData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('user_id', user.id);
          
        if (!enrollmentsError && enrollmentsData) {
          const enrolledIds = enrollmentsData.map(enrollment => enrollment.course_id);
          setEnrolledCourseIds(enrolledIds);
        }
      } catch (error) {
        console.error('Exception fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndEnrollments();
  }, [user, toast]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter ? course.level === levelFilter : true;
    const matchesDuration = durationFilter ? course.duration === durationFilter : true;
    
    return matchesSearch && matchesLevel && matchesDuration;
  });

  const handleCourseClick = (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) {
      navigate(`/student/classroom/${courseId}`);
    } else {
      navigate(`/student/course/${courseId}`);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">Explore Courses</h1>
          
          {/* Search and filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={durationFilter} onValueChange={setDurationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Duration</SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="3+ months">3+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  image={course.image}
                  duration={course.duration}
                  level={course.level}
                  lessons={course.lessons}
                  rating={course.rating || 0}
                  isEnrolled={enrolledCourseIds.includes(course.id)}
                  className="cursor-pointer"
                  style={{ animationDelay: `${filteredCourses.indexOf(course) * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
              <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No courses found</h3>
              {searchTerm || levelFilter || durationFilter ? (
                <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              ) : (
                <p className="text-gray-500 mb-6">There are no courses available at the moment.</p>
              )}
              {(searchTerm || levelFilter || durationFilter) && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setLevelFilter('');
                    setDurationFilter('');
                  }} 
                  variant="outline"
                  className="border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentExplore;
