import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import toast from 'react-hot-toast';

const UserMenu: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      
      // Use window.location.href to force a full page reload
      window.location.href = '/';
      
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // If user is not signed in, show sign in button
  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link 
          to="/book" 
          className="hidden md:inline-flex items-center py-1.5 px-4 rounded-full text-sm font-medium transition-colors bg-brand-600 hover:bg-brand-700 text-white"
        >
          Book Now
        </Link>
        <Link 
          to="/auth/signin" 
          className="py-1.5 px-4 rounded-full text-sm transition-colors bg-white/20 hover:bg-white/30 text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // If user is signed in, show profile dropdown
  return (
    <div className="flex items-center space-x-4" ref={dropdownRef}>
      <Link 
        to="/book" 
        className="hidden md:inline-flex items-center py-1.5 px-4 rounded-full text-sm font-medium transition-colors bg-brand-600 hover:bg-brand-700 text-white"
      >
        Book Now
      </Link>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 py-1.5 px-3 rounded-full text-sm transition-colors bg-white/20 hover:bg-white/30 text-white"
        >
          <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:inline-block">{user.email?.split('@')[0]}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200">
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboard className="w-4 h-4 mr-2 text-gray-500" />
                Admin Dashboard
              </Link>
            )}
            
            <Link
              to="/profile"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User className="w-4 h-4 mr-2 text-gray-500" />
              My Profile
            </Link>
            
            <Link
              to="/settings"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-2 text-gray-500" />
              Settings
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMenu;