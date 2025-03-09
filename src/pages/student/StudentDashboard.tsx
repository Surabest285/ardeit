
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, Award, Compass } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const StudentDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <h1 className="text-3xl font-serif text-ethiopia-terracotta mb-8">Student Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-ethiopia-amber" />
                  <span>My Courses</span>
                </CardTitle>
                <CardDescription>Course progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">0</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber" 
                  onClick={() => navigate('/student/courses')}
                >
                  View Courses
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-ethiopia-amber" />
                  <span>Learning</span>
                </CardTitle>
                <CardDescription>Hours spent learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">0</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber"
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-ethiopia-amber" />
                  <span>Certificates</span>
                </CardTitle>
                <CardDescription>Earned certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">0</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber"
                  onClick={() => navigate('/student/certificates')}
                >
                  View Certificates
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Compass className="h-5 w-5 text-ethiopia-amber" />
                  <span>Explore</span>
                </CardTitle>
                <CardDescription>Discover new courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">10+</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber"
                  onClick={() => navigate('/student/explore')}
                >
                  Explore Now
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent learning activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activities yet.</p>
                <p>Start learning to see your progress here!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default StudentDashboard;
