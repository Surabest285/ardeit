
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Award, Grid3X3 } from 'lucide-react';

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
    <TabsList className="mb-6 flex flex-wrap gap-2">
      <TabsTrigger value="all" className="data-[state=active]:bg-ethiopia-amber data-[state=active]:text-white">
        <Grid3X3 className="mr-2 h-4 w-4" />
        All Courses
      </TabsTrigger>
      
      {categories.map(category => (
        <TabsTrigger 
          key={category.id} 
          value={category.id} 
          className="data-[state=active]:bg-ethiopia-amber data-[state=active]:text-white"
        >
          {category.name}
        </TabsTrigger>
      ))}
      
      {levels.map(level => (
        <TabsTrigger 
          key={level} 
          value={`level-${level}`} 
          className="data-[state=active]:bg-ethiopia-amber data-[state=active]:text-white"
        >
          {level}
        </TabsTrigger>
      ))}
      
      <TabsTrigger value="trending" className="data-[state=active]:bg-ethiopia-amber data-[state=active]:text-white">
        <TrendingUp className="mr-2 h-4 w-4" />
        Trending
      </TabsTrigger>
      
      <TabsTrigger value="popular" className="data-[state=active]:bg-ethiopia-amber data-[state=active]:text-white">
        <Award className="mr-2 h-4 w-4" />
        Popular
      </TabsTrigger>
    </TabsList>
  );
};

export default CategoryTabs;
