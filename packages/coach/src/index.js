// packages/coach/src/index.js - Coach Module Entry Point
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import existing components
import AdminProvisioning from './components/AdminProvisioning';
import CoachWelcome from './components/CoachWelcome';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ModernKnowledgeBase from './components/ModernKnowledgeBase';

// Import pages
import OnboardingPage from './pages/onboarding';
import SkillBuildingPage from './pages/skill-building';
import OversightPage from './pages/oversight';
import KnowledgeBasePage from './pages/knowledge-base';

const CoachModule = ({ user }) => {
  return (
    <Routes>
      {/* Core Coach Routes */}
      <Route path="/" element={<CoachWelcome user={user} />} />
      <Route path="/welcome" element={<CoachWelcome user={user} />} />
      <Route path="/admin" element={<AdminProvisioning user={user} />} />
      <Route path="/analytics" element={<AnalyticsDashboard user={user} />} />
      <Route path="/kb" element={<ModernKnowledgeBase user={user} />} />
      
      {/* Page Routes */}
      <Route path="/onboarding" element={<OnboardingPage user={user} />} />
      <Route path="/skill-building" element={<SkillBuildingPage user={user} />} />
      <Route path="/oversight" element={<OversightPage user={user} />} />
      <Route path="/knowledge-base" element={<KnowledgeBasePage user={user} />} />
      
      {/* Fallback */}
      <Route path="*" element={<CoachWelcome user={user} />} />
    </Routes>
  );
};

export default CoachModule; 