import React, { useState } from 'react';
import { UserPlus, Database } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DatabaseConnectionIndicator from './DatabaseConnectionIndicator';
import CreateAdminUserModal from './CreateAdminUserModal';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <DatabaseConnectionIndicator />
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={openModal}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Admin User
        </button>
        
        <div className="flex items-center">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-medium">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            {user?.email?.split('@')[0] || 'Admin'}
          </span>
        </div>
      </div>
      
      <CreateAdminUserModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AdminHeader;