import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { Users } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const plannedFeatures = [
    "View and manage all registered users",
    "Filter users by role, sign-up date, and activity",
    "Edit user profiles and contact information",
    "Assign admin privileges and manage permissions",
    "Review user booking history and preferences",
    "Enable/disable user accounts as needed"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="User Management"
        description="Manage your website users, assign roles, and control access to different features of your platform."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q1 2024"
        icon={<Users className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminUsers; 