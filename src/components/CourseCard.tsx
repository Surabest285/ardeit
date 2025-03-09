
import { useState } from 'react';
import { Clock, BookOpen, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  lessons: number;
  rating: number;
  className?: string;
}

const CourseCard = ({ 
  title, 
  description, 
  image, 
  duration, 
  level, 
  lessons, 
  rating,
  className
}: CourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-soft transition-all duration-300",
        isHovered && "shadow-md translate-y-[-5px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={cn(
            "w-full h-full object-cover transition-transform duration-700",
            isHovered && "scale-105"
          )}
        />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
          {level}
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <h3 className="text-xl font-serif font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-ethiopia-amber text-ethiopia-amber" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="pt-2">
          <a 
            href="#learn-more" 
            className="flex items-center justify-between text-ethiopia-amber font-medium hover:text-ethiopia-terracotta transition-colors"
          >
            <span>Learn more</span>
            <ChevronRight size={16} className={cn(
              "transition-transform duration-300",
              isHovered && "translate-x-1"
            )} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
