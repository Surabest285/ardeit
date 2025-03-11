
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseCard from '@/components/CourseCard';
import CourseCategories from '@/components/CourseCategories';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Filter, Tag, Badge, Award, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

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
  is_popular?: boolean;
  is_trending?: boolean;
  features?: any[];
  instructor_info?: Record<string, any>;
}

interface CourseTag {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
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
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<CourseTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('grid');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('course_categories')
          .select('*')
          .order('name');
          
        if (!categoriesError) {
          console.log('Fetched categories:', categoriesData);
          setCategories(categoriesData || []);
        }
        
        // Fetch tags
        const { data: tagsData, error: tagsError } = await supabase
          .from('course_tags')
          .select('*')
          .order('name');
          
        if (!tagsError) {
          console.log('Fetched tags:', tagsData);
          setTags(tagsData || []);
        }
        
        // Fetch all courses with extended information
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select(`
            *,
            category:category_id(id, name)
          `)
          .order('created_at', { ascending: false });
          
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load courses. Please try again.",
          });
        } else {
          console.log('Fetched courses:', coursesData);
          setCourses(coursesData || []);
        }
        
        // Fetch user enrollments to know which courses the user is already enrolled in
        if (user) {
          const { data: enrollmentsData, error: enrollmentsError } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('user_id', user.id);
            
          if (!enrollmentsError && enrollmentsData) {
            const enrolledIds = enrollmentsData.map(enrollment => enrollment.course_id);
            setEnrolledCourseIds(enrolledIds);
          }
        }
      } catch (error) {
        console.error('Exception fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter ? course.level === levelFilter : true;
    const matchesDuration = durationFilter ? course.duration === durationFilter : true;
    const matchesCategory = categoryFilter ? course.category_id === categoryFilter : true;
    
    // Additional tag filtering will be added here when tag data is fully implemented
    
    return matchesSearch && matchesLevel && matchesDuration && matchesCategory;
  });

  const handleCourseClick = (courseId: string) => {
    if (enrolledCourseIds.includes(courseId)) {
      navigate(`/student/classroom/${courseId}`);
    } else {
      navigate(`/student/course/${courseId}`);
    }
  };

  const renderCourseCard = (course: Course) => (
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
  );

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
              
              <div className="flex flex-wrap gap-4">
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
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center mr-2">
                  <Tag className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm text-gray-600">Filter by tags:</span>
                </div>
                {tags.slice(0, 7).map(tag => (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    className={`text-xs rounded-full ${
                      selectedTags.includes(tag.id) 
                        ? 'bg-ethiopia-amber/20 border-ethiopia-amber text-ethiopia-earth' 
                        : 'bg-gray-50'
                    }`}
                    onClick={() => {
                      if (selectedTags.includes(tag.id)) {
                        setSelectedTags(selectedTags.filter(id => id !== tag.id));
                      } else {
                        setSelectedTags([...selectedTags, tag.id]);
                      }
                    }}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* View Switcher */}
          <div className="mb-6 flex justify-end">
            <Tabs defaultValue="grid" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              {activeTab === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => renderCourseCard(course))}
                </div>
              ) : (
                <CourseCategories courses={filteredCourses} />
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
              <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No courses found</h3>
              {searchTerm || levelFilter || durationFilter || categoryFilter || selectedTags.length > 0 ? (
                <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
              ) : (
                <p className="text-gray-500 mb-6">There are no courses available at the moment.</p>
              )}
              {(searchTerm || levelFilter || durationFilter || categoryFilter || selectedTags.length > 0) && (
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setLevelFilter('');
                    setDurationFilter('');
                    setCategoryFilter('');
                    setSelectedTags([]);
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
