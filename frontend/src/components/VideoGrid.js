import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoGrid.css';

function VideoGrid() {
  const [videosByCategory, setVideosByCategory] = useState({});

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get('/api/videos');
        const approved = res.data.filter(v => v.approved);
        const grouped = approved.reduce((acc, video) => {
          const cat = video.category || 'Uncategorized';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(video);
          return acc;
        }, {});
        setVideosByCategory(grouped);
      } catch (err) {
        console.error('Failed to fetch videos', err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div>
      {Object.entries(videosByCategory).map(([category, videos]) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="video-grid">
            {videos.map(video => (
              <div className="video-card" key={video.id}>
                <video src={video.video_url} controls width="250" />
                <h4>{video.title}</h4>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
