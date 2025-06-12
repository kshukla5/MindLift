import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import "./VideoGrid.css";

function VideoGrid() {
  const [videosByCategory, setVideosByCategory] = useState({});
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const handleBookmark = async (id, isBookmarked) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to bookmark videos");
      return;
    }
    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
      } else {
        await axios.post(
          "/api/bookmarks",
          { videoId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarkedIds([...bookmarkedIds, id]);
      }
    } catch (err) {
      console.error("Bookmark error", err);
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/api/videos");
        const approved = res.data.filter((v) => v.approved);
        const grouped = approved.reduce((acc, video) => {
          const cat = video.category || "Uncategorized";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(video);
          return acc;
        }, {});
        setVideosByCategory(grouped);
      } catch (err) {
        console.error("Failed to fetch videos", err);
      }
    };
    fetchVideos();
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/bookmarks", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setBookmarkedIds(res.data.map((v) => v.id)))
        .catch((err) => console.error("Failed to fetch bookmarks", err));
    }
  }, []);

  return (
    <div>
      {Object.entries(videosByCategory).map(([category, videos]) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="video-grid">
            {videos.map((video) => (
              <div className="video-card" key={video.id}>
                <VideoPlayer url={video.video_url} />
                <h4>{video.title}</h4>
                <button
                  onClick={() =>
                    handleBookmark(video.id, bookmarkedIds.includes(video.id))
                  }
                >
                  {bookmarkedIds.includes(video.id)
                    ? "Remove Bookmark"
                    : "Save Bookmark"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
