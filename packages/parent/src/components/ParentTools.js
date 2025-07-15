// packages/parent/src/components/ParentTools.js
import React, { useState, useEffect } from 'react';
import { ApiService } from '@ivylevel/core';

const ParentTools = ({ user }) => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEscalations();
  }, []);

  const loadEscalations = async () => {
    setLoading(true);
    try {
      const apiService = new ApiService();
      const data = await apiService.getEscalationSummaries(user?.uid);
      setEscalations(data);
    } catch (error) {
      console.error('Failed to load escalations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading parent tools...</div>;
  }

  return (
    <div className="parent-tools">
      <div className="tools-header">
        <h1>Parent Tools</h1>
        <p>Monitor your child's progress and access escalation summaries</p>
      </div>

      <div className="escalations-section">
        <h2>Recent Escalations</h2>
        <div className="escalations-list">
          {escalations.length > 0 ? (
            escalations.map(escalation => (
              <div key={escalation.id} className="escalation-card">
                <div className="escalation-header">
                  <h3>{escalation.title}</h3>
                  <span className={`status ${escalation.status}`}>
                    {escalation.status}
                  </span>
                </div>
                <p>{escalation.description}</p>
                <div className="escalation-meta">
                  <span>Date: {new Date(escalation.createdAt).toLocaleDateString()}</span>
                  <span>Coach: {escalation.coachName}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No escalations found</p>
          )}
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn">View Progress Report</button>
          <button className="action-btn">Contact Coach</button>
          <button className="action-btn">Schedule Meeting</button>
        </div>
      </div>
    </div>
  );
};

export default ParentTools; 