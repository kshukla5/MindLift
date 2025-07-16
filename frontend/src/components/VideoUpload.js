import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';
import './VideoUpload.css';
import { useAuth } from '../hooks/useAuth';

function VideoUpload() {
  const { token, isSpeaker } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadType === 'file' && !videoFile) {
      setError('Please select a video file to upload.');
      return;
    }
    if (uploadType === 'url' && !videoUrl) {
      setError('Please enter a video URL.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (uploadType === 'file') {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('videoFile', videoFile);

        await axios.post(`${API_URL}/api/videos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else { // 'url'
        const payload = {
          title,
          description,
          category,
          videoUrl: videoUrl,
        };
        await axios.post(`${API_URL}/api/videos`, payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setSuccessMessage('Video submitted successfully! It will be reviewed by an admin.');
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setVideoFile(null);
      setVideoUrl('');
      e.target.reset(); // to clear the file input
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSpeaker) {
    return (
      <div className="video-upload-container">
        <div className="video-upload-card">
             <h2>Upload Video</h2>
             <p>You must be logged in as a speaker to upload videos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-upload-container">
      <div className="video-upload-card">
        <h2>Upload Your Video</h2>
        <p>Share your knowledge and inspire others.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Video Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isLoading} />
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={isLoading} />
          <label htmlFor="category">Categories</label>
          <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required disabled={isLoading} placeholder="e.g., Leadership, Confidence" />
          <p className="input-hint">Separate multiple categories with a comma.</p>

          <div className="upload-type-selector">
            <label>
              <input type="radio" value="file" checked={uploadType === 'file'} onChange={() => setUploadType('file')} />
              Upload a File (MP4)
            </label>
            <label>
              <input type="radio" value="url" checked={uploadType === 'url'} onChange={() => setUploadType('url')} />
              Use a Video Link (YouTube/Vimeo)
            </label>
          </div>

          {uploadType === 'file' ? (
            <input id="videoFile" type="file" onChange={handleFileChange} accept="video/mp4" required={uploadType === 'file'} disabled={isLoading} />
          ) : (
            <input id="videoUrl" type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required={uploadType === 'url'} disabled={isLoading} placeholder="https://www.youtube.com/watch?v=..." />
          )}

          {error && <p className="error-text">{error}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <button type="submit" disabled={isLoading || (uploadType === 'file' && !videoFile) || (uploadType === 'url' && !videoUrl)}>
            {isLoading ? 'Submitting...' : 'Submit Video'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;