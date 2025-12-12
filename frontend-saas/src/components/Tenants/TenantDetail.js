import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaBan, FaCheckCircle, FaClock } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import TenantModules from './TenantModules';
import './TenantDetail.css';

const TenantDetail = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchTenant();
  }, [id]);

  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  const fetchTenant = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/saas/tenants/${id}`);
      const tenantData = response.data.tenant;
      console.log('=== TENANT DATA DEBUG ===');
      console.log('Full tenant data:', JSON.stringify(tenantData, null, 2));
      console.log('Tenant settings exists:', !!tenantData.settings);
      console.log('Tenant settings type:', typeof tenantData.settings);
      console.log('Tenant settings value:', tenantData.settings);
      if (tenantData.settings) {
        console.log('Settings keys:', Object.keys(tenantData.settings));
        console.log('Company name:', tenantData.settings.companyName);
        console.log('Email:', tenantData.settings.email);
        console.log('Address:', tenantData.settings.address);
      }
      console.log('========================');
      setTenant(tenantData);
      
      // Fetch subscription status
      try {
        const subResponse = await axios.get(`${API_URL}/api/subscriptions/status/${id}`);
        setSubscriptionStatus(subResponse.data.subscription);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    } catch (error) {
      toast.error('Error fetching tenant details');
      console.error('Error fetching tenant:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!window.confirm('Are you sure you want to suspend this tenant? They will lose access to all features.')) {
      return;
    }

    try {
      setLoadingSubscription(true);
      await axios.post(`${API_URL}/api/subscriptions/suspend`, { tenantId: id });
      toast.success('Tenant suspended successfully');
      fetchTenant();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error suspending tenant';
      toast.error(errorMsg);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setLoadingSubscription(true);
      await axios.post(`${API_URL}/api/subscriptions/reactivate`, { tenantId: id });
      toast.success('Tenant reactivated successfully');
      fetchTenant();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error reactivating tenant';
      toast.error(errorMsg);
    } finally {
      setLoadingSubscription(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading tenant details...</div>;
  }

  if (!tenant) {
    return <div className="error">Tenant not found</div>;
  }

  return (
    <div className="tenant-detail">
      <div className="page-header">
        <div>
          <h1>{tenant.name}</h1>
          <p className="subdomain">{tenant.subdomain ? `${tenant.subdomain}.yoursaas.com` : 'No subdomain'}</p>
        </div>
        <div className="header-actions">
          {tenant.status === 'active' ? (
            <button
              onClick={handleSuspend}
              className="btn btn-warning"
              disabled={loadingSubscription}
            >
              <FaBan /> Suspend
            </button>
          ) : tenant.status === 'suspended' ? (
            <button
              onClick={handleReactivate}
              className="btn btn-success"
              disabled={loadingSubscription}
            >
              <FaCheckCircle /> Reactivate
            </button>
          ) : null}
          <Link to={`/tenants/${id}/edit`} className="btn btn-primary">
            Edit Tenant
          </Link>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'modules' ? 'active' : ''}
          onClick={() => setActiveTab('modules')}
        >
          Modules
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={activeTab === 'billing' ? 'active' : ''}
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="info-grid">
              <div className="info-card">
                <h3>Status</h3>
                <p className={`status ${tenant.status || 'trial'}`}>{tenant.status || 'trial'}</p>
              </div>
              <div className="info-card">
                <h3>Plan</h3>
                <p className={`plan ${tenant.plan || 'free'}`}>{tenant.plan || 'free'}</p>
              </div>
              <div className="info-card">
                <h3>Created</h3>
                <p>{tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="info-card">
                <h3>Owner</h3>
                <p>{tenant.owner?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Tenant Settings - Basic Info */}
            {tenant.settings ? (
              <>
                <div className="info-card full-width settings-section">
                  <h3>Company Information</h3>
                  <div className="settings-grid">
                    {tenant.settings.logo && (
                      <div className="logo-preview">
                        <label>Logo:</label>
                        <img src={tenant.settings.logo} alt="Company Logo" className="company-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                    <div>
                      <label>Company Name:</label>
                      <p>{tenant.settings.companyName || tenant.name || 'N/A'}</p>
                    </div>
                    {tenant.settings.websiteUrl && (
                      <div>
                        <label>Website URL:</label>
                        <p><a href={tenant.settings.websiteUrl} target="_blank" rel="noopener noreferrer">{tenant.settings.websiteUrl}</a></p>
                      </div>
                    )}
                    {!tenant.settings.logo && !tenant.settings.companyName && !tenant.settings.websiteUrl && (
                      <p style={{ color: '#999', fontStyle: 'italic' }}>No company information configured</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                {(tenant.settings.email || tenant.settings.phone || tenant.settings.supportEmail || tenant.settings.whatsappNumber) ? (
                  <div className="info-card full-width settings-section">
                    <h3>Contact Information</h3>
                    <div className="settings-grid">
                      {tenant.settings.email && (
                        <div>
                          <label>Email:</label>
                          <p>{tenant.settings.email}</p>
                        </div>
                      )}
                      {tenant.settings.supportEmail && (
                        <div>
                          <label>Support Email:</label>
                          <p>{tenant.settings.supportEmail}</p>
                        </div>
                      )}
                      {tenant.settings.phone && (
                        <div>
                          <label>Phone:</label>
                          <p>{tenant.settings.phone}</p>
                        </div>
                      )}
                      {tenant.settings.whatsappNumber && (
                        <div>
                          <label>WhatsApp:</label>
                          <p>{tenant.settings.whatsappNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Address Information */}
                {tenant.settings.address ? (
                  <div className="info-card full-width settings-section">
                    <h3>Address</h3>
                    <div className="address-info">
                      {tenant.settings.address.street && <p><strong>Street:</strong> {tenant.settings.address.street}</p>}
                      {tenant.settings.address.city && <p><strong>City:</strong> {tenant.settings.address.city}</p>}
                      {tenant.settings.address.state && <p><strong>State:</strong> {tenant.settings.address.state}</p>}
                      {tenant.settings.address.zipCode && <p><strong>Zip Code:</strong> {tenant.settings.address.zipCode}</p>}
                      {tenant.settings.address.country && <p><strong>Country:</strong> {tenant.settings.address.country}</p>}
                      {!tenant.settings.address.street && !tenant.settings.address.city && !tenant.settings.address.state && (
                        <p>No address information available</p>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Social Media */}
                {tenant.settings.socialMedia && (
                  (tenant.settings.socialMedia.instagram || tenant.settings.socialMedia.facebook || 
                   tenant.settings.socialMedia.twitter || tenant.settings.socialMedia.linkedin) ? (
                    <div className="info-card full-width settings-section">
                      <h3>Social Media</h3>
                      <div className="settings-grid">
                        {tenant.settings.socialMedia.instagram && (
                          <div>
                            <label>Instagram:</label>
                            <p><a href={tenant.settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer">{tenant.settings.socialMedia.instagram}</a></p>
                          </div>
                        )}
                        {tenant.settings.socialMedia.facebook && (
                          <div>
                            <label>Facebook:</label>
                            <p><a href={tenant.settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer">{tenant.settings.socialMedia.facebook}</a></p>
                          </div>
                        )}
                        {tenant.settings.socialMedia.twitter && (
                          <div>
                            <label>Twitter:</label>
                            <p><a href={tenant.settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer">{tenant.settings.socialMedia.twitter}</a></p>
                          </div>
                        )}
                        {tenant.settings.socialMedia.linkedin && (
                          <div>
                            <label>LinkedIn:</label>
                            <p><a href={tenant.settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">{tenant.settings.socialMedia.linkedin}</a></p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </>
            ) : (
              <div className="info-card full-width settings-section">
                <h3>Tenant Settings</h3>
                <p style={{ color: '#999', fontStyle: 'italic' }}>
                  No settings configured yet. Settings will appear here once the tenant admin updates them in the Settings page.
                </p>
                <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                  <strong>Note:</strong> The tenant admin needs to go to Settings → Basic Info and save at least one field for settings to appear here.
                </p>
              </div>
            )}
            
            {/* Debug Info - Remove in production */}
            {process.env.NODE_ENV === 'development' && tenant.settings && (
              <div className="info-card full-width" style={{ backgroundColor: '#f0f0f0', fontSize: '12px', fontFamily: 'monospace' }}>
                <h3>Debug Info (Development Only)</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {JSON.stringify(tenant.settings, null, 2)}
                </pre>
              </div>
            )}

            {tenant.customDomain && (
              <div className="info-card full-width">
                <h3>Custom Domain</h3>
                <p>{tenant.customDomain}</p>
              </div>
            )}
            {tenant.frontendUrl && (
              <div className="info-card full-width">
                <h3>Frontend URL</h3>
                <p>
                  <a 
                    href={tenant.frontendUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="frontend-link"
                  >
                    {tenant.frontendUrl}
                  </a>
                </p>
              </div>
            )}
            {subscriptionStatus && (
              <div className="info-card full-width">
                <h3>Subscription Details</h3>
                <div className="subscription-info">
                  <p><strong>Billing Cycle:</strong> {subscriptionStatus.billingCycle || 'N/A'}</p>
                  {subscriptionStatus.startDate && (
                    <p><strong>Start Date:</strong> {new Date(subscriptionStatus.startDate).toLocaleDateString()}</p>
                  )}
                  {subscriptionStatus.endDate && (
                    <p><strong>End Date:</strong> {new Date(subscriptionStatus.endDate).toLocaleDateString()}</p>
                  )}
                  {subscriptionStatus.daysRemaining !== null && (
                    <p>
                      <strong>Days Remaining:</strong> 
                      <span className={subscriptionStatus.daysRemaining < 7 ? 'warning' : ''}>
                        {subscriptionStatus.daysRemaining} days
                      </span>
                    </p>
                  )}
                  <p><strong>Auto Renew:</strong> {subscriptionStatus.autoRenew ? 'Yes' : 'No'}</p>
                  <p><strong>Payment Status:</strong> {subscriptionStatus.paymentStatus || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'modules' && (
          <TenantModules tenantId={id} />
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <p>Analytics coming soon...</p>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="billing-section">
            <p>Billing information coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDetail;

