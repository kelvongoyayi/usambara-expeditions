import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { Settings } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const plannedFeatures = [
    "User profile and password management",
    "System notifications and alerts configuration",
    "Theme and appearance customization",
    "Email templates and communication settings",
    "Security and permission management",
    "Data backup and restoration options"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="System Settings"
        description="Configure your system preferences and account settings to optimize your workflow and security."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q1 2024"
        icon={<Settings className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminSettings; 