// packages/coach/src/components/CoachWelcome.js
import React, { useState, useEffect } from 'react';
import { usePersona } from '@ivylevel/core';

const CoachWelcome = ({ user }) => {
  const { role } = usePersona(user);
  const [timeline, setTimeline] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    loadOnboardingTimeline();
  }, []);

  const loadOnboardingTimeline = async () => {
    // Extended: Timeline hook integration
    const onboardingSteps = [
      {
        id: 1,
        title: 'Welcome & Orientation',
        description: 'Get familiar with the platform',
        completed: true,
        duration: '1 day'
      },
      {
        id: 2,
        title: 'Profile Setup',
        description: 'Configure your coaching profile',
        completed: false,
        duration: '1 day'
      },
      {
        id: 3,
        title: 'AI Integration Setup',
        description: 'Configure AI assistance features',
        completed: false,
        duration: '2 days'
      },
      {
        id: 4,
        title: 'First Student Assignment',
        description: 'Get your first student to coach',
        completed: false,
        duration: '3 days'
      },
      {
        id: 5,
        title: 'Training Completion',
        description: 'Complete initial training modules',
        completed: false,
        duration: '3 days'
      }
    ];

    setTimeline(onboardingSteps);
  };

  const markStepComplete = (stepId) => {
    setTimeline(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, completed: true }
          : step
      )
    );
  };

  const getProgressPercentage = () => {
    const completedSteps = timeline.filter(step => step.completed).length;
    return Math.round((completedSteps / timeline.length) * 100);
  };

  return (
    <div className="coach-welcome">
      <div className="welcome-header">
        <h1>Welcome, {user?.displayName || 'Coach'}!</h1>
        <p>Role: {role}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
          <span>{getProgressPercentage()}% Complete</span>
        </div>
      </div>

      <div className="onboarding-timeline">
        <h2>Your 10-Day Onboarding Journey</h2>
        {timeline.map((step, index) => (
          <div 
            key={step.id} 
            className={`timeline-step ${step.completed ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
          >
            <div className="step-number">{step.id}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className="duration">Duration: {step.duration}</span>
              {step.completed ? (
                <span className="status completed">✓ Completed</span>
              ) : (
                <button 
                  onClick={() => markStepComplete(step.id)}
                  className="complete-btn"
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="next-actions">
        <h3>What's Next?</h3>
        <div className="action-cards">
          <div className="action-card">
            <h4>Complete Profile</h4>
            <p>Set up your coaching preferences and availability</p>
            <button>Go to Profile</button>
          </div>
          <div className="action-card">
            <h4>AI Training</h4>
            <p>Learn how to use AI assistance in your coaching</p>
            <button>Start Training</button>
          </div>
          <div className="action-card">
            <h4>View Dashboard</h4>
            <p>Explore your coaching dashboard and analytics</p>
            <button>Open Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachWelcome; 