// packages/manager/src/index.js - Manager module entry
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManagerOversight from './components/ManagerOversight';

const ManagerModule = ({ user }) => {
  return (
    <Routes>
      <Route path="/oversight" element={<ManagerOversight user={user} />} />
      <Route path="/interventions" element={<div>Targeted Actions (Future CUJ)</div>} />
      <Route path="/analytics" element={<div>Manager Analytics (Future CUJ)</div>} />
    </Routes>
  );
};

export default ManagerModule; 