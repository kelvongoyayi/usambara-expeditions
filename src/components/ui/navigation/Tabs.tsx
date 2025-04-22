import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pills' | 'underline' | 'bordered';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className = '',
}) => {
  const getTabClassName = (tab: Tab) => {
    const isActive = tab.id === activeTab;
    
    switch (variant) {
      case 'pills':
        return `py-2 px-4 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
          isActive 
            ? 'bg-accent-500 text-white shadow-lg scale-105' 
            : 'text-dark-700 hover:text-dark-900 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20'
        }`;
      
      case 'underline':
        return `py-2 px-4 text-sm whitespace-nowrap transition-all duration-300 border-b-2 ${
          isActive 
            ? 'text-brand-600 border-brand-600 font-medium' 
            : 'text-dark-500 border-transparent hover:text-dark-700 hover:border-gray-300'
        }`;
      
      case 'bordered':
        return `py-2 px-4 text-sm whitespace-nowrap transition-all duration-300 ${
          isActive 
            ? 'text-brand-700 bg-white border-t border-l border-r border-gray-200 rounded-t-lg font-medium' 
            : 'text-dark-500 hover:text-dark-700 border-b border-gray-200'
        }`;
      
      default:
        return '';
    }
  };

  return (
    <div className={`flex overflow-x-auto scrollbar-hide space-x-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={getTabClassName(tab)}
          onClick={() => onChange(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          <div className="flex items-center">
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default Tabs;