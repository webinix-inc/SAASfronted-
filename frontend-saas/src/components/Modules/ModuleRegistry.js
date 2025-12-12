import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';
import './ModuleRegistry.css';

const ModuleRegistry = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/modules/definitions`);
      setModules(response.data.modules || []);
    } catch (error) {
      toast.error('Error fetching modules');
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading modules...</div>;
  }

  // Group modules by category
  const modulesByCategory = modules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return (
    <div className="module-registry">
      <div className="page-header">
        <h1>Module Registry</h1>
        <p>All available modules in the platform</p>
      </div>

      {Object.entries(modulesByCategory).map(([category, categoryModules]) => (
        <div key={category} className="module-category-section">
          <h2 className="category-title">{category.toUpperCase()}</h2>
          <div className="modules-grid">
            {categoryModules.map(module => (
              <div key={module.code} className="module-card">
                <div className="module-header">
                  <h3>{module.name}</h3>
                  <span className={`plan-badge ${module.requiredPlan}`}>
                    {module.requiredPlan}
                  </span>
                </div>
                <p className="module-description">{module.description || 'No description'}</p>
                <div className="module-details">
                  <div className="detail-item">
                    <strong>Code:</strong> <code>{module.code}</code>
                  </div>
                  {module.dependencies && module.dependencies.length > 0 && (
                    <div className="detail-item">
                      <strong>Dependencies:</strong> {module.dependencies.join(', ')}
                    </div>
                  )}
                  <div className="detail-item">
                    <strong>Default Enabled:</strong> {module.defaultEnabled ? 'Yes' : 'No'}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${module.status}`}>{module.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleRegistry;

