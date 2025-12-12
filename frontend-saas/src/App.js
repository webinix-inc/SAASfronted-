import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import SaaSAdminLayout from './components/Layout/SaaSAdminLayout';
import Login from './components/Auth/Login';

// Dashboard
import SaaSDashboard from './components/Dashboard/SaaSDashboard';

// Tenants
import TenantList from './components/Tenants/TenantList';
import TenantDetail from './components/Tenants/TenantDetail';
import TenantCreate from './components/Tenants/TenantCreate';
import TenantEdit from './components/Tenants/TenantEdit';

// Modules
import ModuleRegistry from './components/Modules/ModuleRegistry';
import ModuleUsage from './components/Modules/ModuleUsage';

// Analytics
import PlatformAnalytics from './components/Analytics/PlatformAnalytics';

// Billing
import Plans from './components/Billing/Plans';
import Subscriptions from './components/Billing/Subscriptions';

// Settings
import PlatformSettings from './components/Settings/PlatformSettings';

import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Only super admin can access
  if (!isAuthenticated || user?.role !== 'superadmin') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <SaaSAdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<SaaSDashboard />} />
              
              {/* Tenants Management */}
              <Route path="tenants" element={<TenantList />} />
              <Route path="tenants/new" element={<TenantCreate />} />
              <Route path="tenants/:id" element={<TenantDetail />} />
              <Route path="tenants/:id/edit" element={<TenantEdit />} />
              
              {/* Modules Management */}
              <Route path="modules" element={<ModuleRegistry />} />
              <Route path="modules/usage" element={<ModuleUsage />} />
              
              {/* Analytics */}
              <Route path="analytics" element={<PlatformAnalytics />} />
              
              {/* Billing */}
              <Route path="billing" element={<Navigate to="/billing/plans" replace />} />
              <Route path="billing/plans" element={<Plans />} />
              <Route path="billing/subscriptions" element={<Subscriptions />} />
              
              {/* Settings */}
              <Route path="settings" element={<PlatformSettings />} />
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

