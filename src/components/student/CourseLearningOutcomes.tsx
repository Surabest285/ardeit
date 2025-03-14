
import React from 'react';
import { Check } from 'lucide-react';

const CourseLearningOutcomes: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">What You'll Learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex gap-2 items-start">
          <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
          <span>Master the fundamentals of Ethiopian music</span>
        </div>
        <div className="flex gap-2 items-start">
          <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
          <span>Learn traditional instrument techniques</span>
        </div>
        <div className="flex gap-2 items-start">
          <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
          <span>Understand the cultural significance</span>
        </div>
        <div className="flex gap-2 items-start">
          <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
          <span>Practice with authentic compositions</span>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningOutcomes;
