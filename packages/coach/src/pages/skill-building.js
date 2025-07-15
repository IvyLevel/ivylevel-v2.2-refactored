// packages/coach/src/pages/skill-building.js
import React, { useState, useEffect } from 'react';
import { ApiService } from '@ivylevel/core';

const SkillBuildingPage = ({ user }) => {
  const [skills, setSkills] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSkills();
    loadProgress();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const apiService = new ApiService();
      const data = await apiService.get(`/coach/${user?.uid}/skills`);
      setSkills(data);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const apiService = new ApiService();
      const data = await apiService.get(`/coach/${user?.uid}/progress`);
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const updateSkillProgress = async (skillId, newLevel) => {
    try {
      const apiService = new ApiService();
      await apiService.updateCoachSkills(user?.uid, {
        skillId,
        level: newLevel,
        updatedAt: new Date().toISOString(),
      });
      
      // Update local state
      setSkills(prev => 
        prev.map(skill => 
          skill.id === skillId 
            ? { ...skill, level: newLevel }
            : skill
        )
      );
      
      await loadProgress();
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  const getLevelColor = (level) => {
    if (level >= 8) return '#4CAF50'; // Green
    if (level >= 6) return '#FF9800'; // Orange
    if (level >= 4) return '#2196F3'; // Blue
    return '#9E9E9E'; // Gray
  };

  if (loading) {
    return <div>Loading skills...</div>;
  }

  return (
    <div className="skill-building-page">
      <div className="page-header">
        <h1>Skill Building & Gamification</h1>
        <p>Level up your coaching skills through interactive challenges</p>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-card">
          <h3>Overall Progress</h3>
          <div className="progress-circle">
            <div className="progress-value">{progress.overallLevel || 0}</div>
            <div className="progress-label">Level</div>
          </div>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-value">{progress.skillsCompleted || 0}</span>
              <span className="stat-label">Skills Mastered</span>
            </div>
            <div className="stat">
              <span className="stat-value">{progress.challengesWon || 0}</span>
              <span className="stat-label">Challenges Won</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="skills-section">
        <h2>Your Skills</h2>
        <div className="skills-grid">
          {skills.map(skill => (
            <div key={skill.id} className="skill-card">
              <div className="skill-header">
                <h3>{skill.name}</h3>
                <div 
                  className="skill-level"
                  style={{ backgroundColor: getLevelColor(skill.level) }}
                >
                  Level {skill.level}
                </div>
              </div>
              
              <p className="skill-description">{skill.description}</p>
              
              <div className="skill-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(skill.level / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {skill.level}/10
                </span>
              </div>

              <div className="skill-actions">
                {skill.level < 10 && (
                  <button 
                    onClick={() => updateSkillProgress(skill.id, skill.level + 1)}
                    className="level-up-btn"
                  >
                    Level Up
                  </button>
                )}
                <button className="practice-btn">Practice</button>
              </div>

              {skill.challenges && (
                <div className="skill-challenges">
                  <h4>Available Challenges</h4>
                  {skill.challenges.map(challenge => (
                    <div key={challenge.id} className="challenge-item">
                      <span className="challenge-name">{challenge.name}</span>
                      <span className="challenge-reward">+{challenge.reward} XP</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {progress.achievements?.map(achievement => (
            <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="achievement-icon">
                {achievement.unlocked ? '🏆' : '🔒'}
              </div>
              <div className="achievement-content">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                {achievement.unlocked && (
                  <span className="unlock-date">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )) || (
            <p>No achievements yet. Keep practicing to unlock them!</p>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="leaderboard-section">
        <h2>Coach Leaderboard</h2>
        <div className="leaderboard">
          {progress.leaderboard?.map((coach, index) => (
            <div key={coach.id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
              <div className="rank">#{index + 1}</div>
              <div className="coach-info">
                <span className="coach-name">{coach.name}</span>
                <span className="coach-level">Level {coach.level}</span>
              </div>
              <div className="coach-score">{coach.score} XP</div>
            </div>
          )) || (
            <p>Loading leaderboard...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillBuildingPage; 