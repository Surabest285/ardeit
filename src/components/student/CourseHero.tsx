
import React from 'react';
import { Star, Clock, BookOpen, BarChart } from 'lucide-react';

interface TeacherInfo {
  full_name: string | null;
  avatar_url: string | null;
}

interface CourseHeroProps {
  title: string;
  image: string;
  rating: number;
  duration: string;
  lessons: number;
  level: string;
}

const CourseHero: React.FC<CourseHeroProps> = ({
  title,
  image,
  rating,
  duration,
  lessons,
  level,
}) => {
  return (
    <div className="relative h-64 md:h-80">
      <img 
        src={image || "/placeholder.svg"} 
        alt={title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-6 md:p-8 w-full">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{title}</h1>
          <div className="flex items-center text-white/80 gap-4 flex-wrap">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-ethiopia-amber text-ethiopia-amber" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>{lessons} lessons</span>
            </div>
            <div className="flex items-center">
              <BarChart className="mr-1 h-4 w-4" />
              <span>{level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;
