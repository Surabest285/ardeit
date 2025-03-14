
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { TabsContent } from '@/components/ui/tabs';
import CoursesHeader from '@/components/student/CoursesHeader';
import CoursesTabs from '@/components/student/CoursesTabs';
import CoursesList from '@/components/student/CoursesList';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';

const StudentCourses = () => {
  const [activeTab, setActiveTab] = useState('in-progress');
  const { 
    loading, 
    enrolledCourses, 
    getInProgressCourses, 
    getCompletedCourses 
  } = useEnrolledCourses();

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <CoursesHeader title="My Courses" />

          <CoursesTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
          >
            <TabsContent value="in-progress">
              <CoursesList
                courses={getInProgressCourses()}
                loading={loading}
                emptyMessage="No courses in progress"
                emptyActionLabel="Find Courses to Enroll"
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <CoursesList
                courses={getCompletedCourses()}
                loading={loading}
                emptyMessage="No completed courses"
              />
            </TabsContent>
            
            <TabsContent value="all">
              <CoursesList
                courses={enrolledCourses}
                loading={loading}
                emptyMessage="No enrolled courses"
                emptyActionLabel="Explore Courses"
              />
            </TabsContent>
          </CoursesTabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCourses;
