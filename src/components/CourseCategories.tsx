
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from '@/components/CourseCard';

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

interface CourseCategoriesProps {
  courses: Course[];
}

const CourseCategories: React.FC<CourseCategoriesProps> = ({ courses }) => {
  // Get unique levels from courses
  const levels = Array.from(new Set(courses.map(course => course.level)));

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Courses</TabsTrigger>
        {levels.map(level => (
          <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
        ))}
      </TabsList>
      
      <TabsContent value="all">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
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
            />
          ))}
        </div>
      </TabsContent>
      
      {levels.map(level => (
        <TabsContent key={level} value={level}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses
              .filter(course => course.level === level)
              .map((course, index) => (
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
                />
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CourseCategories;
