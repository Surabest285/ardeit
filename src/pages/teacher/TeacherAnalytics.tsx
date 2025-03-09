
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const TeacherAnalytics = () => {
  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">Analytics</h1>
          <p className="text-lg text-ethiopia-earth">Course and student analytics will appear here.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherAnalytics;
