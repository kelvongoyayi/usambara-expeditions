import React, { useState } from 'react';
import { UserPlus, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DatabaseConnectionIndicator from './DatabaseConnectionIndicator';
import CreateAdminUserModal from './CreateAdminUserModal';

// Define props for the header
interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button (Hamburger) */}
        <button
          id="mobile-menu-button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg md:text-xl font-bold text-gray-800 whitespace-nowrap">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
         {/* Subtle DB Indicator - Moved here */} 
        <DatabaseConnectionIndicator />

        {/* Create Admin Buttons */}
        <button
          onClick={openModal}
          className="hidden sm:inline-flex items-center px-3 py-1.5 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        >
          <UserPlus className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden md:inline">Create Admin</span>
        </button>
        <button
          onClick={openModal}
          className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
          aria-label="Create Admin User"
        >
           <UserPlus className="w-5 h-5" />
        </button>
        
        {/* User Profile Area */} 
        <div className="flex items-center">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="hidden md:block ml-2 text-sm font-medium text-gray-700">
            {user?.email?.split('@')[0] || 'Admin'}
          </span>
        </div>
      </div>
      
      <CreateAdminUserModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default AdminHeader;