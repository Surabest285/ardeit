
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Compass } from 'lucide-react';

interface CoursesHeaderProps {
  title: string;
}

const CoursesHeader: React.FC<CoursesHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-serif text-ethiopia-terracotta">{title}</h1>
      <Button 
        onClick={() => navigate('/student/explore')} 
        className="bg-ethiopia-amber text-white hover:bg-ethiopia-amber/90"
      >
        <Compass className="mr-2 h-4 w-4" /> Explore Courses
      </Button>
    </div>
  );
};

export default CoursesHeader;
