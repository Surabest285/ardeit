
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Clock, Users, Calendar } from 'lucide-react';

interface CourseEnrollmentSidebarProps {
  courseId: string;
  isEnrolled: boolean;
  enrolling: boolean;
  lessons: number;
  duration: string;
  createdAt: string;
  handleEnroll: () => Promise<void>;
}

const CourseEnrollmentSidebar: React.FC<CourseEnrollmentSidebarProps> = ({
  courseId,
  isEnrolled,
  enrolling,
  lessons,
  duration,
  createdAt,
  handleEnroll,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-ethiopia-parchment/30 rounded-xl p-6 sticky top-24">
      {isEnrolled ? (
        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 text-green-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            You're enrolled in this course
          </div>
          <Button 
            onClick={() => navigate(`/student/classroom/${courseId}`)} 
            className="w-full bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90 mb-4"
          >
            Go to Classroom
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <p className="text-2xl font-bold text-ethiopia-terracotta mb-2">Free</p>
          <p className="text-gray-600 mb-6">Full lifetime access</p>
          <Button 
            onClick={handleEnroll} 
            className="w-full bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90 mb-4"
            disabled={enrolling}
          >
            {enrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enroll Now
          </Button>
        </div>
      )}
      
      <div className="border-t border-ethiopia-sand/30 pt-4 mt-4">
        <h3 className="font-medium text-ethiopia-earth mb-3">This course includes:</h3>
        <ul className="space-y-2">
          <li className="flex items-center text-sm text-gray-700">
            <BookOpen className="mr-2 h-4 w-4 text-ethiopia-amber" />
            {lessons} lessons
          </li>
          <li className="flex items-center text-sm text-gray-700">
            <Clock className="mr-2 h-4 w-4 text-ethiopia-amber" />
            {duration} of content
          </li>
          <li className="flex items-center text-sm text-gray-700">
            <Users className="mr-2 h-4 w-4 text-ethiopia-amber" />
            Access on desktop and mobile
          </li>
          <li className="flex items-center text-sm text-gray-700">
            <Calendar className="mr-2 h-4 w-4 text-ethiopia-amber" />
            <span>Created <time dateTime={createdAt}>{new Date(createdAt).toLocaleDateString()}</time></span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CourseEnrollmentSidebar;
