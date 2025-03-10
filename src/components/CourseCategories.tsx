
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique levels from courses
  const levels = Array.from(new Set(courses.map(course => course.level)));
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search courses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          {levels.map(level => (
            <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
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
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No courses found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {levels.map(level => (
          <TabsContent key={level} value={level}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses
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
    </div>
  );
};

export default CourseCategories;
