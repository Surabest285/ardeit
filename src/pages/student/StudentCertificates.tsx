
import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

const StudentCertificates = () => {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">My Certificates</h1>
          <p className="text-lg text-ethiopia-earth">Your earned certificates will appear here.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentCertificates;
