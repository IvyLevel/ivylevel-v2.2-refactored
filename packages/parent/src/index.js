// packages/parent/src/index.js - Parent module entry
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ParentTools from './components/ParentTools';

const ParentModule = ({ user }) => {
  return (
    <Routes>
      <Route path="/dashboard" element={<ParentTools user={user} />} />
      <Route path="/escalations" element={<div>Escalation Summaries (Future CUJ)</div>} />
      <Route path="/progress" element={<div>Progress Views (Future CUJ)</div>} />
    </Routes>
  );
};

export default ParentModule; 