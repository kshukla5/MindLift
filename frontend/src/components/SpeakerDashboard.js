import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './SpeakerDashboard.css';

/**
 * Modern Speaker Dashboard - Complete Rebuild
 * Professional design with analytics, video management, and profile editing
 */
const SpeakerDashboard = () => {
  const navigate = useNavigate();
  const { token, isSpeaker, user } = useAuth();
  
  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileEditing, setProfileEditing] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!isSpeaker) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isSpeaker, token]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/speaker/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Dashboard load failed: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      console.log('Dashboard data loaded:', data);

    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = () => {
    loadDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="speaker-dashboard loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading your speaker dashboard...</h2>
          <p>Gathering your analytics and content data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="speaker-dashboard error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Dashboard Error</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={refreshData}>
              Try Again
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
              Check Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { profile, videos, analytics, summary } = dashboardData || {};

  return (
    <div className="speaker-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Speaker Dashboard</h1>
            <p>Welcome back, <strong>{profile?.name || user?.name || 'Speaker'}</strong></p>
            <div className="last-active">
              Last video uploaded: {videos?.length > 0 ? 
                new Date(videos[0].created_at).toLocaleDateString() : 'No videos yet'}
            </div>
          </div>
          <div className="quick-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/speaker/upload')}
            >
              📹 Upload Video
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/profile')}
            >
              👤 Edit Profile
            </button>
            <button 
              className="btn btn-outline"
              onClick={refreshData}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Videos"
          value={summary?.total_videos || 0}
          icon="🎬"
          color="blue"
        />
        <StatCard
          title="Approved"
          value={summary?.approved_videos || 0}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Pending Review"
          value={summary?.pending_videos || 0}
          icon="⏳"
          color="orange"
        />
        <StatCard
          title="Total Views"
          value={summary?.total_views || 0}
          icon="👀"
          color="purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          🎥 My Videos
        </button>
        <button
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <OverviewTab 
            analytics={analytics} 
            videos={videos} 
            summary={summary}
            onUpload={() => navigate('/speaker/upload')}
          />
        )}
        
        {activeTab === 'videos' && (
          <VideosTab 
            videos={videos} 
            onEdit={(videoId) => navigate(`/speaker/edit/${videoId}`)}
            onRefresh={refreshData}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsTab analytics={analytics} summary={summary} />
        )}
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, icon, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  </div>
);

// Overview Tab Component
const OverviewTab = ({ analytics, videos, summary, onUpload }) => (
  <div className="overview-tab">
    <div className="overview-grid">
      {/* Recent Activity */}
      <div className="overview-card">
        <h3>Recent Videos</h3>
        {videos && videos.length > 0 ? (
          <div className="recent-videos">
            {videos.slice(0, 3).map((video) => (
              <div key={video.id} className="video-item">
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p className="video-meta">
                    {video.category} • {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`status-badge ${video.status}`}>
                  {video.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h4>No videos yet</h4>
            <p>Upload your first video to get started!</p>
            <button className="btn btn-primary" onClick={onUpload}>
              Upload Video
            </button>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="overview-card">
        <h3>Performance Insights</h3>
        <div className="insights">
          <div className="insight-item">
            <span className="insight-label">Approval Rate</span>
            <span className="insight-value">
              {analytics?.performance_score || 0}%
            </span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Avg Views per Video</span>
            <span className="insight-value">
              {Math.round(analytics?.avg_views_per_video || 0)}
            </span>
          </div>
          <div className="insight-item">
            <span className="insight-label">Categories Covered</span>
            <span className="insight-value">
              {analytics?.categories_count || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Videos Tab Component
const VideosTab = ({ videos, onEdit, onRefresh }) => (
  <div className="videos-tab">
    <div className="videos-header">
      <h3>Your Videos ({videos?.length || 0})</h3>
      <button className="btn btn-outline" onClick={onRefresh}>
        🔄 Refresh
      </button>
    </div>
    
    {videos && videos.length > 0 ? (
      <div className="videos-grid">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onEdit={() => onEdit(video.id)}
          />
        ))}
      </div>
    ) : (
      <div className="empty-state">
        <div className="empty-icon">📹</div>
        <h4>No videos uploaded</h4>
        <p>Start building your content library by uploading your first video.</p>
      </div>
    )}
  </div>
);

// Video Card Component
const VideoCard = ({ video, onEdit }) => (
  <div className="video-card">
    <div className="video-header">
      <h4>{video.title}</h4>
      <div className={`status-badge ${video.status}`}>
        {video.status}
      </div>
    </div>
    <div className="video-meta">
      <span className="category">{video.category}</span>
      <span className="date">{new Date(video.created_at).toLocaleDateString()}</span>
    </div>
    <div className="video-stats">
      <span className="views">👀 {video.view_count || 0} views</span>
      <span className="bookmarks">📚 {video.bookmark_count || 0} bookmarks</span>
    </div>
    <div className="video-actions">
      <button className="btn btn-sm btn-primary" onClick={onEdit}>
        ✏️ Edit
      </button>
      {video.url && (
        <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
          🔗 View
        </a>
      )}
    </div>
  </div>
);

// Analytics Tab Component
const AnalyticsTab = ({ analytics, summary }) => (
  <div className="analytics-tab">
    <div className="analytics-grid">
      <div className="analytics-card">
        <h3>Content Performance</h3>
        <div className="performance-chart">
          <div className="chart-item">
            <div className="chart-bar">
              <div 
                className="bar approved" 
                style={{ width: `${(summary?.approved_videos / Math.max(summary?.total_videos, 1)) * 100}%` }}
              ></div>
            </div>
            <span>Approved: {summary?.approved_videos || 0}</span>
          </div>
          <div className="chart-item">
            <div className="chart-bar">
              <div 
                className="bar pending" 
                style={{ width: `${(summary?.pending_videos / Math.max(summary?.total_videos, 1)) * 100}%` }}
              ></div>
            </div>
            <span>Pending: {summary?.pending_videos || 0}</span>
          </div>
        </div>
      </div>

      <div className="analytics-card">
        <h3>Category Breakdown</h3>
        {analytics?.category_breakdown && analytics.category_breakdown.length > 0 ? (
          <div className="category-list">
            {analytics.category_breakdown.map((cat, index) => (
              <div key={index} className="category-item">
                <span className="category-name">{cat.category}</span>
                <span className="category-count">{cat.video_count} videos</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No category data available</p>
        )}
      </div>
    </div>
  </div>
);

export default SpeakerDashboard;
