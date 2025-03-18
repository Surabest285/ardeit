
import React from 'react';
import { Check } from 'lucide-react';

interface CourseLearningOutcomesProps {
  outcomes?: string[];
}

const CourseLearningOutcomes: React.FC<CourseLearningOutcomesProps> = ({ 
  outcomes = [
    "Master the fundamentals of Ethiopian music",
    "Learn traditional instrument techniques",
    "Understand the cultural significance",
    "Practice with authentic compositions"
  ] 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-ethiopia-earth mb-4">What You'll Learn</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {outcomes.map((outcome, index) => (
          <div key={index} className="flex gap-2 items-start">
            <Check className="h-5 w-5 text-ethiopia-amber mt-0.5" />
            <span>{outcome}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseLearningOutcomes;
