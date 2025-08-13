import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import VideoGrid from '../components/VideoGrid';
import './VideoGridPage.css';

function VideoGridPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'MindLift - Browse Videos';
  }, []);

  return (
    <div className="video-grid-page">
      {/* Header Section */}
      <section className="page-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="page-title">
              Discover <span className="text-gradient">Learning Content</span>
            </h1>
            <p className="page-subtitle">
              Explore our curated collection of educational videos from expert speakers
            </p>
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="videos-section">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-title">All Videos</h2>
            <p className="section-subtitle">
              Browse through our comprehensive video library
            </p>
          </div>
          
          <VideoGrid />
        </div>
      </section>
    </div>
  );
}

export default VideoGridPage;
