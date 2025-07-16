import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLearnerDashboard } from '../hooks/useLearnerDashboard';
import VideoGrid from './VideoGrid';
import VideoPlayer from './VideoPlayer';
import './LearnerDashboard.css';

const LearnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    learnerStats, 
    platformStats, 
    recentBookmarks, 
    categoryBreakdown, 
    popularCategories, 
    recentVideos, 
    loading, 
    error, 
    refreshing, 
    refreshData 
  } = useLearnerDashboard();

  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const CategoryCard = ({ category, count, percentage }) => (
    <div className="category-card">
      <div className="category-header">
        <span className="category-name">{category}</span>
        <span className="category-count">{count} videos</span>
      </div>
      <div className="category-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="category-percentage">{percentage}%</span>
      </div>
    </div>
  );

  const BookmarkCard = ({ bookmark, onRemove }) => (
    <div className="bookmark-card">
      <div className="bookmark-thumbnail">
        <VideoPlayer url={bookmark.video_url} />
      </div>
      <div className="bookmark-content">
        <h4>{bookmark.title}</h4>
        <p className="bookmark-category">{bookmark.category}</p>
        <p className="bookmark-date">
          Bookmarked: {new Date(bookmark.bookmarked_at).toLocaleDateString()}
        </p>
        <div className="bookmark-actions">
          <button 
            className="btn btn-sm btn-outline"
            onClick={() => setSelectedVideo(bookmark)}
          >
            ▶️ Watch
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onRemove(bookmark.id)}
          >
            🗑️ Remove
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="learner-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learner-dashboard">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={refreshData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="learner-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Learning Dashboard</h1>
          <p>Welcome back, {user?.name || 'Learner'}! Continue your learning journey.</p>
        </div>
        <div className="quick-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            📚 Browse Videos
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/my-library')}
          >
            📖 My Library
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

      {/* Personal Stats */}
      <div className="stats-section">
        <h2>Your Learning Progress</h2>
        <div className="stats-grid">
          <StatCard
            title="Total Bookmarks"
            value={learnerStats?.total_bookmarks || 0}
            subtitle="Videos saved"
            icon="📚"
            color="blue"
          />
          <StatCard
            title="Categories Explored"
            value={learnerStats?.categories_explored || 0}
            subtitle="Different topics"
            icon="🎯"
            color="green"
          />
          <StatCard
            title="This Week"
            value={learnerStats?.bookmarks_this_week || 0}
            subtitle="Videos bookmarked"
            icon="📅"
            color="orange"
          />
          <StatCard
            title="This Month"
            value={learnerStats?.bookmarks_this_month || 0}
            subtitle="Videos bookmarked"
            icon="📆"
            color="purple"
          />
        </div>
      </div>

      {/* Platform Stats */}
      <div className="stats-section">
        <h2>Platform Overview</h2>
        <div className="stats-grid">
          <StatCard
            title="Total Videos"
            value={platformStats?.published_videos || 0}
            subtitle="Available to watch"
            icon="📹"
            color="blue"
          />
          <StatCard
            title="Active Speakers"
            value={platformStats?.active_speakers || 0}
            subtitle="Content creators"
            icon="🎤"
            color="green"
          />
          <StatCard
            title="New This Week"
            value={platformStats?.new_this_week || 0}
            subtitle="Fresh content"
            icon="🆕"
            color="orange"
          />
          <StatCard
            title="Categories"
            value={platformStats?.total_categories || 0}
            subtitle="Topics available"
            icon="🏷️"
            color="purple"
          />
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Bookmarks */}
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Bookmarks</h2>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/my-library')}
            >
              View All
            </button>
          </div>
          {recentBookmarks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3>No bookmarks yet</h3>
              <p>Start bookmarking videos to track your learning progress!</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Browse Videos
              </button>
            </div>
          ) : (
            <div className="bookmarks-grid">
              {recentBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onRemove={(id) => {
                    // Handle remove bookmark
                    console.log('Remove bookmark:', id);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Categories Breakdown */}
        <div className="sidebar-section">
          <h3>Your Learning Categories</h3>
          {categoryBreakdown.length === 0 ? (
            <p>No categories yet. Start bookmarking videos to see your interests!</p>
          ) : (
            <div className="categories-list">
              {categoryBreakdown.map((category) => (
                <CategoryCard
                  key={category.category}
                  category={category.category}
                  count={category.bookmark_count}
                  percentage={category.percentage}
                />
              ))}
            </div>
          )}

          <h3>Popular Categories</h3>
          <div className="popular-categories">
            {popularCategories.map((category) => (
              <div key={category.category} className="popular-category">
                <span className="category-name">{category.category}</span>
                <span className="category-count">{category.video_count} videos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Videos Preview */}
      <div className="recent-videos-section">
        <div className="section-header">
          <h2>Latest Videos</h2>
          <button 
            className="btn btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            Browse All
          </button>
        </div>
        <VideoGrid limit={6} showSearch={false} />
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="video-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedVideo.title}</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedVideo(null)}
              >
                ✕
              </button>
            </div>
            <VideoPlayer url={selectedVideo.video_url} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerDashboard;
