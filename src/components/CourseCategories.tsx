
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from '@/components/CourseCard';
import { Input } from '@/components/ui/input';
import { Search, Tag, TrendingUp, Award, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

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
  features?: any[];
  instructor_info?: Record<string, any>;
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

  const renderCourseCard = (course: Course, index: number) => {
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
        {(course.is_trending || course.is_popular || tags.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-1">
            {course.is_trending && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-rose-100 text-rose-700">
                <TrendingUp className="h-3 w-3" /> Trending
              </Badge>
            )}
            {course.is_popular && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-700">
                <Award className="h-3 w-3" /> Popular
              </Badge>
            )}
            {tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" /> {tag}
              </Badge>
            ))}
          </div>
        )}
      </CourseCard>
    );
  };

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
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              {category.icon === 'music-note' && <BookOpen className="h-4 w-4" />}
              {category.icon === 'instrument' && <BookOpen className="h-4 w-4" />}
              {category.icon === 'book-open' && <BookOpen className="h-4 w-4" />}
              {category.icon === 'landmark' && <BookOpen className="h-4 w-4" />}
              {category.name}
            </TabsTrigger>
          ))}
          
          {levels.map(level => (
            <TabsTrigger key={level} value={`level-${level}`}>{level}</TabsTrigger>
          ))}
          
          <TabsTrigger value="trending" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Trending
          </TabsTrigger>
          
          <TabsTrigger value="popular" className="flex items-center gap-1">
            <Award className="h-4 w-4" /> Popular
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => renderCourseCard(course, index))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No courses found matching your search.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses
                .filter(course => course.category_id === category.id)
                .map((course, index) => renderCourseCard(course, index))}
            </div>
          </TabsContent>
        ))}
        
        {levels.map(level => (
          <TabsContent key={level} value={`level-${level}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCourses
                .filter(course => course.level === level)
                .map((course, index) => renderCourseCard(course, index))}
            </div>
          </TabsContent>
        ))}
        
        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses
              .filter(course => course.is_trending)
              .map((course, index) => renderCourseCard(course, index))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses
              .filter(course => course.is_popular)
              .map((course, index) => renderCourseCard(course, index))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseCategories;
