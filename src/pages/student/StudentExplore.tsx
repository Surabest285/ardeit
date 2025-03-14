
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import CourseCategories from '@/components/CourseCategories';
import ExploreSearchFilters from '@/components/student/ExploreSearchFilters';
import ExploreViewSwitcher from '@/components/student/ExploreViewSwitcher';
import ExploreCoursesGrid from '@/components/student/ExploreCoursesGrid';
import ExploreEmptyState from '@/components/student/ExploreEmptyState';
import { useExploreCourses } from '@/hooks/useExploreCourses';

const StudentExplore = () => {
  const { courses, enrolledCourseIds, loading, categories, tags } = useExploreCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('grid');
  
  const filteredCourses = courses.filter(course => {
    // Improved search logic to better match course titles
    const matchesSearch = searchTerm === '' || 
                        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        course.description.toLowerCase().includes(searchTerm.toLowerCase());
                        
    const matchesLevel = levelFilter === 'all' ? true : course.level === levelFilter;
    const matchesDuration = durationFilter === 'all' ? true : course.duration === durationFilter;
    const matchesCategory = categoryFilter === 'all' ? true : course.category_id === categoryFilter;
    
    // Filter by selected tags
    const matchesTags = selectedTags.length === 0 ? true : 
      (course.tags && course.tags.some(tag => selectedTags.includes(tag.id)));
    
    return matchesSearch && matchesLevel && matchesDuration && matchesCategory && matchesTags;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setLevelFilter('all');
    setDurationFilter('all');
    setCategoryFilter('all');
    setSelectedTags([]);
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">Explore Courses</h1>
          
          <ExploreSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
            tags={tags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />

          <ExploreViewSwitcher
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
            </div>
          ) : filteredCourses.length > 0 ? (
            <>
              {activeTab === 'grid' ? (
                <ExploreCoursesGrid 
                  courses={filteredCourses} 
                  enrolledCourseIds={enrolledCourseIds} 
                />
              ) : (
                <CourseCategories courses={filteredCourses} />
              )}
            </>
          ) : (
            <ExploreEmptyState
              searchTerm={searchTerm}
              levelFilter={levelFilter}
              durationFilter={durationFilter}
              categoryFilter={categoryFilter}
              selectedTags={selectedTags}
              clearFilters={clearFilters}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentExplore;
