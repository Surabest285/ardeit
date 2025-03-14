
import React from 'react';
import { Lock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  is_free: boolean;
}

interface Section {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface CourseContentAccordionProps {
  sections: Section[];
}

const CourseContentAccordion: React.FC<CourseContentAccordionProps> = ({ sections }) => {
  if (sections.length === 0) {
    return <p className="text-gray-500 italic">No content available yet for this course.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {sections.map((section, index) => (
        <AccordionItem key={section.id} value={section.id}>
          <AccordionTrigger className="text-ethiopia-earth hover:text-ethiopia-terracotta">
            <div className="text-left">
              <span className="font-medium">Section {index + 1}: {section.title}</span>
              <div className="text-sm text-gray-500 font-normal">
                {section.lessons.length} lessons • {section.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)} min
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-3 pt-2">
              {section.lessons.map((lesson, lessonIndex) => (
                <li key={lesson.id} className="flex items-start justify-between bg-ethiopia-parchment/20 p-3 rounded">
                  <div className="flex items-start gap-3">
                    <div className="bg-ethiopia-parchment rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium text-ethiopia-earth flex-shrink-0 mt-0.5">
                      {lessonIndex + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-ethiopia-earth">{lesson.title}</h4>
                      {lesson.description && (
                        <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ms-4">
                    {lesson.duration && (
                      <span className="text-xs text-gray-500">{lesson.duration} min</span>
                    )}
                    {lesson.is_free ? (
                      <span className="text-xs bg-ethiopia-amber/10 text-ethiopia-amber px-2 py-0.5 rounded">Preview</span>
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-gray-400" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CourseContentAccordion;
