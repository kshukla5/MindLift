import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { useAuth } from '../hooks/useAuth';
import { useSpeakerDashboard } from '../hooks/useSpeakerDashboard';
import './SpeakerVideos.css';

function SpeakerVideos() {
  const { isSpeaker, isAuthenticated } = useAuth();
  const { videos, loading, error, deleteVideo } = useSpeakerDashboard();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      setDeleteLoading(videoId);
      const result = await deleteVideo(videoId);
      setDeleteLoading(null);
      
      if (!result.success) {
        alert(result.error || 'Failed to delete video');
      }
    }
  };

  if (!isAuthenticated) return <p>Please log in to view your videos.</p>;
  if (!isSpeaker) return <p>{error}</p>; // Display the specific error for non-speakers
  if (loading) return <p>Loading videos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="speaker-videos-container">
      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📹</div>
          <h3>No videos yet</h3>
          <p>Start sharing your knowledge with the world!</p>
        </div>
      ) : (
        <ul className="video-list">
          {videos.map((video) => (
            <li key={video.id} className="video-list-item">
              <span className="video-title">{video.title}</span>
              <span className={`video-status ${video.approved ? 'status-published' : 'status-pending'}`}>
                {video.approved ? '✅ Published' : '⏳ Pending'}
              </span>
              <div className="video-actions">
                <button className="action-btn" onClick={() => setSelectedVideo(video)}>
                  👁️ Preview
                </button>
                <Link to={`/speaker/edit/${video.id}`} className="action-btn">
                  ✏️ Edit
                </Link>
                <button 
                  className="action-btn delete-btn" 
                  onClick={() => handleDelete(video.id)}
                  disabled={deleteLoading === video.id}
                >
                  {deleteLoading === video.id ? '⏳ Deleting...' : '🗑️ Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {selectedVideo && (
        <div className="video-player-container">
          <h3>{selectedVideo.title}</h3>
          <VideoPlayer url={selectedVideo.video_url} />
          <button onClick={() => setSelectedVideo(null)}>✕ Close Player</button>
        </div>
      )}
    </div>
  );
}

export default SpeakerVideos;
