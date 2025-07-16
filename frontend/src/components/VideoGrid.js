import React from "react";
import VideoPlayer from "./VideoPlayer";
import { useVideoGrid } from "../hooks/useVideoGrid";
import "./VideoGrid.css";

function VideoGrid() {
  const {
    videosByCategory,
    bookmarkedIds,
    handleBookmark,
    loading,
    error,
    searchTerm,
    setSearchTerm,
  } = useVideoGrid();

  if (loading) {
    return <p>Loading videos...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <div className="video-search-bar">
        <input
          type="text"
          placeholder="Search videos by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="video-search-input"
        />
      </div>
      {Object.entries(videosByCategory).map(([category, videos]) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="video-grid">
            {videos.length === 0 && searchTerm !== '' ? (
              <p>No videos found in this category matching your search.</p>
            ) : (
              videos.map((video) => {
                const isBookmarked = bookmarkedIds.has(video.id);
                return (
                  <div className="video-card" key={video.id}>
                    <VideoPlayer url={video.video_url} />
                    <h4>{video.title}</h4>
                    <button
                      className={`bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
                      onClick={() => handleBookmark(video.id, isBookmarked)}
                    >
                      {isBookmarked ? "✓ Bookmarked" : "Bookmark"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}
      {Object.entries(videosByCategory).length === 0 && searchTerm !== '' && (
        <p>No videos found matching your search criteria across all categories.</p>
      )}
    </div>
  );
}

export default VideoGrid;
