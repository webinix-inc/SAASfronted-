import React from 'react';
import { FaUser, FaSignOutAlt, FaBell } from 'react-icons/fa';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="saas-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">Platform Management</h1>
        </div>
        <div className="header-right">
          <button className="header-icon-btn">
            <FaBell />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-menu">
            <div className="user-info">
              <FaUser className="user-icon" />
              <span className="user-name">{user?.username || 'Admin'}</span>
            </div>
            <button onClick={onLogout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

