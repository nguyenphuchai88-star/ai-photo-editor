
import React from 'react';
import { Tab } from '../types.ts';

export interface TabNavigationProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = Object.values(Tab);

  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 p-2 rounded-xl glassmorphism mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-300 w-full
            ${activeTab === tab 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
            }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
