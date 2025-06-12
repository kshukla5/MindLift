import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import VideoPlayer from "./VideoPlayer";
import "./VideoGrid.css";

function MyLibrary() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div>
      <h2>My Library</h2>
      {videos.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <div className="video-card" key={video.id}>
              <VideoPlayer url={video.video_url} />
              <h4>{video.title}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyLibrary;
