import React, { useState } from "react";
import ReactPlayer from "react-player";

function VideoPlayer({ url }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div>
      <ReactPlayer
        url={url}
        playing={playing}
        controls
        width="100%"
        height="100%"
      />
      <div style={{ marginTop: "8px" }}>
        <button onClick={() => setPlaying(true)}>Play</button>
        <button onClick={() => setPlaying(false)}>Pause</button>
        <button onClick={() => setPlaying(true)}>Resume</button>
      </div>
    </div>
  );
}

export default VideoPlayer;
