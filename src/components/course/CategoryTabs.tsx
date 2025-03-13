
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, TrendingUp, Award } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CategoryTabsProps {
  categories: Category[];
  levels: string[];
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, levels }) => {
  return (
    <TabsList className="mb-6 flex-wrap">
      <TabsTrigger value="all">All Courses</TabsTrigger>
      
      {categories.map(category => (
        <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
          {category.icon === 'music-note' && <BookOpen className="h-4 w-4" />}
          {category.icon === 'instrument' && <BookOpen className="h-4 w-4" />}
          {category.icon === 'book-open' && <BookOpen className="h-4 w-4" />}
          {category.icon === 'landmark' && <BookOpen className="h-4 w-4" />}
          {category.name}
        </TabsTrigger>
      ))}
      
      {levels.map(level => (
        <TabsTrigger key={level} value={`level-${level}`}>{level}</TabsTrigger>
      ))}
      
      <TabsTrigger value="trending" className="flex items-center gap-1">
        <TrendingUp className="h-4 w-4" /> Trending
      </TabsTrigger>
      
      <TabsTrigger value="popular" className="flex items-center gap-1">
        <Award className="h-4 w-4" /> Popular
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
