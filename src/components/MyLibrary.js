import React from "react";
import VideoPlayer from "./VideoPlayer";
import { useMyLibrary } from "../hooks/useMyLibrary";
import "./VideoGrid.css";

function MyLibrary() {
  const { videos, loading, error } = useMyLibrary();

  if (loading) {
    return <p>Loading your library...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>My Library</h2>
      {videos.length === 0 ? (
        <p>You haven't bookmarked any videos yet. Find videos on the dashboard and save them!</p>
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
