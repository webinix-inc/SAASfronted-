import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState({
    free: { monthly: 0, yearly: 0 },
    basic: { monthly: 999, yearly: 9999 },
    pro: { monthly: 2999, yearly: 29999 },
    enterprise: { monthly: 9999, yearly: 99999 }
  });
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const planFeatures = {
    free: ['Up to 50 products', 'Basic support', 'Standard templates'],
    basic: ['Up to 500 products', 'Blog module', 'Reviews module', 'Email support', 'Custom domain'],
    pro: ['Unlimited products', 'All modules', 'Workshops module', 'SEO tools', 'Automation', 'Priority support', 'Custom domain'],
    enterprise: ['Unlimited everything', 'All modules', 'AI Chatbot', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Custom domain']
  };

  const handlePriceChange = (plan, cycle, value) => {
    setPlans(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [cycle]: parseFloat(value) || 0
      }
    }));
  };

  const handleSavePlan = async (planName) => {
    setLoading(true);
    try {
      // In a real implementation, you would save to backend
      // For now, we'll just show a success message
      toast.success(`${planName} plan pricing updated successfully`);
      setEditingPlan(null);
    } catch (error) {
      toast.error('Error updating plan pricing');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="plans">
      <div className="page-header">
        <h1>Subscription Plans</h1>
        <p>Manage pricing plans and features</p>
      </div>

      <div className="plans-grid">
        {Object.entries(plans).map(([planName, prices]) => (
          <div key={planName} className="plan-card">
            <div className="plan-header">
              <h2 className="plan-name">{planName.charAt(0).toUpperCase() + planName.slice(1)}</h2>
              {editingPlan === planName ? (
                <div className="plan-pricing-edit">
                  <div className="price-input-group">
                    <label>Monthly (₹)</label>
                    <input
                      type="number"
                      value={prices.monthly}
                      onChange={(e) => handlePriceChange(planName, 'monthly', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="price-input-group">
                    <label>Yearly (₹)</label>
                    <input
                      type="number"
                      value={prices.yearly}
                      onChange={(e) => handlePriceChange(planName, 'yearly', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="plan-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSavePlan(planName)}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingPlan(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="plan-pricing">
                  <div className="price-display">
                    <span className="price-amount">{formatPrice(prices.monthly)}</span>
                    <span className="price-period">/month</span>
                  </div>
                  <div className="price-display">
                    <span className="price-amount">{formatPrice(prices.yearly)}</span>
                    <span className="price-period">/year</span>
                    {prices.yearly > 0 && (
                      <span className="price-savings">
                        (Save {formatPrice((prices.monthly * 12) - prices.yearly)})
                      </span>
                    )}
                  </div>
                  <button
                    className="btn btn-edit"
                    onClick={() => setEditingPlan(planName)}
                  >
                    Edit Pricing
                  </button>
                </div>
              )}
            </div>
            <div className="plan-features">
              <h3>Features</h3>
              <ul>
                {planFeatures[planName].map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
