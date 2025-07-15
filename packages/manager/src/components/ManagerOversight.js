// packages/manager/src/components/ManagerOversight.js
import React, { useState, useEffect } from 'react';
import { ApiService } from '@ivylevel/core';
import AnalyticsDashboard from '@ivylevel/coach/src/components/AnalyticsDashboard';

const ManagerOversight = ({ user }) => {
  const [managerData, setManagerData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadManagerData();
  }, []);

  const loadManagerData = async () => {
    setLoading(true);
    try {
      const apiService = new ApiService();
      const data = await apiService.getManagerOversight(user?.uid);
      setManagerData(data);
    } catch (error) {
      console.error('Failed to load manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createIntervention = async (interventionData) => {
    try {
      const apiService = new ApiService();
      await apiService.createIntervention(user?.uid, interventionData);
      // Refresh data after intervention
      await loadManagerData();
    } catch (error) {
      console.error('Failed to create intervention:', error);
    }
  };

  if (loading) {
    return <div>Loading manager oversight...</div>;
  }

  return (
    <div className="manager-oversight">
      <div className="oversight-header">
        <h1>Manager Oversight Dashboard</h1>
        <p>Monitor coach performance and create targeted interventions</p>
      </div>

      {/* Extended Analytics Dashboard with manager-specific features */}
      <AnalyticsDashboard user={user} enableAlerts={true} />

      {/* Manager-specific interventions section */}
      <div className="interventions-section">
        <h2>Create Interventions</h2>
        <div className="intervention-tools">
          <div className="intervention-card">
            <h3>Performance Alert</h3>
            <p>Send alerts to coaches who need attention</p>
            <button 
              onClick={() => createIntervention({ type: 'performance_alert' })}
              className="intervention-btn"
            >
              Create Alert
            </button>
          </div>

          <div className="intervention-card">
            <h3>Training Assignment</h3>
            <p>Assign specific training modules to coaches</p>
            <button 
              onClick={() => createIntervention({ type: 'training_assignment' })}
              className="intervention-btn"
            >
              Assign Training
            </button>
          </div>

          <div className="intervention-card">
            <h3>Mentor Assignment</h3>
            <p>Connect coaches with mentors for guidance</p>
            <button 
              onClick={() => createIntervention({ type: 'mentor_assignment' })}
              className="intervention-btn"
            >
              Assign Mentor
            </button>
          </div>
        </div>
      </div>

      {/* Recent interventions */}
      <div className="recent-interventions">
        <h2>Recent Interventions</h2>
        <div className="interventions-list">
          {managerData.recentInterventions?.map(intervention => (
            <div key={intervention.id} className="intervention-item">
              <div className="intervention-header">
                <h4>{intervention.type}</h4>
                <span className={`status ${intervention.status}`}>
                  {intervention.status}
                </span>
              </div>
              <p>{intervention.description}</p>
              <div className="intervention-meta">
                <span>Coach: {intervention.coachName}</span>
                <span>Date: {new Date(intervention.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )) || (
            <p>No recent interventions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerOversight; 