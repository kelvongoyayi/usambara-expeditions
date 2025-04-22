import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { MessageSquare } from 'lucide-react';

const AdminMessages: React.FC = () => {
  const plannedFeatures = [
    "View and manage all customer inquiries in one place",
    "Sort and filter messages by status, date, and priority",
    "Respond to customer messages directly from the admin panel",
    "Assign messages to team members for follow-up",
    "Track response times and message resolution metrics"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Message Management"
        description="The Messages Management system will help your team stay on top of customer inquiries and provide timely responses to improve customer satisfaction."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q3 2023"
        icon={<MessageSquare className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminMessages; 