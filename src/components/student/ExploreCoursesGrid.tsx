
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { Json } from '@/integrations/supabase/types';
import { TrendingUp, Award } from 'lucide-react';

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

interface ExploreCoursesGridProps {
  courses: Course[];
  enrolledCourseIds: string[];
}

const ExploreCoursesGrid: React.FC<ExploreCoursesGridProps> = ({
  courses,
  enrolledCourseIds,
}) => {
  const navigate = useNavigate();

  const handleCourseClick = (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) {
      navigate(`/student/classroom/${courseId}`);
    } else {
      navigate(`/student/course/${courseId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
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
        >
          {(course.is_trending || course.is_popular) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {course.is_trending && (
                <div className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                  <TrendingUp className="mr-1 h-3 w-3" /> Trending
                </div>
              )}
              {course.is_popular && (
                <div className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  <Award className="mr-1 h-3 w-3" /> Popular
                </div>
              )}
            </div>
          )}
        </CourseCard>
      ))}
    </div>
  );
};

export default ExploreCoursesGrid;
