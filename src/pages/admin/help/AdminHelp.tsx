import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { HelpCircle } from 'lucide-react';

const AdminHelp: React.FC = () => {
  const plannedFeatures = [
    "Comprehensive user guides and documentation",
    "Video tutorials for common admin tasks",
    "Frequently asked questions (FAQ) section",
    "Troubleshooting guides and common solutions",
    "Direct support request submission",
    "System status and maintenance notifications"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Help & Support"
        description="Access helpful resources, guides, and documentation to efficiently manage your website."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q4 2023"
        icon={<HelpCircle className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminHelp; 