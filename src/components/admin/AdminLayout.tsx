import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { 
  X, ChevronRight, LayoutDashboard, Map, Users, 
  Calendar, Route, MessageSquare, Image, FileText, Settings, LogOut,
  HelpCircle, BookOpen, ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminHeader from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);

  // Update sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Reset sidebar state based on new screen size
      setSidebarOpen(!mobile); 
    };
    window.addEventListener('resize', handleResize);
    // Initial check in case the window size is already mobile
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        const menuButton = document.getElementById('mobile-menu-button');
        if (!menuButton || !menuButton.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  // Auto-expand submenu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    let foundActive = false;
    for (const item of menuItems) {
      if (item.submenu && currentPath.startsWith(item.path)) {
        // Only set active if the current path is the parent or a direct child
        if (currentPath === item.path || item.submenu.some(sub => currentPath === sub.path)) {
          setActiveSubmenu(item.title.toLowerCase());
          foundActive = true;
          break;
        }
      }
    }
    // If navigating away from the active section, collapse it
    if (!foundActive && activeSubmenu) {
      const activeParentPath = menuItems.find(i => i.title.toLowerCase() === activeSubmenu)?.path;
      if (!activeParentPath || !currentPath.startsWith(activeParentPath)) {
        setActiveSubmenu(null);
      }
    }
  }, [location.pathname]); // Removed activeSubmenu dependency to prevent potential loops

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
    // Collapse submenu if sidebar is closing
    if (sidebarOpen && activeSubmenu) { 
        setActiveSubmenu(null);
    }
  };

  const toggleSubmenu = (menu: string) => {
    // console.log('Toggling submenu:', menu, 'Current active:', activeSubmenu); // Debugging line
    setActiveSubmenu(prev => (prev === menu ? null : menu));
  };

  const isLinkActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    const isSubmenuItem = menuItems.some(item => item.submenu?.some(sub => sub.path === path));
    if (isSubmenuItem) return location.pathname === path;
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      const parentItem = menuItems.find(item => item.path === path && item.submenu);
      if (parentItem && parentItem.submenu?.some(sub => location.pathname === sub.path)) return false;
      return true;
    }
    return false;
  };
  
  const menuItems = [
    { title: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin' },
    { title: 'Tours', icon: <Route className="w-5 h-5" />, path: '/admin/tours', submenu: [
        { title: 'All Tours', path: '/admin/tours' }, { title: 'Add New Tour', path: '/admin/tours/create' }, { title: 'Categories', path: '/admin/tours/categories' }
    ]},
    { title: 'Events', icon: <Calendar className="w-5 h-5" />, path: '/admin/events', submenu: [
        { title: 'All Events', path: '/admin/events' }, { title: 'Add New Event', path: '/admin/events/create' }, { title: 'Event Types', path: '/admin/events/types' }
    ]},
    { title: 'Bookings', icon: <BookOpen className="w-5 h-5" />, path: '/admin/bookings' },
    { title: 'Destinations', icon: <Map className="w-5 h-5" />, path: '/admin/destinations' },
    { title: 'Users', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
    { title: 'Media', icon: <Image className="w-5 h-5" />, path: '/admin/media' },
    { title: 'Blog', icon: <FileText className="w-5 h-5" />, path: '/admin/blog', submenu: [
        { title: 'All Posts', path: '/admin/blog' }, { title: 'Add New Post', path: '/admin/blog/create' }, { title: 'Categories', path: '/admin/blog/categories' }
    ]},
    { title: 'Messages', icon: <MessageSquare className="w-5 h-5" />, path: '/admin/messages' },
    { title: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
    { title: 'Help', icon: <HelpCircle className="w-5 h-5" />, path: '/admin/help' }
  ];

  const handleSignOut = async () => {
    try { await signOut(); window.location.href = '/'; }
    catch (error) { console.error('Error signing out:', error); }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */} 
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out" onClick={toggleSidebar} aria-hidden="true"></div>
      )}
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef} 
        className={`
          fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-brand-800 to-brand-900 text-white 
          transition-all duration-400 ease-in-out transform shadow-lg /* Increased duration */
          flex flex-col 
          ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
          md:sticky md:translate-x-0 
          md:w-64 /* Always expanded width on desktop */
        `}
      >
        {/* Sidebar Header - Modified to include toggle button */}
        <div className={`flex items-center h-16 px-4 border-b border-brand-700 flex-shrink-0 justify-between`}> 
          {/* Logo and Title Link - Conditionally shown */}
          <Link to="/admin" className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${!sidebarOpen ? 'opacity-0 w-0' : 'opacity-100'}`}> 
             <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0"><span className="font-bold text-white text-lg">UE</span></div>
            <span className="font-semibold text-white text-lg whitespace-nowrap">Admin Panel</span>
          </Link>
          
          {/* Collapsed State Logo (Desktop) - Shown only when collapsed */}
           {!sidebarOpen && !isMobile && (
             <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto"><span className="font-bold text-white text-lg">UE</span></div>
           )}

          {/* Desktop Toggle Button (Moved to Header) */} 
          <button
            onClick={toggleSidebar}
            className={`hidden md:flex items-center justify-center p-2 rounded-md text-brand-300 hover:bg-brand-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-transform duration-300 ease-in-out ${sidebarOpen ? '' : 'rotate-180'}`}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <ChevronLeft className="w-5 h-5" /> 
          </button>

          {/* Mobile Close Button */}
          {isMobile && sidebarOpen && ( 
            <button onClick={toggleSidebar} className="p-2 rounded-md text-brand-300 hover:bg-brand-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-label="Close sidebar"><X className="w-6 h-6" /></button>
          )}
        </div>
        
        {/* Sidebar Menu */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-brand-700 scrollbar-track-brand-800">
          <nav className={`px-3 py-4`}> 
            <ul className="space-y-1.5">
              {menuItems.map((item) => (
                <li key={item.path || item.title}> 
                  {item.submenu ? (
                    <>
                      <button 
                        onClick={() => toggleSubmenu(item.title.toLowerCase())} 
                        className={`
                          w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors duration-150 ease-in-out group 
                          ${isLinkActive(item.path) && !item.submenu.some(sub => location.pathname === sub.path) ? 'bg-brand-700 text-white font-semibold' : 'text-brand-200 hover:bg-brand-700 hover:text-white'}
                        `} 
                        aria-expanded={activeSubmenu === item.title.toLowerCase()}
                      >
                        <div className={`flex items-center space-x-3`}> 
                          <span className={`flex-shrink-0 group-hover:text-white transition-colors duration-150`}>{item.icon}</span> 
                          <span className={`text-sm font-medium`}>{item.title}</span> 
                        </div>
                        <ChevronRight className={`w-5 h-5 transform transition-transform duration-200 ease-in-out ${activeSubmenu === item.title.toLowerCase() ? 'rotate-90' : ''}`} /> 
                      </button>
                      {/* Submenu - Adjusted for collapsed state */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeSubmenu === item.title.toLowerCase() ? 'max-h-[500px] mt-1' : 'max-h-0'}`}> 
                        <ul className="pl-8 pr-2 py-1 space-y-1 border-l border-brand-700 ml-4">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.path}> 
                              <Link 
                                to={subItem.path} 
                                onClick={isMobile ? toggleSidebar : undefined} 
                                className={`
                                  flex items-center px-3 py-2 rounded-md text-sm transition-colors duration-150 ease-in-out group
                                  ${isLinkActive(subItem.path) 
                                    ? 'bg-brand-600 text-white font-medium' /* Changed highlight */ 
                                    : 'text-brand-300 hover:bg-brand-600 hover:text-white'}
                                `}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                     </>
                  ) : (
                     <Link 
                       to={item.path} 
                       onClick={isMobile ? toggleSidebar : undefined} 
                       className={`
                         flex items-center px-3 py-2.5 rounded-md transition-colors duration-150 ease-in-out group 
                         ${isLinkActive(item.path) ? 'bg-brand-700 text-white font-semibold' : 'text-brand-200 hover:bg-brand-700 hover:text-white'}
                       `}
                     >
                       <span className={`flex-shrink-0 group-hover:text-white transition-colors duration-150 mr-3`}>{item.icon}</span> 
                       <span className={`text-sm font-medium`}>{item.title}</span> 
                     </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Sidebar Footer - Removed Toggle Button */}
        <div className={`px-4 py-3 border-t border-brand-700 flex-shrink-0 ${!sidebarOpen && 'md:px-2'}`}> 
          {/* Desktop Toggle Button (REMOVED from here) */}
          {/* 
          <button ...>
             ...
          </button>
          */}
        
          <button onClick={handleSignOut} className={`w-full flex items-center px-3 py-2 rounded-md text-brand-200 hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out group ${!sidebarOpen && 'md:justify-center'}`}> 
             <LogOut className={`w-5 h-5 flex-shrink-0 group-hover:text-white transition-colors duration-150 ${sidebarOpen ? 'mr-3' : 'md:mx-auto'}`} /> 
             <span className={`text-sm font-medium ${!sidebarOpen && 'md:hidden'}`}>Sign Out</span> 
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */} 
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <main 
          key={location.pathname}
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8 animate-fadeIn" 
          id="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;