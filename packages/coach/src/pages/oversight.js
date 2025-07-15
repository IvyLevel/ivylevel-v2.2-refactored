// packages/coach/src/pages/oversight.js
import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const OversightPage = ({ user }) => {
  return (
    <div className="oversight-page">
      <AnalyticsDashboard user={user} enableAlerts={true} />
    </div>
  );
};

export default OversightPage; 