import React, { ReactNode } from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UnderDevelopmentPageProps {
  title: string;
  description?: string;
  plannedFeatures?: string[];
  estimatedRelease?: string;
  icon?: ReactNode;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({
  title,
  description = "This page is currently under development and will be available soon.",
  plannedFeatures = [],
  estimatedRelease,
  icon = <Construction className="w-12 h-12" />
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/admin" 
          className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          
          <div className="p-8 flex flex-col items-center text-center">
            <div className="bg-brand-50 text-brand-600 p-6 rounded-full mb-6">
              {icon}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h2>
            <p className="text-gray-600 max-w-lg mb-8">{description}</p>
            
            {plannedFeatures.length > 0 && (
              <div className="w-full max-w-md mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Planned Features</h3>
                <ul className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {plannedFeatures.map((feature, index) => (
                    <li key={index} className="px-6 py-4 text-left text-gray-700">
                      <div className="flex items-start">
                        <span className="inline-flex items-center justify-center bg-brand-100 h-6 w-6 rounded-full text-brand-800 text-sm font-medium mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{feature}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {estimatedRelease && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 text-amber-800">
                <p className="font-medium">Estimated Release: {estimatedRelease}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopmentPage; 