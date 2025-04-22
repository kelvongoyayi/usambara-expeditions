import React from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import AddTourForm from '../../../components/admin/Tours/AddTourForm';

const CreateTour: React.FC = () => {
  return (
    <AdminLayout>
      <AddTourForm />
    </AdminLayout>
  );
};

export default CreateTour;