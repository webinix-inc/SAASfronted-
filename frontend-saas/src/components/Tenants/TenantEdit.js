import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';
import './TenantEdit.css';

const TenantEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    customDomain: '',
    frontendUrl: '',
    plan: 'free',
    status: 'trial'
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchTenant();
  }, [id]);

  const fetchTenant = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/saas/tenants/${id}`);
      const tenant = response.data.tenant;
      setFormData({
        name: tenant.name || '',
        subdomain: tenant.subdomain || '',
        customDomain: tenant.customDomain || '',
        frontendUrl: tenant.frontendUrl || '',
        plan: tenant.plan || 'free',
        status: tenant.status || 'trial'
      });
    } catch (error) {
      toast.error('Error fetching tenant');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${API_URL}/api/saas/tenants/${id}`, formData);
      toast.success('Tenant updated successfully!');
      navigate(`/tenants/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating tenant');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="loading">Loading tenant data...</div>;
  }

  return (
    <div className="tenant-edit">
      <div className="page-header">
        <h1>Edit Tenant</h1>
        <p>Update tenant information</p>
      </div>

      <form onSubmit={handleSubmit} className="tenant-form">
        <div className="form-section">
          <h2>Tenant Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Tenant Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subdomain">Subdomain *</label>
              <div className="input-with-suffix">
                <input
                  type="text"
                  id="subdomain"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleChange}
                  required
                  pattern="[a-z0-9-]+"
                />
                <span className="input-suffix">.yoursaas.com</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="customDomain">Custom Domain</label>
              <input
                type="text"
                id="customDomain"
                name="customDomain"
                value={formData.customDomain}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="frontendUrl">Frontend URL</label>
              <input
                type="url"
                id="frontendUrl"
                name="frontendUrl"
                value={formData.frontendUrl}
                onChange={handleChange}
                placeholder="http://acme.yoursaas.com or http://localhost:3001"
              />
              <small className="form-hint">
                URL where the tenant's frontend will be accessible. Auto-generated from subdomain if left empty.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="plan">Plan *</label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                required
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="trial">Trial</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/tenants/${id}`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantEdit;

