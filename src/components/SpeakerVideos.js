import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpeakerDashboard } from '../hooks/useSpeakerDashboard';
import './SpeakerVideos.css';

const SpeakerVideos = () => {
  const navigate = useNavigate();
  const { videos, loading, error, deleteVideo } = useSpeakerDashboard();
  const [deletingVideo, setDeletingVideo] = useState(null);

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    setDeletingVideo(videoId);
    const result = await deleteVideo(videoId);
    setDeletingVideo(null);

    if (!result.success) {
      alert(`Failed to delete video: ${result.error}`);
    }
  };

  const getStatusBadge = (approved) => {
    if (approved === null) return <span className="status-badge pending">⏳ Pending</span>;
    if (approved) return <span className="status-badge approved">✅ Approved</span>;
    return <span className="status-badge rejected">❌ Rejected</span>;
  };

  if (loading) {
    return (
      <div className="speaker-videos-loading">
        <div className="spinner"></div>
        <p>Loading your videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="speaker-videos-error">
        <p>Error loading videos: {error}</p>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="speaker-videos-empty">
        <div className="empty-state">
          <div className="empty-icon">📹</div>
          <h3>No videos yet</h3>
          <p>Start building your content library by uploading your first video.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/speaker/upload')}
          >
            Upload Your First Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="speaker-videos">
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              {video.video_url ? (
                <video 
                  src={video.video_url} 
                  poster={video.thumbnail_url}
                  className="video-preview"
                />
              ) : (
                <div className="video-placeholder">
                  <span>🎥</span>
                </div>
              )}
              {getStatusBadge(video.approved)}
            </div>
            
            <div className="video-info">
              <h4 className="video-title">{video.title}</h4>
              <p className="video-description">{video.description}</p>
              <div className="video-meta">
                <span className="video-category">{video.category}</span>
                <span className="video-date">
                  {new Date(video.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="video-actions">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigate(`/speaker/edit/${video.id}`)}
              >
                ✏️ Edit
              </button>
              <button 
                className={`btn btn-danger btn-sm ${deletingVideo === video.id ? 'loading' : ''}`}
                onClick={() => handleDelete(video.id)}
                disabled={deletingVideo === video.id}
              >
                {deletingVideo === video.id ? '🗑️ Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeakerVideos;
