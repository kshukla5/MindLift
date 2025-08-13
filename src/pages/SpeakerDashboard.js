import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SpeakerVideos from '../components/SpeakerVideos';
import useSpeakerDashboard from '../hooks/useSpeakerDashboard';
import { subscribeToSocket } from '../services/socket';
import './SpeakerDashboard.css';

const SpeakerDashboard = () => {
  const navigate = useNavigate();
  const { token, isSpeaker, user, isAuthenticated } = useAuth();
  const { data, loading, error, refresh } = useSpeakerDashboard(token);

  useEffect(() => {
    document.title = 'MindLift - Speaker Dashboard';
  }, []);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (!isSpeaker) {
    return (
      <div className="access-denied">
        <div className="access-denied-container">
          <div className="access-denied-icon">🚫</div>
          <h2>Access Restricted</h2>
          <p>Speaker privileges are required to access this dashboard.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Go to Learner Dashboard
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const unsub = subscribeToSocket((evt) => {
      if (evt && (evt.type === 'video_uploaded' || evt.type === 'video_approved' || evt.type === 'video_deleted')) {
        refresh();
      }
    });
    return () => unsub();
  }, [refresh]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Dashboard</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={refresh}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="speaker-dashboard">
      {/* Welcome Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-container">
          <div className="welcome-content">
            <h1 className="welcome-title">
              Welcome, <span className="text-gradient">{user?.name || 'Speaker'}</span>
            </h1>
            <p className="welcome-subtitle">
              Share your expertise and inspire learners worldwide. Manage your content and track your impact.
            </p>
            <div className="quick-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/speaker/upload')}
              >
                🎥 Upload Video
              </button>
              <button 
                className="btn btn-outline"
                onClick={refresh}
              >
                🔄 Refresh Data
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/profile')}
              >
                ⚙️ Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card blue">
            <div className="stat-icon">🎬</div>
            <div className="stat-content">
              <div className="stat-number">{data?.stats?.totalVideos ?? 0}</div>
              <div className="stat-title">Total Videos</div>
              <div className="stat-subtitle">All uploads</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{data?.stats?.approvedVideos ?? 0}</div>
              <div className="stat-title">Approved</div>
              <div className="stat-subtitle">Published & Live</div>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{data?.stats?.pendingVideos ?? 0}</div>
              <div className="stat-title">Pending</div>
              <div className="stat-subtitle">Awaiting review</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon">👀</div>
            <div className="stat-content">
              <div className="stat-number">{data?.stats?.totalViews ?? 0}</div>
              <div className="stat-title">Total Views</div>
              <div className="stat-subtitle">Across all videos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="dashboard-content">
        <div className="content-container">
          <div className="content-grid">
            {/* Recent Activity */}
            <div className="content-section">
              <div className="section-header">
                <h3 className="section-title">Recent Activity</h3>
                <p className="section-subtitle">Your latest video uploads and updates</p>
              </div>
              <div className="activity-list">
                {(data?.recentVideos || []).slice(0, 5).map((video) => (
                  <div key={video.id} className="activity-item">
                    <div className="activity-icon">
                      {video.status === 'approved' ? '✅' : '🕒'}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{video.title}</div>
                      <div className="activity-meta">
                        <span className={`status-badge ${video.status}`}>
                          {video.status}
                        </span>
                        <span className="activity-date">
                          {new Date(video.uploadedAt).toLocaleDateString()}
                        </span>
                        <span className="activity-views">
                          {video.views ?? 0} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!data?.recentVideos || data.recentVideos.length === 0) && (
                  <div className="empty-state">
                    <div className="empty-icon">📹</div>
                    <p>No recent activity. Upload your first video to get started!</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => navigate('/speaker/upload')}
                    >
                      Upload Video
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Section */}
            <div className="tips-section">
              <div className="section-header">
                <h3 className="section-title">💡 Pro Tips</h3>
                <p className="section-subtitle">Maximize your impact</p>
              </div>
              <div className="tips-list">
                <div className="tip-item">
                  <div className="tip-icon">🎯</div>
                  <div className="tip-content">
                    <strong>Use clear titles</strong>
                    <p>Descriptive titles improve discoverability</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">📅</div>
                  <div className="tip-content">
                    <strong>Stay consistent</strong>
                    <p>Regular uploads build your audience</p>
                  </div>
                </div>
                <div className="tip-item">
                  <div className="tip-icon">💬</div>
                  <div className="tip-content">
                    <strong>Engage viewers</strong>
                    <p>Encourage interaction and bookmarks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Management Section */}
      <section className="video-management">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-title">Your Content Library</h2>
            <p className="section-subtitle">
              Manage all your uploaded videos, track performance, and edit content
            </p>
          </div>
          <div className="video-content">
            <SpeakerVideos />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpeakerDashboard;
