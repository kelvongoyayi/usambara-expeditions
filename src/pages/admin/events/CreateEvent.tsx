import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AddEventForm from '../../../components/admin/Events/AddEventForm';

const CreateEvent: React.FC = () => {
  return (
    <AdminLayout>
      <AddEventForm />
    </AdminLayout>
  );
};

export default CreateEvent;