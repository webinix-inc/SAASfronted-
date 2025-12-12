import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';
import './TenantCreate.css';

const TenantCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    customDomain: '',
    frontendUrl: '',
    plan: 'free',
    ownerEmail: '',
    ownerPassword: ''
  });
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post(`${API_URL}/api/saas/tenants`, formData);
      toast.success('Tenant created successfully!');
      navigate(`/tenants/${response.data.tenant._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating tenant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tenant-create">
      <div className="page-header">
        <h1>Create New Tenant</h1>
        <p>Add a new tenant to the platform</p>
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
                placeholder="Acme Corporation"
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
                  placeholder="acme"
                  pattern="[a-z0-9-]+"
                />
                <span className="input-suffix">.yoursaas.com</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="customDomain">Custom Domain (Optional)</label>
              <input
                type="text"
                id="customDomain"
                name="customDomain"
                value={formData.customDomain}
                onChange={handleChange}
                placeholder="acme.com"
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
          </div>
        </div>

        <div className="form-section">
          <h2>Owner Account</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ownerEmail">Owner Email *</label>
              <input
                type="email"
                id="ownerEmail"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                required
                placeholder="owner@acme.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerPassword">Owner Password *</label>
              <input
                type="password"
                id="ownerPassword"
                name="ownerPassword"
                value={formData.ownerPassword}
                onChange={handleChange}
                required
                placeholder="Minimum 6 characters"
                minLength="6"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/tenants')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Tenant'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantCreate;

