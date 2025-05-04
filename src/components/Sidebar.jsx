import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

// Import common icons
const DashboardIcon = getIcon('LayoutDashboard');
const ExpensesIcon = getIcon('Receipt');
const ReportsIcon = getIcon('BarChart3');
const SettingsIcon = getIcon('Settings');
const LogoutIcon = getIcon('LogOut');
const MenuIcon = getIcon('Menu');
const CloseIcon = getIcon('X');

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      path: '/', 
      icon: <DashboardIcon />, 
      label: 'Dashboard',
    },
    { 
      path: '/expenses', 
      icon: <ExpensesIcon />, 
      label: 'Expenses',
    },
    { 
      path: '/reports', 
      icon: <ReportsIcon />, 
      label: 'Reports',
    },
    { 
      path: '/settings', 
      icon: <SettingsIcon />, 
      label: 'Settings',
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Common active and inactive styles for menu items
  const baseMenuItemStyles = "flex items-center rounded-md transition-colors duration-200";
  const activeMenuItemStyles = "bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light font-medium";
  const inactiveMenuItemStyles = "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700";

  // Common styles for icons
  const baseIconStyles = "flex-shrink-0 transition-colors duration-200";
  const activeIconStyles = "text-primary dark:text-primary-light";
  const inactiveIconStyles = "text-surface-500 dark:text-surface-400 group-hover:text-surface-700 dark:group-hover:text-surface-300";

  // Desktop sidebar
  const renderDesktopSidebar = () => (
    <div className={`hidden md:flex flex-col h-screen ${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 transition-all duration-300 ease-in-out`}>
      {/* Header/Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200 dark:border-surface-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-primary dark:text-primary-light">SpendSight</h1>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `${baseMenuItemStyles} ${isActive ? activeMenuItemStyles : inactiveMenuItemStyles} ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2'} group`
                }
              >
                <span className={`${baseIconStyles} ${location.pathname === item.path ? activeIconStyles : inactiveIconStyles} w-5 h-5`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer/Logout */}
      <div className="p-2 border-t border-surface-200 dark:border-surface-700">
        <button 
          onClick={onLogout}
          className={`${baseMenuItemStyles} ${inactiveMenuItemStyles} w-full ${isCollapsed ? 'justify-center p-3' : 'px-3 py-2'} group`}
        >
          <span className={`${baseIconStyles} ${inactiveIconStyles} w-5 h-5`}>
            <LogoutIcon />
          </span>
          {!isCollapsed && (
            <span className="ml-3">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  // Mobile sidebar (slide-in menu)
  const renderMobileSidebar = () => (
    <div className="md:hidden">
      {/* Mobile header with menu toggle */}
      <div className="flex items-center justify-between h-12 px-4 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
        <h1 className="text-lg font-bold text-primary dark:text-primary-light">SpendSight</h1>
        <button 
          onClick={toggleMobileMenu}
          className="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
          aria-label="Toggle mobile menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile slide-in menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/30" onClick={toggleMobileMenu}></div>
          <div className="relative flex flex-col w-64 max-w-[80%] h-full bg-white dark:bg-surface-800 shadow-xl">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between h-12 px-4 border-b border-surface-200 dark:border-surface-700">
              <h1 className="text-lg font-bold text-primary dark:text-primary-light">SpendSight</h1>
              <button 
                onClick={toggleMobileMenu}
                className="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu items */}
            <nav className="flex-1 overflow-y-auto">
              <ul className="p-2 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={toggleMobileMenu}
                      className={({ isActive }) => 
                        `${baseMenuItemStyles} ${isActive ? activeMenuItemStyles : inactiveMenuItemStyles} px-3 py-2 group`
                      }
                    >
                      <span className={`${baseIconStyles} ${location.pathname === item.path ? activeIconStyles : inactiveIconStyles} w-5 h-5`}>
                        {item.icon}
                      </span>
                      <span className="ml-3 whitespace-nowrap">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile menu footer */}
            <div className="p-2 border-t border-surface-200 dark:border-surface-700">
              <button 
                onClick={onLogout}
                className={`${baseMenuItemStyles} ${inactiveMenuItemStyles} w-full px-3 py-2 group`}
              >
                <span className={`${baseIconStyles} ${inactiveIconStyles} w-5 h-5`}>
                  <LogoutIcon />
                </span>
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {renderDesktopSidebar()}
      {renderMobileSidebar()}
    </>
  );
};

export default Sidebar;