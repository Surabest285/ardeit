
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CoursesTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const CoursesTabs: React.FC<CoursesTabsProps> = ({
  activeTab,
  setActiveTab,
  children,
}) => {
  return (
    <Tabs defaultValue="in-progress" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="all">All Courses</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default CoursesTabs;
