import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBuilding, FaUsers, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import './SaaSDashboard.css';

const SaaSDashboard = () => {
  const [stats, setStats] = useState({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/saas/dashboard/stats`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const statCards = [
    {
      title: 'Total Tenants',
      value: stats.totalTenants,
      icon: FaBuilding,
      color: '#667eea',
      change: '+12%'
    },
    {
      title: 'Active Tenants',
      value: stats.activeTenants,
      icon: FaUsers,
      color: '#48bb78',
      change: '+5%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: '#ed8936',
      change: '+8%'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: FaDollarSign,
      color: '#38b2ac',
      change: '+15%'
    }
  ];

  return (
    <div className="saas-dashboard">
      <div className="dashboard-header">
        <h1>Platform Overview</h1>
        <p>Welcome to your SaaS administration panel</p>
      </div>

      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
              <card.icon />
            </div>
            <div className="stat-content">
              <h3>{card.title}</h3>
              <div className="stat-value">{card.value}</div>
              <div className="stat-change positive">{card.change} from last month</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Recent Tenants</h2>
          <p>View and manage all tenants from here</p>
        </div>
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn">Create New Tenant</button>
            <button className="action-btn">View Analytics</button>
            <button className="action-btn">Manage Modules</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSDashboard;

