import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { Image } from 'lucide-react';

const AdminMedia: React.FC = () => {
  const plannedFeatures = [
    "Upload and manage images, videos, and documents",
    "Organize media with tags and categories",
    "Search and filter media by type, size, and date",
    "Edit image metadata and apply basic transformations",
    "Create and manage galleries for tours and events",
    "Track media usage across the website"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Media Library"
        description="Upload, organize, and manage all your digital assets in one centralized media library."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q3 2024"
        icon={<Image className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminMedia; 