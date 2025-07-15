// packages/student/src/index.js - Student module entry
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentDashboard from './components/StudentDashboard';

const StudentModule = ({ user }) => {
  return (
    <Routes>
      <Route path="/gameplan" element={<StudentDashboard user={user} />} />
      <Route path="/progress" element={<div>Student Progress (Future CUJ)</div>} />
      <Route path="/assignments" element={<div>Student Assignments (Future CUJ)</div>} />
    </Routes>
  );
};

export default StudentModule; 