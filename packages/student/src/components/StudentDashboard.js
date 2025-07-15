// packages/student/src/components/StudentDashboard.js
import React from 'react';
import { useCUJ } from '@ivylevel/core/utils/hooks';  // Reusable from core

const StudentDashboard = ({ user }) => {
  const { status } = useCUJ('student-gameplan');  // Extensible for new CUJs

  return (
    <div>
      <h1>Student Dashboard (Future CUJs)</h1>
      <p>Status: {status}</p>
      {/* Add GamePlan, etc., here as needed */}
    </div>
  );
};

export default StudentDashboard; 