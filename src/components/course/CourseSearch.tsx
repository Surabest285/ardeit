
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CourseSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Search courses..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default CourseSearch;
