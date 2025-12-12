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

  // Get base frontend URL from environment or use default
  const getBaseFrontendUrl = () => {
    // In production, this should come from backend config or env
    // For now, we'll use a placeholder that backend will replace
    return process.env.REACT_APP_USER_FRONTEND_URL || 'https://e-commerce-user-sage.vercel.app';
  };

  // Generate path-based frontend URL
  // Handles localhost with and without ports
  const generatePathBasedUrl = (subdomain) => {
    if (!subdomain) return '';
    
    try {
      const baseUrl = getBaseFrontendUrl();
      // Parse the URL to handle ports properly
      const url = new URL(baseUrl);
      
      // Remove trailing slash from pathname if present
      const pathname = url.pathname.replace(/\/$/, '');
      
      // Reconstruct URL with subdomain path
      // Preserve protocol, hostname, and port (if present)
      const port = url.port ? `:${url.port}` : '';
      const fullBaseUrl = `${url.protocol}//${url.hostname}${port}${pathname}`;
      
      // Generate path-based URL
      return `${fullBaseUrl}/${subdomain}`;
    } catch (error) {
      // If URL parsing fails, fallback to simple string concatenation
      const baseUrl = getBaseFrontendUrl().replace(/\/$/, '');
      return `${baseUrl}/${subdomain}`;
    }
  };

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
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    
    // Auto-generate path-based frontendUrl when subdomain changes (if no custom domain)
    if (e.target.name === 'subdomain') {
      const newSubdomain = e.target.value.trim();
      if (newSubdomain && !formData.customDomain) {
        newFormData.frontendUrl = generatePathBasedUrl(newSubdomain);
      } else if (!newSubdomain) {
        newFormData.frontendUrl = '';
      }
    }
    
    // Clear frontendUrl if custom domain is set (will be handled by backend)
    if (e.target.name === 'customDomain' && e.target.value) {
      newFormData.frontendUrl = '';
    }
    
    // Regenerate path-based URL if custom domain is cleared
    if (e.target.name === 'customDomain' && !e.target.value && formData.subdomain) {
      newFormData.frontendUrl = generatePathBasedUrl(formData.subdomain);
    }
    
    setFormData(newFormData);
  };
  
  // Auto-generate frontendUrl after fetching tenant if it's missing
  useEffect(() => {
    if (!fetching && formData.subdomain && !formData.customDomain && !formData.frontendUrl) {
      const generatedUrl = generatePathBasedUrl(formData.subdomain);
      if (generatedUrl) {
        setFormData(prev => ({ ...prev, frontendUrl: generatedUrl }));
      }
    }
  }, [fetching, formData.subdomain, formData.customDomain, formData.frontendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare form data - don't send frontendUrl if it's empty or just base URL
      // Let backend auto-generate it
      const submitData = { ...formData };
      
      // If frontendUrl is empty or matches base URL without subdomain, don't send it
      const baseUrl = getBaseFrontendUrl().replace(/\/$/, '');
      if (!submitData.frontendUrl || 
          submitData.frontendUrl.trim() === '' || 
          submitData.frontendUrl.trim() === baseUrl) {
        delete submitData.frontendUrl; // Let backend auto-generate
      }
      
      // Don't send empty customDomain
      if (!submitData.customDomain || submitData.customDomain.trim() === '') {
        submitData.customDomain = '';
      }
      
      await axios.put(`${API_URL}/api/saas/tenants/${id}`, submitData);
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
                placeholder={`${getBaseFrontendUrl()}/tenant-name`}
              />
              <small className="form-hint">
                {formData.customDomain 
                  ? 'Custom domain URL (e.g., https://acme.com). Leave empty if using custom domain.'
                  : `Path-based URL. Auto-generated as: ${getBaseFrontendUrl()}/{subdomain}. You can override this if needed.`
                }
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
