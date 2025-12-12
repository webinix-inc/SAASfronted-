import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../config/api';
import './Subscriptions.css';

const Subscriptions = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [showInvoices, setShowInvoices] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/saas/tenants`);
      setTenants(response.data.data || []);
    } catch (error) {
      toast.error('Error fetching tenants');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async (tenantId) => {
    try {
      const response = await axios.get(`${API_URL}/api/billing/invoices?tenantId=${tenantId}`);
      setInvoices(response.data.data || []);
      setShowInvoices(true);
    } catch (error) {
      toast.error('Error fetching invoices');
      console.error(error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      active: 'badge-success',
      suspended: 'badge-danger',
      expired: 'badge-warning',
      trial: 'badge-info'
    };
    return <span className={`badge ${statusClass[status] || 'badge-secondary'}`}>{status}</span>;
  };

  const getInvoiceStatusBadge = (status) => {
    const statusClass = {
      paid: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      refunded: 'badge-info',
      cancelled: 'badge-secondary'
    };
    return <span className={`badge ${statusClass[status] || 'badge-secondary'}`}>{status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading subscriptions...</div>;
  }

  return (
    <div className="subscriptions">
      <div className="page-header">
        <h1>Subscriptions</h1>
        <p>Manage tenant subscriptions and billing</p>
      </div>

      <div className="subscriptions-content">
        <div className="tenants-list">
          <h2>Tenants</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Plan</th>
                <th>Billing Cycle</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant._id}>
                  <td>{tenant.name}</td>
                  <td>{tenant.plan}</td>
                  <td>{tenant.subscription?.billingCycle || 'N/A'}</td>
                  <td>{getStatusBadge(tenant.status)}</td>
                  <td>{formatDate(tenant.subscription?.startDate)}</td>
                  <td>{formatDate(tenant.subscription?.endDate)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedTenant(tenant);
                        fetchInvoices(tenant._id);
                      }}
                    >
                      View Invoices
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showInvoices && selectedTenant && (
          <div className="invoices-section">
            <h2>Invoices for {selectedTenant.name}</h2>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowInvoices(false);
                setSelectedTenant(null);
              }}
            >
              Close
            </button>
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Period Start</th>
                  <th>Period End</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No invoices found</td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice._id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.plan}</td>
                      <td>{formatCurrency(invoice.total)}</td>
                      <td>{getInvoiceStatusBadge(invoice.status)}</td>
                      <td>{formatDate(invoice.periodStart)}</td>
                      <td>{formatDate(invoice.periodEnd)}</td>
                      <td>{formatDate(invoice.paidAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
