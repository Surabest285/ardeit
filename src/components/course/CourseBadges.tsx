
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Tag } from 'lucide-react';

interface CourseBadgesProps {
  isTrending?: boolean;
  isPopular?: boolean;
  tags?: string[];
}

const CourseBadges: React.FC<CourseBadgesProps> = ({
  isTrending,
  isPopular,
  tags = []
}) => {
  if (!isTrending && !isPopular && tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {isTrending && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-rose-100 text-rose-700">
          <TrendingUp className="h-3 w-3" /> Trending
        </Badge>
      )}
      {isPopular && (
        <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-700">
          <Award className="h-3 w-3" /> Popular
        </Badge>
      )}
      {tags.slice(0, 2).map(tag => (
        <Badge key={tag} variant="outline" className="flex items-center gap-1">
          <Tag className="h-3 w-3" /> {tag}
        </Badge>
      ))}
    </div>
  );
};

export default CourseBadges;
