import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  activeDropdown, 
  setActiveDropdown 
}) => {
  const { user, isAdmin, signOut } = useAuth();
  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMenuOpen(false);
      
      // Use window.location.href to force a full page reload
      window.location.href = '/';
      
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (!isMenuOpen) return null;

  return (
    <div className="lg:hidden fixed inset-x-0 top-[4.5rem] transition-all duration-300 ease-in-out opacity-100 translate-y-0 visible z-50">
      <div className="mx-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
          <nav className="divide-y divide-gray-100">
            <Link 
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
            
            <Link 
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
            >
              About Us
            </Link>
            
            {/* Adventure Tours Dropdown */}
            <div>
              <button 
                className="flex items-center justify-between w-full px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
                onClick={() => toggleDropdown('mobile-tours')}
              >
                <span>Adventure Tours</span>
                {activeDropdown === 'mobile-tours' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {activeDropdown === 'mobile-tours' && (
                <div className="bg-gray-50 px-3 py-2">
                  <Link
                    to="/tours/mtb"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    MTB Cycling Tours
                  </Link>
                  <Link
                    to="/tours/hiking"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Hiking Tours
                  </Link>
                  <Link
                    to="/tours/4x4"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    4x4 Expedition Tours
                  </Link>
                  <Link
                    to="/tours/motocamping"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Motocamping Tours
                  </Link>
                  <Link
                    to="/tours/school"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    School Tours
                  </Link>
                </div>
              )}
            </div>
            
            {/* Events Dropdown */}
            <div>
              <button 
                className="flex items-center justify-between w-full px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
                onClick={() => toggleDropdown('mobile-events')}
              >
                <span>Events</span>
                {activeDropdown === 'mobile-events' ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {activeDropdown === 'mobile-events' && (
                <div className="bg-gray-50 px-3 py-2">
                  <Link
                    to="/events/corporate"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Corporate Events
                  </Link>
                  <Link
                    to="/events/4x4"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Usambara 4x4 Expedition
                  </Link>
                  <Link
                    to="/events/motocamping"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Usambara ADV Motocamping
                  </Link>
                  <Link
                    to="/events/mtb"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Amani Enduro MTB XC
                  </Link>
                  <Link
                    to="/events/camping"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-dark-700 hover:text-brand-600 rounded-lg transition-colors"
                  >
                    Magoroto Camping Festival
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              to="/destinations"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
            >
              Destinations
            </Link>
            
            <Link 
              to="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
            >
              Gallery
            </Link>
            
            <Link 
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center px-6 py-4 text-dark-800 hover:bg-gray-50 transition-colors"
            >
              Contact
            </Link>
          </nav>
          
          {/* Mobile Action Buttons */}
          <div className="p-4 bg-gray-50 flex flex-col space-y-3 w-full">
            {user ? (
              <>
                {isAdmin && (
                  <Link 
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full bg-gray-100 hover:bg-gray-200 text-dark-700 py-3 px-6 rounded-lg transition-colors text-center flex items-center justify-center"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                
              <Link 
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-dark-700 py-3 px-6 rounded-lg transition-colors text-center"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Link>
              
              <Link 
                to="/book"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full bg-brand-600 hover:bg-brand-700 text-white py-3 px-6 rounded-lg transition-colors text-center font-medium shadow-md"
              >
                Book Now
              </Link>
              
              <button
                onClick={handleSignOut}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-red-600 py-3 px-6 rounded-lg transition-colors text-center flex items-center justify-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-dark-700 py-3 px-6 rounded-lg transition-colors text-center"
                >
                  Sign In
                </Link>
                <Link 
                  to="/book"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-brand-600 hover:bg-brand-700 text-white py-3 px-6 rounded-lg transition-colors text-center font-medium shadow-md"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;