import React, { useState, useEffect } from 'react';
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
  
  // Auto-generate frontendUrl when component mounts if subdomain exists
  useEffect(() => {
    if (formData.subdomain && !formData.customDomain && !formData.frontendUrl) {
      const generatedUrl = generatePathBasedUrl(formData.subdomain);
      if (generatedUrl) {
        setFormData(prev => ({ ...prev, frontendUrl: generatedUrl }));
      }
    }
  }, []); // Only run on mount

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
      
      const response = await axios.post(`${API_URL}/api/saas/tenants`, submitData);
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
