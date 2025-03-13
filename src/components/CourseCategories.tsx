
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Json } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import CourseSearch from './course/CourseSearch';
import CategoryTabs from './course/CategoryTabs';
import CoursesGrid from './course/CoursesGrid';

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
  tags?: { id: string; name: string }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CourseCategoriesProps {
  courses: Course[];
}

const CourseCategories: React.FC<CourseCategoriesProps> = ({ courses }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [courseTags, setCourseTags] = useState<Record<string, string[]>>({});
  
  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('course_categories')
          .select('*')
          .order('name');
          
        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Exception fetching categories:', error);
      }
    };
    
    // Fetch tags for each course
    const fetchCourseTags = async () => {
      try {
        if (courses.length > 0) {
          const courseIds = courses.map(course => course.id);
          const { data, error } = await supabase
            .from('course_tags_mapping')
            .select(`
              course_id,
              tag:tag_id(id, name)
            `)
            .in('course_id', courseIds);
            
          if (error) {
            console.error('Error fetching course tags:', error);
          } else if (data) {
            const tagsByCourse: Record<string, string[]> = {};
            data.forEach(item => {
              if (item.tag && item.course_id) {
                if (!tagsByCourse[item.course_id]) {
                  tagsByCourse[item.course_id] = [];
                }
                tagsByCourse[item.course_id].push(item.tag.name);
              }
            });
            setCourseTags(tagsByCourse);
          }
        }
      } catch (error) {
        console.error('Exception fetching course tags:', error);
      }
    };
    
    fetchCategories();
    fetchCourseTags();
  }, [courses]);
  
  // Get unique levels from courses
  const levels = Array.from(new Set(courses.map(course => course.level)));
  
  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full">
      <CourseSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <Tabs defaultValue="all" className="w-full">
        <CategoryTabs categories={categories} levels={levels} />
        
        <TabsContent value="all">
          <CoursesGrid courses={filteredCourses} courseTags={courseTags} />
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <CoursesGrid 
              courses={filteredCourses.filter(course => course.category_id === category.id)} 
              courseTags={courseTags} 
            />
          </TabsContent>
        ))}
        
        {levels.map(level => (
          <TabsContent key={level} value={`level-${level}`}>
            <CoursesGrid 
              courses={filteredCourses.filter(course => course.level === level)} 
              courseTags={courseTags} 
            />
          </TabsContent>
        ))}
        
        <TabsContent value="trending">
          <CoursesGrid 
            courses={filteredCourses.filter(course => course.is_trending)} 
            courseTags={courseTags} 
          />
        </TabsContent>
        
        <TabsContent value="popular">
          <CoursesGrid 
            courses={filteredCourses.filter(course => course.is_popular)} 
            courseTags={courseTags} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseCategories;
