
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

export interface CourseCardProps {
  id?: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  lessons: number;
  rating: number;
  isEnrolled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  features?: Json;
  instructor_info?: Json;
  is_popular?: boolean;
  is_trending?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  image,
  duration,
  level,
  lessons,
  rating,
  isEnrolled = false,
  className = '',
  style,
  children,
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    if (!id) return;
    
    if (isEnrolled) {
      navigate(`/student/classroom/${id}`);
    } else {
      navigate(`/student/course/${id}`);
    }
  };

  return (
    <div 
      className={`overflow-hidden rounded-xl border border-ethiopia-sand/30 bg-white shadow-sm hover:shadow-md transition duration-300 ${className}`}
      style={style}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="mb-2 text-xl font-semibold text-ethiopia-terracotta">{title}</h3>
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-ethiopia-parchment px-2.5 py-0.5 text-xs font-medium text-ethiopia-earth">
            {duration}
          </span>
          <span className="inline-flex items-center rounded-full bg-ethiopia-parchment px-2.5 py-0.5 text-xs font-medium text-ethiopia-earth">
            {level}
          </span>
          <span className="inline-flex items-center rounded-full bg-ethiopia-parchment px-2.5 py-0.5 text-xs font-medium text-ethiopia-earth">
            {lessons} lessons
          </span>
        </div>
        
        {children}
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-ethiopia-amber text-ethiopia-amber" />
            <span className="text-sm font-medium">{rating?.toFixed(1) || "0.0"}</span>
          </div>
          {id ? (
            <Button 
              onClick={handleViewCourse} 
              variant="outline" 
              className="text-sm border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
            >
              {isEnrolled ? 'Continue Learning' : 'View Course'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="text-sm border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
              disabled
            >
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
