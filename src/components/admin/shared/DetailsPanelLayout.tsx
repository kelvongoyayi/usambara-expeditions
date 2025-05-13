import React from 'react';

interface DetailsPanelLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const DetailsPanelLayout: React.FC<DetailsPanelLayoutProps> = ({
  title,
  description,
  children,
  action,
}) => {
  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-0.5 sm:mb-1">{title}</h2>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-2 sm:mt-4">{children}</div>
    </div>
  );
};

export default DetailsPanelLayout;