import React from 'react';
import { Check } from 'lucide-react';

interface Feature {
  text: string;
  icon?: React.ReactNode;
}

interface FeatureListProps {
  features: Feature[];
  variant?: 'default' | 'card' | 'compact';
  className?: string;
  iconColor?: string;
}

const FeatureList: React.FC<FeatureListProps> = ({
  features,
  variant = 'default',
  className = '',
  iconColor = 'text-accent-500'
}) => {
  if (variant === 'card') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-start">
            <div className={`bg-accent-500/10 rounded-full p-1 mr-2 mt-0.5 flex-shrink-0`}>
              {feature.icon || <Check className={`w-3 h-3 ${iconColor}`} />}
            </div>
            <span className="text-dark-600">{feature.text}</span>
          </div>
        ))}
      </div>
    );
  }
  
  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-1.5 h-1.5 bg-accent-500 rounded-full mr-2 flex-shrink-0`}></div>
            <span className="text-dark-600 text-sm">{feature.text}</span>
          </div>
        ))}
      </div>
    );
  }
  
  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <div className={`bg-accent-500/10 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0`}>
            {feature.icon || <Check className={`w-3 h-3 ${iconColor}`} />}
          </div>
          <span className="text-dark-600">{feature.text}</span>
        </div>
      ))}
    </div>
  );
};

export default FeatureList;