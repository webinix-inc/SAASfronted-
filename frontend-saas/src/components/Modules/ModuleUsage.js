import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';
import './ModuleUsage.css';

const ModuleUsage = () => {
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, []);

  const fetchUsageData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/modules/usage`);
      setUsageData(response.data.usage || []);
    } catch (error) {
      toast.error('Error fetching module usage');
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading usage data...</div>;
  }

  return (
    <div className="module-usage">
      <div className="page-header">
        <h1>Module Usage Analytics</h1>
        <p>Track module usage across all tenants</p>
      </div>

      <div className="usage-table-container">
        <table className="usage-table">
          <thead>
            <tr>
              <th>Module</th>
              <th>Category</th>
              <th>Tenants Using</th>
              <th>Total Usage</th>
              <th>Last Used</th>
            </tr>
          </thead>
          <tbody>
            {usageData.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No usage data available</td>
              </tr>
            ) : (
              usageData.map(module => (
                <tr key={module.moduleCode}>
                  <td className="module-name">{module.name}</td>
                  <td>{module.category}</td>
                  <td>{module.tenantCount || 0}</td>
                  <td>{module.totalUsage || 0}</td>
                  <td>{module.lastUsed ? new Date(module.lastUsed).toLocaleDateString() : 'Never'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModuleUsage;

