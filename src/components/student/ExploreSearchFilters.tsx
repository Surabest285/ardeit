
import React from 'react';
import { Search, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface CourseTag {
  id: string;
  name: string;
}

interface ExploreSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  levelFilter: string;
  setLevelFilter: (value: string) => void;
  durationFilter: string;
  setDurationFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: Category[];
  tags: CourseTag[];
  selectedTags: string[];
  setSelectedTags: (value: string[]) => void;
}

const ExploreSearchFilters: React.FC<ExploreSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  levelFilter,
  setLevelFilter,
  durationFilter,
  setDurationFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  tags,
  selectedTags,
  setSelectedTags,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="All Levels">All Levels</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Duration</SelectItem>
              <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
              <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
              <SelectItem value="1-2 months">1-2 months</SelectItem>
              <SelectItem value="3+ months">3+ months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="flex items-center mr-2">
            <Tag className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-600">Filter by tags:</span>
          </div>
          {tags.slice(0, 7).map(tag => (
            <Button
              key={tag.id}
              variant="outline"
              size="sm"
              className={`text-xs rounded-full ${
                selectedTags.includes(tag.id) 
                  ? 'bg-ethiopia-amber/20 border-ethiopia-amber text-ethiopia-earth' 
                  : 'bg-gray-50'
              }`}
              onClick={() => {
                if (selectedTags.includes(tag.id)) {
                  setSelectedTags(selectedTags.filter(id => id !== tag.id));
                } else {
                  setSelectedTags([...selectedTags, tag.id]);
                }
              }}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreSearchFilters;
