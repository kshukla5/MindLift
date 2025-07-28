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
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
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
    if (uploadType === 'file' && !videoFile) {
      setError('Please select a video file to upload.');
      return;
    }
    if (uploadType === 'url' && !videoUrl.trim()) {
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
      e.target.reset(); // to clear the file input
      
      // Trigger callback to refresh dashboard
      if (onVideoUploaded) {
        onVideoUploaded();
      }
    } catch (err) {
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
            <h2>🎥 Video Upload</h2>
            <p>Speaker access required to upload content</p>
          </div>
          <div className="auth-message">
            <div className="auth-icon">🔒</div>
            <p>You must be logged in as a speaker to upload videos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-upload-wrapper">
      <div className="video-upload-container">
        <div className="upload-header">
          <h2>🎥 Upload Your Video</h2>
          <p>Share your knowledge and inspire learners worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Video Details Section */}
          <div className="form-section">
            <h3>📝 Video Details</h3>
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
              <label htmlFor="category">Categories *</label>
              <input 
                id="category" 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
                disabled={isLoading} 
                placeholder="e.g., Leadership, Communication, Personal Development"
              />
              <span className="input-hint">💡 Separate multiple categories with commas</span>
            </div>
          </div>

          {/* Upload Method Section */}
          <div className="form-section">
            <h3>📤 Upload Method</h3>
            <div className="upload-type-selector">
              <label className={`upload-option ${uploadType === 'file' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  value="file" 
                  checked={uploadType === 'file'} 
                  onChange={() => setUploadType('file')} 
                />
                <div className="option-content">
                  <span className="option-icon">📁</span>
                  <div>
                    <strong>Upload File</strong>
                    <p>Upload MP4 video from your device</p>
                  </div>
                </div>
              </label>
              
              <label className={`upload-option ${uploadType === 'url' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  value="url" 
                  checked={uploadType === 'url'} 
                  onChange={() => setUploadType('url')} 
                />
                <div className="option-content">
                  <span className="option-icon">🔗</span>
                  <div>
                    <strong>Video URL</strong>
                    <p>Link to YouTube or Vimeo video</p>
                  </div>
                </div>
              </label>
            </div>

            {uploadType === 'file' ? (
              <div className="input-group">
                <label>Video File *</label>
                <div 
                  className={`file-drop-zone ${dragActive ? 'drag-active' : ''} ${videoFile ? 'has-file' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {videoFile ? (
                    <div className="file-selected">
                      <span className="file-icon">🎬</span>
                      <div className="file-info">
                        <strong>{videoFile.name}</strong>
                        <p>{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                      <button 
                        type="button" 
                        className="remove-file"
                        onClick={() => setVideoFile(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="drop-content">
                      <span className="upload-icon">☁️</span>
                      <p><strong>Drop your video here</strong> or click to browse</p>
                      <p className="file-hint">Supports MP4 files up to 500MB</p>
                    </div>
                  )}
                  <input 
                    id="videoFile" 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="video/mp4,video/quicktime,video/x-msvideo" 
                    required={uploadType === 'file'} 
                    disabled={isLoading}
                    hidden
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label htmlFor="videoUrl">Video URL *</label>
                <input 
                  id="videoUrl" 
                  type="url" 
                  value={videoUrl} 
                  onChange={(e) => setVideoUrl(e.target.value)} 
                  required={uploadType === 'url'} 
                  disabled={isLoading} 
                  placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                />
                <span className="input-hint">🎯 Make sure the video is publicly accessible</span>
              </div>
            )}
          </div>

          {/* Status Messages */}
          {error && (
            <div className="message error-message">
              <span className="message-icon">⚠️</span>
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="message success-message">
              <span className="message-icon">✅</span>
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading || (uploadType === 'file' && !videoFile) || (uploadType === 'url' && !videoUrl.trim())}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Submit Video for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VideoUpload;