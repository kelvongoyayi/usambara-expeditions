import React, { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, ChevronRight, LayoutDashboard, Map, Users, 
  Calendar, Route, MessageSquare, Image, FileText, Settings, LogOut,
  HelpCircle, BookOpen, Home, Bell, Search, Briefcase
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import DatabaseConnectionIndicator from './DatabaseConnectionIndicator';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Auto-expand submenu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Use a more stable approach to determine which submenu should be active
    for (const item of menuItems) {
      if (item.submenu && currentPath.startsWith(item.path)) {
        // Check if we're on this section or one of its subpages
        if (currentPath === item.path || item.submenu.some(subItem => currentPath === subItem.path)) {
          setActiveSubmenu(item.title.toLowerCase());
          return; // Exit once we've found the correct submenu
        }
      }
    }
    
    // If no matching submenu is found, don't reset it unless we've navigated completely away
    // This prevents flickering when clicking within the same submenu section
    const currentSection = menuItems.find(item => 
      item.submenu && activeSubmenu === item.title.toLowerCase()
    );
    
    // Only reset the activeSubmenu if we're navigating to a completely different section
    if (!currentSection || !currentPath.startsWith(currentSection.path)) {
      setActiveSubmenu(null);
    }
  }, [location.pathname]);

  // If user is not logged in or not an admin, redirect to access denied
  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      setActiveSubmenu(null);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // Improved isLinkActive function to prevent multiple highlights
  const isLinkActive = (path: string, exact = false) => {
    // Exact match for root admin path
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    
    // For exact matches (used by submenu items), only return true if the path exactly matches
    if (exact) {
      return location.pathname === path;
    }
    
    // For parent items (that have submenus), we need special handling
    const parentItem = menuItems.find(item => item.path === path && item.submenu);
    if (parentItem && parentItem.submenu) {
      // If we're on a submenu page, don't highlight the parent
      const isOnSubmenuPage = parentItem.submenu.some(subItem => location.pathname === subItem.path);
      if (isOnSubmenuPage) {
        return false;
      }
      
      // Only highlight the parent if we're exactly on its path
      return location.pathname === path;
    }
    
    // For regular items without submenus
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      const remainingPath = location.pathname.slice(path.length);
      return remainingPath === '' || remainingPath.startsWith('/');
    }
    
    return false;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin',
      exact: true
    },
    {
      title: 'Tours',
      icon: <Route className="w-5 h-5" />,
      path: '/admin/tours',
      submenu: [
        { title: 'All Tours', path: '/admin/tours' },
        { title: 'Add New Tour', path: '/admin/tours/create' },
        { title: 'Categories', path: '/admin/tours/categories' }
      ]
    },
    {
      title: 'Events',
      icon: <Calendar className="w-5 h-5" />,
      path: '/admin/events',
      submenu: [
        { title: 'All Events', path: '/admin/events' },
        { title: 'Add New Event', path: '/admin/events/create' },
        { title: 'Event Types', path: '/admin/events/types' }
      ]
    },
    {
      title: 'Bookings',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/admin/bookings'
    },
    {
      title: 'Destinations',
      icon: <Map className="w-5 h-5" />,
      path: '/admin/destinations'
    },
    {
      title: 'Users',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users'
    },
    {
      title: 'Media',
      icon: <Image className="w-5 h-5" />,
      path: '/admin/media'
    },
    {
      title: 'Blog',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/blog',
      submenu: [
        { title: 'All Posts', path: '/admin/blog' },
        { title: 'Add New Post', path: '/admin/blog/create' },
        { title: 'Categories', path: '/admin/blog/categories' }
      ]
    },
    {
      title: 'Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/admin/messages'
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings'
    },
    {
      title: 'Help',
      icon: <HelpCircle className="w-5 h-5" />,
      path: '/admin/help'
    }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 bg-brand-800 text-white transition-all duration-300 transform ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
        } shadow-xl md:relative`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-brand-700">
          <div className={`flex items-center space-x-3 ${!sidebarOpen && 'md:hidden'}`}>
            <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white text-lg">UE</span>
            </div>
            <span className="font-semibold text-white text-lg">Admin</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-thin scrollbar-thumb-brand-700 scrollbar-track-transparent">
          <nav className="mt-5 px-2">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index} className="mb-1">
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title.toLowerCase())}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                          isLinkActive(item.path) 
                            ? 'bg-brand-700 text-white font-medium' 
                            : 'text-brand-200 hover:bg-brand-700 hover:text-white'
                        } ${sidebarOpen ? 'text-left' : 'justify-center'}`}
                      >
                        <div className="flex items-center">
                          <span className="mr-3">{item.icon}</span>
                          {sidebarOpen && <span className="text-sm">{item.title}</span>}
                        </div>
                        {sidebarOpen && (
                          activeSubmenu === item.title.toLowerCase() ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      
                      {/* Submenu */}
                      {sidebarOpen && activeSubmenu === item.title.toLowerCase() && (
                        <ul className="pl-9 mt-1 space-y-1">
                          {item.submenu.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.path}
                                className={`block px-3 py-2 rounded-lg transition-colors ${
                                  isLinkActive(subItem.path, true) 
                                    ? 'bg-brand-700 text-white font-medium' 
                                    : 'text-brand-200 hover:bg-brand-700 hover:text-white'
                                }`}
                                // Prevent submenu from collapsing during navigation
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Keep the current submenu open
                                  setActiveSubmenu(item.title.toLowerCase());
                                }}
                              >
                                <span className="text-sm">{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                        isLinkActive(item.path) 
                          ? 'bg-brand-700 text-white font-medium' 
                          : 'text-brand-200 hover:bg-brand-700 hover:text-white'
                      } ${!sidebarOpen && 'justify-center'}`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {sidebarOpen && <span className="text-sm">{item.title}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Bottom Section */}
          <div className="mt-6 px-3 py-4 border-t border-brand-700">
            <Link
              to="/"
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors text-brand-200 hover:bg-brand-700 hover:text-white ${!sidebarOpen && 'justify-center'}`}
            >
              <Home className="w-5 h-5 mr-3" />
              {sidebarOpen && <span className="text-sm">Back to Website</span>}
            </Link>
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center px-3 py-2.5 mt-2 rounded-lg transition-colors text-brand-200 hover:bg-brand-700 hover:text-white ${!sidebarOpen && 'justify-center'}`}
            >
              <LogOut className="w-5 h-5 mr-3" />
              {sidebarOpen && <span className="text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <AdminHeader />
          <div className="md:hidden flex items-center px-4 py-2 border-t border-gray-200">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="ml-4 font-semibold text-gray-800">Menu</div>
          </div>
        </header>
        
        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-brand-800 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between h-16 px-4 border-b border-brand-700">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white text-lg">UE</span>
                  </div>
                  <span className="font-semibold text-white text-lg">Admin</span>
                </div>
                <button onClick={toggleMobileMenu} className="text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto h-full pb-16">
                <nav className="mt-5 px-2">
                  <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                      <li key={index} className="mb-1">
                        {item.submenu ? (
                          <div>
                            <button
                              onClick={() => toggleSubmenu(item.title.toLowerCase())}
                              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                                isLinkActive(item.path) 
                                  ? 'bg-brand-700 text-white font-medium' 
                                  : 'text-brand-200 hover:bg-brand-700 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="mr-3">{item.icon}</span>
                                <span>{item.title}</span>
                              </div>
                              {activeSubmenu === item.title.toLowerCase() ? 
                                <ChevronDown className="w-4 h-4" /> : 
                                <ChevronRight className="w-4 h-4" />
                              }
                            </button>
                            
                            {activeSubmenu === item.title.toLowerCase() && (
                              <ul className="pl-10 mt-1 space-y-1">
                                {item.submenu.map((subItem, subIndex) => (
                                  <li key={subIndex}>
                                    <Link
                                      to={subItem.path}
                                      onClick={toggleMobileMenu}
                                      className={`block px-3 py-2 rounded-lg transition-colors ${
                                        isLinkActive(subItem.path, true) 
                                          ? 'bg-brand-700 text-white font-medium' 
                                          : 'text-brand-200 hover:bg-brand-700 hover:text-white'
                                      }`}
                                    >
                                      {subItem.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.path}
                            onClick={toggleMobileMenu}
                            className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                              isLinkActive(item.path) 
                                ? 'bg-brand-700 text-white font-medium' 
                                : 'text-brand-200 hover:bg-brand-700 hover:text-white'
                            }`}
                          >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="mt-6 px-3 py-4 border-t border-brand-700">
                  <Link
                    to="/"
                    onClick={toggleMobileMenu}
                    className="flex items-center px-3 py-2.5 rounded-lg transition-colors text-brand-200 hover:bg-brand-700 hover:text-white"
                  >
                    <Home className="w-5 h-5 mr-3" />
                    <span>Back to Website</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-2.5 mt-2 rounded-lg transition-colors text-brand-200 hover:bg-brand-700 hover:text-white"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 min-h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;