import React from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../../components/admin/shared/UnderDevelopmentPage';
import { Tags } from 'lucide-react';

const BlogCategories: React.FC = () => {
  const plannedFeatures = [
    "Create and manage blog categories",
    "Organize posts with hierarchical category structure",
    "Bulk category assignment to posts",
    "Category performance analytics",
    "SEO optimization for category pages",
    "Custom category images and descriptions"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Blog Categories"
        description="Organize your blog content with categories to help visitors find relevant information."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q2 2024"
        icon={<Tags className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default BlogCategories; 