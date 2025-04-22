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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default DetailsPanelLayout;