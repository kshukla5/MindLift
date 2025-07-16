import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SpeakerVideos from '../components/SpeakerVideos';

const SpeakerDashboard = () => {
  const navigate = useNavigate();
  const { isSpeaker } = useAuth();

  if (!isSpeaker) {
    return <p>You must be a speaker to access this dashboard.</p>;
  }

  return (
    <div style={{ padding: '20px', minHeight: '70vh' }}>
      <h2>Speaker Dashboard</h2>
      <button onClick={() => navigate('/speaker/upload')} style={{ marginBottom: 20 }}>
        Upload Video
      </button>
      <SpeakerVideos />
    </div>
  );
};

export default SpeakerDashboard;