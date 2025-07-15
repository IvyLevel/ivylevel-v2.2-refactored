// packages/parent/src/pages/dashboard.js
import React from 'react';
import ParentTools from '../components/ParentTools';

const ParentDashboardPage = ({ user }) => {
  return (
    <div className="parent-dashboard-page">
      <ParentTools user={user} />
    </div>
  );
};

export default ParentDashboardPage; 