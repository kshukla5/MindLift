import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './components/AboutUs';
import FeaturesPage from './components/FeaturesPage';
import ContactPage from './components/ContactPage';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import MyLibrary from './components/MyLibrary';
import VideoEdit from './components/VideoEdit';
import ProfilePage from './components/ProfilePage';
import VideoUpload from './components/VideoUpload';

// Import components needed by our page components
import HeroSection from './components/HeroSection';
import VideoGrid from './components/VideoGrid';
import SpeakerVideos from './components/SpeakerVideos';
import { useAuth } from './hooks/useAuth';

import './App.css';

// --- Page Components defined outside the main App function ---
// This avoids re-mounting on every render and solves potential runtime issues,
// while also resolving the "Module not found" error by not needing a separate /pages directory.

const HomePage = () => (
  <>
    <HeroSection />
    <VideoGrid />
  </>
);

const LearnerDashboard = () => (
  <div style={{ padding: '20px', minHeight: '70vh' }}>
    <VideoGrid />
  </div>
);

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

function App() {
  return (
    <Routes>
      {/* Public routes are nested within the MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Routes that require authentication are nested within ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<LearnerDashboard />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/speaker" element={<SpeakerDashboard />} />
          <Route path="/speaker/upload" element={<VideoUpload />} />
          <Route path="/speaker/edit/:videoId" element={<VideoEdit />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;