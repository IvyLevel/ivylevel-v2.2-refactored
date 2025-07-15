// packages/coach/src/pages/onboarding.js
import React from 'react';
import CoachWelcome from '../components/CoachWelcome';

const OnboardingPage = ({ user }) => {
  return (
    <div className="onboarding-page">
      <CoachWelcome user={user} />
    </div>
  );
};

export default OnboardingPage; 