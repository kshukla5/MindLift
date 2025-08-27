import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import SpeakerDashboard from './components/SpeakerDashboard';
import VideoGridPage from './pages/VideoGridPage';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<VideoGridPage />} />
              <Route path="/videos" element={<VideoGridPage />} />
              <Route path="/speaker" element={<SpeakerDashboard />} />
              <Route path="/speaker/upload" element={<div>Video Upload Coming Soon</div>} />
              <Route path="/speaker/edit/:videoId" element={<div>Video Edit Coming Soon</div>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-library" element={<div>My Library Coming Soon</div>} />
              <Route path="/admin" element={<div>Admin Dashboard Coming Soon</div>} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
