import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { API_URL } from '../../config/api';
import './TenantModules.css';

const TenantModules = ({ tenantId }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchModules();
  }, [tenantId]);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/modules/tenant/${tenantId}`);
      setModules(response.data.modules || []);
    } catch (error) {
      toast.error('Error fetching modules');
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleCode, currentEnabled) => {
    try {
      const newEnabled = !currentEnabled;
      await axios.post(
        `${API_URL}/api/modules/tenant/${tenantId}/${moduleCode}/toggle`,
        { enabled: newEnabled }
      );
      toast.success(`Module ${newEnabled ? 'enabled' : 'disabled'} successfully`);
      fetchModules();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error toggling module';
      toast.error(errorMsg);
      console.error('Error toggling module:', error);
    }
  };

  // Group modules by category
  const modulesByCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {});

  const filteredCategories = categoryFilter === 'all' 
    ? Object.keys(modulesByCategory)
    : [categoryFilter];

  if (loading) {
    return <div className="loading">Loading modules...</div>;
  }

  return (
    <div className="tenant-modules">
      <div className="modules-header">
        <h2>Module Access Control</h2>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="all">All Categories</option>
          <option value="ecommerce">Ecommerce</option>
          <option value="content">Content</option>
          <option value="marketing">Marketing</option>
          <option value="automation">Automation</option>
          <option value="analytics">Analytics</option>
          <option value="integration">Integration</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="no-modules">No modules found</div>
      ) : (
        filteredCategories.map(category => (
          <div key={category} className="module-category">
            <h3 className="category-title">{category.toUpperCase()}</h3>
            <div className="modules-grid">
              {modulesByCategory[category].map(module => (
                <div
                  key={module.code}
                  className={`module-card ${module.enabled ? 'enabled' : 'disabled'}`}
                >
                  <div className="module-header">
                    <div className="module-info">
                      <h4>{module.name}</h4>
                      <p className="module-description">{module.description || 'No description'}</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={module.enabled || false}
                        onChange={() => toggleModule(module.code, module.enabled)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="module-meta">
                    <span className={`plan-badge ${module.requiredPlan || 'free'}`}>
                      {module.requiredPlan || 'free'}
                    </span>
                    {module.enabled && (
                      <span className="enabled-badge">
                        <FaCheckCircle /> Enabled
                      </span>
                    )}
                    {!module.enabled && (
                      <span className="disabled-badge">
                        <FaTimesCircle /> Disabled
                      </span>
                    )}
                  </div>

                  {module.dependencies && module.dependencies.length > 0 && (
                    <div className="dependencies">
                      <strong>Requires:</strong> {module.dependencies.join(', ')}
                    </div>
                  )}

                  {module.enabledAt && (
                    <div className="module-info-footer">
                      <small>Enabled: {new Date(module.enabledAt).toLocaleDateString()}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TenantModules;

