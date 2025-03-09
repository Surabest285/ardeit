
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const StudentCourses = () => {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">My Courses</h1>
          <p className="text-lg text-ethiopia-earth">Your enrolled courses will appear here.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCourses;
