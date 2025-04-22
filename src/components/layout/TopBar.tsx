import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserMenu from './UserMenu';

interface TopBarProps {
  isScrolled: boolean;
  isAdminPage: boolean;
  toggleSearch: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isScrolled, isAdminPage, toggleSearch }) => {
  const { isAdmin } = useAuth();

  // Determine text color based on scroll state
  const textColorClass = isScrolled ? 'text-dark-600' : 'text-white/80';
  const hoverTextColorClass = isScrolled ? 'hover:text-dark-800' : 'hover:text-accent-400';
  
  return (
    <div className={`hidden lg:block ${isScrolled ? 'border-b border-gray-200' : 'border-b border-white/10'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Contact Info */}
          <div className="flex items-center space-x-6 text-sm">
            <a 
              href="tel:+255123456789" 
              className={`flex items-center ${textColorClass} ${hoverTextColorClass} transition-colors`}
            >
              <Phone className="w-4 h-4 mr-2" />
              +255 123 456 789
            </a>
            <a 
              href="mailto:info@usambaraexpeditions.com" 
              className={`flex items-center ${textColorClass} ${hoverTextColorClass} transition-colors`}
            >
              <Mail className="w-4 h-4 mr-2" />
              info@usambaraexpeditions.com
            </a>
          </div>
          
          {/* Right Side Links and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={toggleSearch}
              className={`p-1.5 rounded-full transition-colors ${
                isScrolled 
                  ? 'bg-gray-100 hover:bg-gray-200 text-dark-600' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            
            {/* Admin Dashboard Link */}
            {isAdminPage ? (
              <Link 
                to="/"
                className={`py-1.5 px-4 rounded-full text-sm transition-colors flex items-center ${
                  isScrolled 
                    ? 'bg-gray-100 hover:bg-gray-200 text-dark-700'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <span>Back to Website</span>
              </Link>
            ) : isAdmin && (
              <Link 
                to="/admin"
                className={`py-1.5 px-4 rounded-full text-sm transition-colors flex items-center ${
                  isScrolled 
                    ? 'bg-gray-100 hover:bg-gray-200 text-dark-700'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;