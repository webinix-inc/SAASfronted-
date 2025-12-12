import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaEye, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import './TenantList.css';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    plan: 'all',
    search: ''
  });

  useEffect(() => {
    fetchTenants();
  }, [filters]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/saas/tenants`, { params: filters });
      setTenants(response.data.tenants || []);
    } catch (error) {
      toast.error('Error fetching tenants');
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTenantStatus = async (tenantId, currentStatus) => {
    try {
      if (currentStatus === 'active' || currentStatus === 'suspended') {
        // Use subscription service for suspend/reactivate
        if (currentStatus === 'active') {
          await axios.post(`${API_URL}/api/subscriptions/suspend`, { tenantId });
          toast.success('Tenant suspended successfully');
        } else {
          await axios.post(`${API_URL}/api/subscriptions/reactivate`, { tenantId });
          toast.success('Tenant reactivated successfully');
        }
      } else {
        // For trial/expired, use status endpoint
        const newStatus = currentStatus === 'trial' ? 'active' : 'trial';
        await axios.put(`${API_URL}/api/saas/tenants/${tenantId}/status`, { status: newStatus });
        toast.success(`Tenant status updated to ${newStatus}`);
      }
      fetchTenants();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error updating tenant status';
      toast.error(errorMsg);
      console.error('Error updating tenant status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading tenants...</div>;
  }

  return (
    <div className="tenant-list">
      <div className="page-header">
        <div>
          <h1>Tenants</h1>
          <p>Manage all platform tenants</p>
        </div>
        <Link to="/tenants/new" className="btn btn-primary">
          <FaPlus /> Create Tenant
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search tenants..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="trial">Trial</option>
        </select>
        <select
          value={filters.plan}
          onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <div className="tenants-table-container">
        <table className="tenants-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subdomain</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No tenants found
                </td>
              </tr>
            ) : (
              tenants.map(tenant => (
                <tr key={tenant._id}>
                  <td className="tenant-name">{tenant.name}</td>
                  <td>
                    <span className="subdomain">{tenant.subdomain || 'N/A'}</span>
                  </td>
                  <td>
                    <span className={`plan-badge ${tenant.plan || 'free'}`}>
                      {tenant.plan || 'free'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${tenant.status || 'trial'}`}>
                      {tenant.status || 'trial'}
                    </span>
                  </td>
                  <td>{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="actions">
                    <Link to={`/tenants/${tenant._id}`} className="btn-icon" title="View">
                      <FaEye />
                    </Link>
                    <Link to={`/tenants/${tenant._id}/edit`} className="btn-icon" title="Edit">
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => toggleTenantStatus(tenant._id, tenant.status)}
                      className="btn-icon"
                      title={tenant.status === 'active' ? 'Suspend' : 'Activate'}
                    >
                      {tenant.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantList;

