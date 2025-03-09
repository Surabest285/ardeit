
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, BarChart, Bell, Plus } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

const TeacherDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <ProtectedRoute allowedRoles={['teacher']}>
      <div className="min-h-screen pt-20 pb-12 bg-ethiopia-parchment/30">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-serif text-ethiopia-terracotta">Teacher Dashboard</h1>
            <Button 
              onClick={() => navigate('/teacher/courses/create')} 
              className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Course
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Book className="h-5 w-5 text-ethiopia-amber" />
                  <span>My Courses</span>
                </CardTitle>
                <CardDescription>Courses you've created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">0</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber" 
                  onClick={() => navigate('/teacher/courses')}
                >
                  Manage Courses
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-ethiopia-amber" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>Student engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">0</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber"
                  onClick={() => navigate('/teacher/analytics')}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-ethiopia-amber" />
                  <span>Announcements</span>
                </CardTitle>
                <CardDescription>Messages to students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-ethiopia-earth">0</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-ethiopia-amber"
                  onClick={() => navigate('/teacher/announcements')}
                >
                  Manage Announcements
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Student enrollments and completions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activities yet.</p>
                <p>Create your first course to engage with students!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TeacherDashboard;
