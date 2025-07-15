// packages/student/src/pages/gameplan.js
import React from 'react';
import StudentDashboard from '../components/StudentDashboard';

const GamePlanPage = ({ user }) => {
  return (
    <div className="gameplan-page">
      <StudentDashboard user={user} />
    </div>
  );
};

export default GamePlanPage; 