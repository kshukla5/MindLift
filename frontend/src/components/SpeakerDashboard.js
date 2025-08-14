import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSpeakerDashboard } from '../hooks/useSpeakerDashboard';
import SpeakerVideos from './SpeakerVideos';
import './SpeakerDashboard.css';

const SpeakerDashboard = () => {
  const navigate = useNavigate();
  const { isSpeaker, user } = useAuth();
  const { stats, videos, recentActivity, loading, error, refreshing, refreshData } = useSpeakerDashboard();

  if (!isSpeaker) {
    return (
      <div className="speaker-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You must be a speaker to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="speaker-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Speaker Dashboard</h1>
          <p>Welcome back, {user?.name || 'Speaker'}!</p>
        </div>
        <div className="quick-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/speaker/upload')}
          >
            📹 Upload New Video
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/profile')}
          >
            ⚙️ Profile Settings
          </button>
          <button 
            className="btn btn-outline"
            onClick={refreshData}
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={refreshData} className="retry-btn">Try Again</button>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Total Videos"
              value={stats?.total_videos || 0}
              subtitle="All time"
              icon="📹"
              color="blue"
            />
            <StatCard
              title="Published Videos"
              value={stats?.approved_videos || 0}
              subtitle="Live on platform"
              icon="✅"
              color="green"
            />
            <StatCard
              title="Pending Approval"
              value={stats?.pending_videos || 0}
              subtitle="Under review"
              icon="⏳"
              color="orange"
            />
            <StatCard
              title="Approval Rate"
              value={stats?.total_videos > 0 ? `${Math.round((stats?.approved_videos / stats?.total_videos) * 100)}%` : 'N/A'}
              subtitle="Success rate"
              icon="📊"
              color="purple"
            />
            <StatCard
              title="This Week"
              value={stats?.videos_this_week || 0}
              subtitle="Videos uploaded"
              icon="📅"
              color="blue"
            />
            <StatCard
              title="This Month"
              value={stats?.videos_this_month || 0}
              subtitle="Videos uploaded"
              icon="📆"
              color="green"
            />
          </div>

          <div className="dashboard-content">
            <div className="content-section">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <div className="section-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate('/speaker/upload')}
                  >
                    + Add Video
                  </button>
                </div>
              </div>
              <SpeakerVideos />
            </div>

            <div className="tips-section">
              <h3>💡 Tips for Success</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <div>
                    <strong>Clear Titles:</strong> Use descriptive, searchable titles for better discovery
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">📝</span>
                  <div>
                    <strong>Detailed Descriptions:</strong> Include key topics and learning outcomes
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🏷️</span>
                  <div>
                    <strong>Categories:</strong> Choose the most relevant category for your content
                  </div>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🎥</span>
                  <div>
                    <strong>Video Quality:</strong> Ensure good audio and video quality for approval
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpeakerDashboard;
