import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../api';
import './VideoUpload.css'; // Re-use the same styles
import { useAuth } from '../hooks/useAuth';

function VideoEdit() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const { token, isAuthenticated } = useAuth();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchVideoData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const video = res.data;
        setTitle(video.title);
        setDescription(video.description);
        setCategory(video.category || '');
        setIsAuthorized(true);
      } catch (err) {
        const errorStatus = err.response?.status;
        if (errorStatus === 403 || errorStatus === 404) {
          setError('You are not authorized to edit this video or it does not exist.');
        } else {
          setError('Failed to load video data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchVideoData();
    }
  }, [videoId, navigate, token, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const payload = { title, description, category };

    try {
      await axios.patch(`${API_URL}/api/videos/${videoId}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Video updated successfully!');
      setTimeout(() => navigate('/speaker'), 2000); // Redirect back after 2s
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during update.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading editor...</p>;
  }

  if (!isAuthorized) {
    return (
      <div className="video-upload-container">
        <div className="video-upload-card">
          <h2>Edit Video</h2>
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-upload-container">
      <div className="video-upload-card">
        <h2>Edit Your Video</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Video Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
          <label htmlFor="category">Categories</label>
          <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isLoading} placeholder="e.g., Leadership, Confidence" />
          <p className="input-hint">Separate multiple categories with a comma.</p>
          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoEdit;