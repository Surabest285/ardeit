
import React from 'react';
import CourseCard from '@/components/CourseCard';
import { Json } from '@/integrations/supabase/types';
import CourseBadges from './CourseBadges';

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
  is_popular?: boolean;
  is_trending?: boolean;
  category_id?: string;
  features?: Json;
  instructor_info?: Json;
}

interface CoursesGridProps {
  courses: Course[];
  courseTags: Record<string, string[]>;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({ courses, courseTags }) => {
  if (courses.length === 0) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-gray-500">No courses found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course, index) => {
        const tags = courseTags[course.id] || [];
        
        return (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            image={course.image}
            duration={course.duration}
            level={course.level}
            lessons={course.lessons}
            rating={course.rating}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CourseBadges 
              isTrending={course.is_trending}
              isPopular={course.is_popular}
              tags={tags}
            />
          </CourseCard>
        );
      })}
    </div>
  );
};

export default CoursesGrid;
