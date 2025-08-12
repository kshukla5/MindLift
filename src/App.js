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
import HomePage from './components/HomePage';
import SpeakerDashboard from './components/SpeakerDashboard';
import LearnerDashboard from './components/LearnerDashboard';

// Import components needed by our page components
import VideoGrid from './components/VideoGrid';
import { useAuth } from './hooks/useAuth';

import './App.css';

// --- Page Components defined outside the main App function ---
const VideoGridPage = () => (
  <div style={{ padding: '20px', minHeight: '70vh' }}>
    <VideoGrid />
  </div>
);

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
          <Route path="/videos" element={<VideoGridPage />} />
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