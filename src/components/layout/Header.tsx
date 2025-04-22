import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import TopBar from './TopBar';
import MainNav from './MainNav';
import MobileMenu from './MobileMenu';

const Header: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close only if click is outside header and not on a button that toggles a dropdown
      if (!(event.target as HTMLElement).closest('header') && 
          !(event.target as HTMLElement).closest('button[aria-haspopup="true"]')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white shadow-lg py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      {/* Top Bar with Contact Info */}
      <TopBar isScrolled={isScrolled} isAdminPage={isAdminPage} toggleSearch={toggleSearch} />

      {/* Main Navigation */}
      <MainNav 
        isScrolled={isScrolled}
        setActiveDropdown={setActiveDropdown}
        activeDropdown={activeDropdown}
        isMobileMenuOpen={isMenuOpen}
        toggleSearch={toggleSearch}
      />

      {/* Mobile Menu Button */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-end -mt-12 lg:hidden">
          {/* Mobile Menu Toggle */}
          <button 
            className={`p-2 rounded-full transition-colors ${
              isScrolled 
                ? 'text-dark-800 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
      />

      {/* Search Overlay */}
      <div className={`fixed inset-0 bg-black/95 backdrop-blur-sm transition-all duration-300 z-50 ${
        isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search tours, events, or destinations..."
                className="w-full bg-transparent border-b-2 border-white/20 text-white text-2xl py-4 pr-12 placeholder-white/50 focus:outline-none focus:border-accent-400"
                autoFocus={isSearchOpen}
              />
              <button 
                onClick={toggleSearch}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-8 text-white/60 text-sm">
              Press ESC to close
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;