import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaBuilding,
  FaPuzzlePiece,
  FaChartLine,
  FaCreditCard,
  FaCog
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  const menuItems = [
    { path: '/', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/tenants', icon: FaBuilding, label: 'Tenants' },
    { path: '/modules', icon: FaPuzzlePiece, label: 'Modules' },
    { path: '/analytics', icon: FaChartLine, label: 'Analytics' },
    { path: '/billing/plans', icon: FaCreditCard, label: 'Billing' },
    { path: '/settings', icon: FaCog, label: 'Settings' }
  ];

  return (
    <nav className="saas-sidebar">
      <div className="sidebar-header">
        <h2>🚀 SaaS Admin</h2>
        <p>Platform Management</p>
      </div>
      
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={isActive(item.path)}
            >
              <item.icon className="menu-icon" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="sidebar-footer">
        <div className="platform-info">
          <p className="platform-name">SaaS Platform</p>
          <p className="platform-version">v1.0.0</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

