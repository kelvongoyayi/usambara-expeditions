import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { FileText } from 'lucide-react';

const AdminBlog: React.FC = () => {
  const plannedFeatures = [
    "Create and publish blog posts with rich text editing",
    "Manage blog categories and tags",
    "Schedule posts for future publication",
    "Track post views and engagement metrics",
    "Moderate reader comments and interactions",
    "SEO optimization tools for blog content"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Blog Management"
        description="Create, edit, and publish engaging blog content to share travel stories, tips, and updates with your audience."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q2 2024"
        icon={<FileText className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminBlog; 