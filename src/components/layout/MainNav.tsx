import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import UsambaraLogo from '../ui/UsambaraLogo';

interface MainNavProps {
  isScrolled: boolean;
  setActiveDropdown: (dropdown: string | null) => void;
  activeDropdown: string | null;
  isMobileMenuOpen: boolean;
  toggleSearch: () => void;
}

const MainNav: React.FC<MainNavProps> = ({ 
  isScrolled, 
  setActiveDropdown, 
  activeDropdown, 
  isMobileMenuOpen
}) => {
  const location = useLocation();
  
  // Helper to determine active state
  const isLinkActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center py-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <UsambaraLogo width={40} height={40} simplified={true} color={isScrolled ? '#056326' : '#ffffff'} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 mx-auto">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isScrolled 
                ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            } ${isLinkActive('/') ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isScrolled 
                ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            } ${isLinkActive('/about') ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
          >
            About
          </Link>
          
          {/* Adventure Tours Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'tours' ? null : 'tours')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                isScrolled 
                  ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              } ${isLinkActive('/tours') || activeDropdown === 'tours' ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
            >
              Tours
              <svg 
                className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'tours' ? 'rotate-180' : ''
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`absolute top-full left-0 mt-1 w-64 transform transition-all duration-200 origin-top-left ${
              activeDropdown === 'tours' 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                <Link 
                  to="/tours/mtb" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  MTB Cycling Tours
                </Link>
                <Link 
                  to="/tours/hiking" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Hiking Tours
                </Link>
                <Link 
                  to="/tours/4x4" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  4x4 Expedition Tours
                </Link>
                <Link 
                  to="/tours/motocamping" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Motocamping Tours
                </Link>
                <Link 
                  to="/tours/school" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  School Tours
                </Link>
              </div>
            </div>
          </div>
          
          {/* Events Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setActiveDropdown(activeDropdown === 'events' ? null : 'events')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                isScrolled 
                  ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              } ${isLinkActive('/events') || activeDropdown === 'events' ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
            >
              Events
              <svg 
                className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === 'events' ? 'rotate-180' : ''
                }`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className={`absolute top-full left-0 mt-1 w-64 transform transition-all duration-200 origin-top-left ${
              activeDropdown === 'events' 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                <Link 
                  to="/events/corporate" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Corporate Events
                </Link>
                <Link 
                  to="/events/4x4" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Usambara 4x4 Expedition
                </Link>
                <Link 
                  to="/events/motocamping" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Usambara ADV Motocamping
                </Link>
                <Link 
                  to="/events/mtb" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Amani Enduro MTB XC
                </Link>
                <Link 
                  to="/events/camping" 
                  className="block px-4 py-2 text-dark-600 hover:text-dark-800 hover:bg-gray-50"
                >
                  Magoroto Camping Festival
                </Link>
              </div>
            </div>
          </div>
          
          <Link 
            to="/destinations" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isScrolled 
                ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            } ${isLinkActive('/destinations') ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
          >
            Destinations
          </Link>
          
          <Link 
            to="/gallery" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isScrolled 
                ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            } ${isLinkActive('/gallery') ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
          >
            Gallery
          </Link>
          
          <Link 
            to="/contact" 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isScrolled 
                ? 'text-dark-600 hover:text-dark-800 hover:bg-gray-100' 
                : 'text-white/90 hover:text-white hover:bg-white/10'
            } ${isLinkActive('/contact') ? isScrolled ? 'bg-gray-100' : 'bg-white/10' : ''}`}
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MainNav;