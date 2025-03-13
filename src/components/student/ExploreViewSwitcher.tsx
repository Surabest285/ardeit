
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExploreViewSwitcherProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ExploreViewSwitcher: React.FC<ExploreViewSwitcherProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="mb-6 flex justify-end">
      <Tabs defaultValue="grid" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ExploreViewSwitcher;
