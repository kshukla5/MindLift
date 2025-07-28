import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../api';
import './VideoUpload.css';
import { useAuth } from '../hooks/useAuth';

function VideoUpload({ onVideoUploaded }) {
  const { token, isSpeaker } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadType, setUploadType] = useState('file');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setError('');
      } else {
        setError('Please upload a valid video file.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccessMessage('');
    
    // Validate required fields
    if (!title.trim()) {
      setError('Please enter a video title.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a video description.');
      return;
    }
    if (!category.trim()) {
      setError('Please enter a category.');
      return;
    }
    
    // Validate based on upload method
    if (uploadType === 'file') {
      if (!videoFile) {
        setError('Please select a video file to upload.');
        return;
      }
    } else if (uploadType === 'url') {
      if (!videoUrl.trim()) {
        setError('Please enter a video URL.');
        return;
      }
      // Basic URL validation for video URLs
      const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/i;
      if (!urlPattern.test(videoUrl.trim())) {
        setError('Please enter a valid video URL from YouTube, Vimeo, or Dailymotion.');
        return;
      }
    }
    
    setIsLoading(true);

    try {
      if (uploadType === 'file') {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('category', category.trim());
        formData.append('videoFile', videoFile);

        await axios.post(`${API_URL}/api/videos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          videoUrl: videoUrl.trim(),
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
      
      // Reset file input manually
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Trigger callback to refresh dashboard
      if (onVideoUploaded) {
        onVideoUploaded();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'An error occurred during submission.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSpeaker) {
    return (
      <div className="video-upload-wrapper">
        <div className="video-upload-container">
          <div className="upload-header">
            <h2>Access Restricted</h2>
            <p>Speaker authorization required to upload videos</p>
          </div>
          <div className="message-container error">
            <strong>Access Denied</strong>
            <p>You must be logged in as a speaker to upload videos to our platform.</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="submit-button"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-upload-wrapper">
      <div className="video-upload-container">
        <div className="upload-header">
          <h2>Upload Your Video</h2>
          <p>Share your knowledge and inspire learners worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h3>Video Details</h3>
            
            <div className="input-group">
              <label htmlFor="title">Video Title *</label>
              <input 
                id="title" 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                disabled={isLoading}
                placeholder="Enter a compelling title for your video"
              />
            </div>

            <div className="input-group">
              <label htmlFor="description">Description *</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                disabled={isLoading}
                placeholder="Describe what learners will gain from this video..."
                rows="4"
              />
            </div>

            <div className="input-group">
              <label htmlFor="category">Category *</label>
              <input 
                id="category" 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
                disabled={isLoading}
                placeholder="e.g., Leadership, Communication, Technology"
              />
              <small>Separate multiple categories with commas</small>
            </div>
          </div>

          <div className="form-section">
            <h3>Upload Method</h3>
            
            <div className="upload-type-selector">
              <div className={`upload-option ${uploadType === 'file' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  id="upload-file"
                  value="file" 
                  checked={uploadType === 'file'} 
                  onChange={() => setUploadType('file')}
                  className="radio-input"
                />
                <label htmlFor="upload-file" className="upload-option-label">
                  <div className="option-content">
                    <strong>Upload File</strong>
                    <span>Upload MP4 video from your device</span>
                  </div>
                </label>
              </div>
              
              <div className={`upload-option ${uploadType === 'url' ? 'selected' : ''}`}>
                <input 
                  type="radio" 
                  id="upload-url"
                  value="url" 
                  checked={uploadType === 'url'} 
                  onChange={() => setUploadType('url')}
                  className="radio-input"
                />
                <label htmlFor="upload-url" className="upload-option-label">
                  <div className="option-content">
                    <strong>Video Link</strong>
                    <span>Use YouTube, Vimeo, or other video URL</span>
                  </div>
                </label>
              </div>
            </div>

            {uploadType === 'file' ? (
              <div 
                className={`file-upload-area ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  id="videoFile" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="video/mp4,video/avi,video/mov,video/wmv" 
                  disabled={isLoading}
                  className="file-input"
                />
                <label htmlFor="videoFile" className="file-upload-label">
                  <div className="file-upload-content">
                    <div className="file-text">
                      <strong>Click to select video file</strong>
                      <span>or drag and drop your video file here</span>
                      <span>Supported formats: MP4, AVI, MOV, WMV</span>
                    </div>
                  </div>
                </label>
                {videoFile && (
                  <div className="file-selected">
                    <span className="file-name">Selected: {videoFile.name}</span>
                    <span className="file-size">({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="input-group">
                <label htmlFor="videoUrl">Video URL *</label>
                <input 
                  id="videoUrl" 
                  type="url" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  disabled={isLoading}
                  className="url-input"
                  placeholder="https://www.youtube.com/watch?v=example or https://vimeo.com/example"
                />
                <small>Supported platforms: YouTube, Vimeo, Dailymotion</small>
              </div>
            )}
          </div>

          {error && (
            <div className="message-container error">
              <strong>Upload Failed</strong>
              <p>{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="message-container success">
              <strong>Upload Successful!</strong>
              <p>{successMessage}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Processing Upload...' : 'Submit Video for Review'}
          </button>
          
          <p className="submit-note">
            Your video will be reviewed by our team before being published to ensure quality standards.
          </p>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;
