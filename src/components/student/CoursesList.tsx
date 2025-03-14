
import React from 'react';
import CourseCard from '@/components/CourseCard';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

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

interface CoursesListProps {
  courses: EnrolledCourse[];
  loading: boolean;
  emptyMessage: string;
  emptyActionLabel?: string;
}

const CoursesList: React.FC<CoursesListProps> = ({
  courses,
  loading,
  emptyMessage,
  emptyActionLabel,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
        <h3 className="text-xl font-medium text-ethiopia-earth mb-4">
          {emptyMessage}
        </h3>
        <p className="text-gray-500 mb-6">
          {emptyActionLabel ? "You haven't started any courses yet." : "You haven't completed any courses yet."}
        </p>
        {emptyActionLabel && (
          <Button 
            onClick={() => navigate('/student/explore')} 
            className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
          >
            <Compass className="mr-2 h-4 w-4" /> {emptyActionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((enrollment) => (
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
  );
};

export default CoursesList;
