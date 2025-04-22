import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import UnderDevelopmentPage from '../../../components/admin/shared/UnderDevelopmentPage';
import { LineChart } from 'lucide-react';

const AdminAnalytics: React.FC = () => {
  const plannedFeatures = [
    "Dashboard with key performance metrics",
    "Booking and revenue analytics with customizable date ranges",
    "Customer demographics and behavioral insights",
    "Popular tours and events analysis",
    "Trend identification and forecasting tools",
    "Exportable reports for stakeholder meetings"
  ];

  return (
    <AdminLayout>
      <UnderDevelopmentPage
        title="Analytics Dashboard"
        description="Gain valuable insights into your business performance with comprehensive analytics and reporting tools."
        plannedFeatures={plannedFeatures}
        estimatedRelease="Q4 2023"
        icon={<LineChart className="w-12 h-12" />}
      />
    </AdminLayout>
  );
};

export default AdminAnalytics; 