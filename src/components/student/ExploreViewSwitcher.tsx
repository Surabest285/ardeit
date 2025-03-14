
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid2X2, List } from 'lucide-react';

interface ExploreViewSwitcherProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ExploreViewSwitcher: React.FC<ExploreViewSwitcherProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="flex justify-end mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
        <TabsList>
          <TabsTrigger value="grid">
            <Grid2X2 className="h-4 w-4 mr-2" /> Grid
          </TabsTrigger>
          <TabsTrigger value="categories">
            <List className="h-4 w-4 mr-2" /> Categories
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ExploreViewSwitcher;
