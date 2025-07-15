// packages/coach/src/components/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import { ApiService } from '@ivylevel/core';

const AnalyticsDashboard = ({ user, enableAlerts = true }) => {
  const [analytics, setAnalytics] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
    if (enableAlerts) {
      loadAlerts();
    }
  }, [enableAlerts]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const apiService = new ApiService();
      const data = await apiService.getAnalytics(user?.uid);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    try {
      const apiService = new ApiService();
      const alertData = await apiService.get(`/alerts/${user?.uid}`);
      setAlerts(alertData);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      const apiService = new ApiService();
      await apiService.put(`/alerts/${alertId}/dismiss`);
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        {enableAlerts && (
          <div className="alerts-toggle">
            <span>Alerts: {alerts.length}</span>
          </div>
        )}
      </div>

      {/* Alerts Section - Pluggable for CUJ 8 */}
      {enableAlerts && alerts.length > 0 && (
        <div className="alerts-section">
          <h3>Active Alerts</h3>
          <div className="alerts-list">
            {alerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.severity}`}>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                  <span className="alert-time">{new Date(alert.createdAt).toLocaleDateString()}</span>
                </div>
                <button 
                  onClick={() => dismissAlert(alert.id)}
                  className="dismiss-btn"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Students</h3>
          <div className="metric-value">{analytics.studentCount || 0}</div>
          <div className="metric-change">
            {analytics.studentGrowth > 0 ? '+' : ''}{analytics.studentGrowth || 0}% this month
          </div>
        </div>

        <div className="metric-card">
          <h3>Sessions</h3>
          <div className="metric-value">{analytics.sessionCount || 0}</div>
          <div className="metric-change">
            {analytics.sessionGrowth > 0 ? '+' : ''}{analytics.sessionGrowth || 0}% this month
          </div>
        </div>

        <div className="metric-card">
          <h3>Success Rate</h3>
          <div className="metric-value">{analytics.successRate || 0}%</div>
          <div className="metric-change">
            {analytics.successRateChange > 0 ? '+' : ''}{analytics.successRateChange || 0}% change
          </div>
        </div>

        <div className="metric-card">
          <h3>AI Usage</h3>
          <div className="metric-value">{analytics.aiUsageCount || 0}</div>
          <div className="metric-change">
            {analytics.aiUsageGrowth > 0 ? '+' : ''}{analytics.aiUsageGrowth || 0}% this month
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Student Progress Over Time</h3>
          <div className="chart-placeholder">
            Chart visualization would go here
          </div>
        </div>

        <div className="chart-container">
          <h3>Session Completion Rates</h3>
          <div className="chart-placeholder">
            Chart visualization would go here
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {analytics.recentActivity?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <span className="activity-time">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          )) || (
            <p>No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 