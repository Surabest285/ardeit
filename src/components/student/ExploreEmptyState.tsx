
import React from 'react';
import { Button } from '@/components/ui/button';

interface ExploreEmptyStateProps {
  searchTerm: string;
  levelFilter: string;
  durationFilter: string;
  categoryFilter: string;
  selectedTags: string[];
  clearFilters: () => void;
}

const ExploreEmptyState: React.FC<ExploreEmptyStateProps> = ({
  searchTerm,
  levelFilter,
  durationFilter,
  categoryFilter,
  selectedTags,
  clearFilters,
}) => {
  const hasFilters = searchTerm || levelFilter || durationFilter || categoryFilter || selectedTags.length > 0;
  
  return (
    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-ethiopia-sand/30">
      <h3 className="text-xl font-medium text-ethiopia-earth mb-4">No courses found</h3>
      {hasFilters ? (
        <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
      ) : (
        <p className="text-gray-500 mb-6">There are no courses available at the moment.</p>
      )}
      {hasFilters && (
        <Button 
          onClick={clearFilters} 
          variant="outline"
          className="border-ethiopia-amber text-ethiopia-earth hover:bg-ethiopia-amber hover:text-white"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default ExploreEmptyState;
