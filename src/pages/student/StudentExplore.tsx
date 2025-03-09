
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const StudentExplore = () => {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">Explore Courses</h1>
          <p className="text-lg text-ethiopia-earth">Coming soon! Explore new courses and learning opportunities.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentExplore;
