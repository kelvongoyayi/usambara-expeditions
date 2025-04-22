import React from 'react';
import ArrayItemsEditor from './ArrayItemsEditor';
import DetailsPanelLayout from './DetailsPanelLayout';

interface ArrayCategory {
  title: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder?: string;
  className?: string;
}

interface ArrayItemsManagerProps {
  title: string;
  description?: string;
  items: ArrayCategory[];
}

const ArrayItemsManager: React.FC<ArrayItemsManagerProps> = ({ 
  title,
  description,
  items 
}) => {
  return (
    <DetailsPanelLayout title={title} description={description}>
      <div className="space-y-8">
        {items.map((category, index) => (
          <ArrayItemsEditor
            key={index}
            title={category.title}
            items={category.items}
            onChange={category.onChange}
            onAdd={category.onAdd}
            onRemove={category.onRemove}
            placeholder={category.placeholder}
            className={category.className}
          />
        ))}
      </div>
    </DetailsPanelLayout>
  );
};

export default ArrayItemsManager;