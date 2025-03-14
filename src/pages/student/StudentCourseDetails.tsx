
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCourseDetails } from '@/hooks/useCourseDetails';
import CourseHero from '@/components/student/CourseHero';
import CourseLearningOutcomes from '@/components/student/CourseLearningOutcomes';
import CourseContentAccordion from '@/components/student/CourseContentAccordion';
import CourseEnrollmentSidebar from '@/components/student/CourseEnrollmentSidebar';

const StudentCourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const {
    course,
    sections,
    isEnrolled,
    loading,
    enrolling,
    handleEnroll
  } = useCourseDetails(courseId);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-ethiopia-amber" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!course) {
    return (
      <ProtectedRoute allowedRoles={['student']}>
        <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
          <div className="container-custom text-center py-20">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-4">Course Not Found</h1>
            <p className="text-lg text-ethiopia-earth mb-8">The course you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate('/student/explore')} 
              className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
            >
              Browse Courses
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          {/* Course Hero Section */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
            <CourseHero
              title={course.title}
              image={course.image}
              rating={course.rating}
              duration={course.duration}
              lessons={course.lessons}
              level={course.level}
            />
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
              <div className="md:w-2/3">
                <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">About This Course</h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{course.description}</p>
                
                <CourseLearningOutcomes />
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">Course Content</h2>
                  <CourseContentAccordion sections={sections} />
                </div>
              </div>
              
              <div className="md:w-1/3">
                <CourseEnrollmentSidebar
                  courseId={course.id}
                  isEnrolled={isEnrolled}
                  enrolling={enrolling}
                  lessons={course.lessons}
                  duration={course.duration}
                  createdAt={course.created_at}
                  handleEnroll={handleEnroll}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCourseDetails;
