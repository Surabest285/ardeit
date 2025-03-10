
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentExplore from "./pages/student/StudentExplore";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentCourseDetails from "./pages/student/StudentCourseDetails";
import StudentClassroom from "./pages/student/StudentClassroom";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherCreateCourse from "./pages/teacher/TeacherCreateCourse";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherAnnouncements from "./pages/teacher/TeacherAnnouncements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/explore" element={<StudentExplore />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/certificates" element={<StudentCertificates />} />
            <Route path="/student/course/:courseId" element={<StudentCourseDetails />} />
            <Route path="/student/classroom/:courseId" element={<StudentClassroom />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/courses/create" element={<TeacherCreateCourse />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
            <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
