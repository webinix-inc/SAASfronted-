import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import './SaaSAdminLayout.css';

const SaaSAdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="saas-admin-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SaaSAdminLayout;

