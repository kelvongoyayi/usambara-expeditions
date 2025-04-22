import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { Map } from 'lucide-react';

const AdminDestinations: React.FC = () => {
  const plannedFeatures = [
    "Create and manage tour destinations",
    "Add detailed location information and coordinates",
    "Upload and manage destination images",
    "Track destination popularity and booking statistics",
    "Categorize destinations by region and type",
    "Add points of interest within destinations"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Destination Management"
        description="Create and manage destinations for your tours and events. Provide rich details about locations to enhance your offerings."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q2 2024"
        icon={<Map className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminDestinations; 