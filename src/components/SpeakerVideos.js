import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import VideoPlayer from './VideoPlayer';
import { useAuth } from '../hooks/useAuth';
import './SpeakerVideos.css';

function SpeakerVideos() {
  const { token, isSpeaker, isAuthenticated } = useAuth();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchVideos = async () => {
    setError('');
    try {
      const res = await axios.get(`${API_URL}/api/speaker/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data.videos || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to view your videos.");
      setLoading(false);
    } else if (!isSpeaker) {
      setError("You must be a speaker to view this content.");
      setLoading(false);
    } else if (token && isSpeaker) {
      fetchVideos();
    }
  }, [token, isSpeaker, isAuthenticated]);

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/api/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(videos.filter((v) => v.id !== videoId));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete video.');
      }
    }
  };

  if (!isAuthenticated) return <p>Please log in to view your videos.</p>;
  if (!isSpeaker) return <p>{error}</p>; // Display the specific error for non-speakers
  if (loading) return <p>Loading videos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="speaker-videos-container">
      <h2>Your Uploaded Videos</h2>
      {videos.length === 0 && <p>No videos uploaded yet.</p>}
      <ul className="video-list">
        {videos.map((video) => (
          <li key={video.id} className="video-list-item">
            <span className="video-title">{video.title}</span>
            <span className={`video-status ${video.approved ? 'status-published' : 'status-pending'}`}>
              {video.approved ? 'Published' : 'Pending'}
            </span>
            <div className="video-actions">
              <button className="action-btn" onClick={() => setSelectedVideo(video)}>Preview</button>
              <Link to={`/speaker/edit/${video.id}`} className="action-btn">Edit</Link>
              <button className="action-btn delete-btn" onClick={() => handleDelete(video.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {selectedVideo && (
        <div style={{ marginTop: 20 }}>
          <h3>{selectedVideo.title}</h3>
          <VideoPlayer url={selectedVideo.video_url} />
          <button onClick={() => setSelectedVideo(null)}>Close Player</button>
        </div>
      )}
    </div>
  );
}

export default SpeakerVideos;
