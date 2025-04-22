import React from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../../components/admin/shared/UnderDevelopmentPage';
import { PenTool } from 'lucide-react';

const AdminBlogCreate: React.FC = () => {
  const plannedFeatures = [
    "Rich text editor with formatting options",
    "Image and media upload capabilities",
    "Category and tag assignment",
    "SEO optimization tools",
    "Draft saving and preview functionality",
    "Scheduled publishing options"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Create New Blog Post"
        description="Write and publish engaging blog content to share travel stories, tips, and updates with your audience."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q2 2024"
        icon={<PenTool className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminBlogCreate; 