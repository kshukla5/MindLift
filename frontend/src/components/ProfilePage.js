import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import API_URL from '../api';
import './ProfilePage.css';

function ProfilePage() {
  const { user, token, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileIsLoading, setProfileIsLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordIsLoading, setPasswordIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileIsLoading(true);
    setProfileError('');
    setProfileSuccessMessage('');

    try {
      const res = await axios.patch(
        `${API_URL}/api/profile`,
        { name, email, bio },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If the backend returns a new token (e.g., with an updated name), store it.
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      setProfileSuccessMessage('Profile updated successfully! Refresh the page to see all changes.');
      setIsEditMode(false);
    } catch (err) {
      setProfileError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setProfileIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setPasswordIsLoading(true);

    try {
      await axios.patch(
        `${API_URL}/api/profile/password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordSuccessMessage('Password changed successfully!');
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setPasswordIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-content-wrapper">
          <div className="profile-header">
            <div className="profile-avatar">🔒</div>
            <h1 className="profile-title">Access Required</h1>
            <p className="profile-subtitle">Please log in to view your profile</p>
          </div>
          <div className="profile-card">
            <div className="error-text">
              You need to be logged in to access your profile page.
            </div>
            <div className="profile-actions">
              <button 
                onClick={() => window.location.href = '/login'} 
                className="btn-edit"
              >
                🔑 Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content-wrapper">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account information and preferences</p>
          <div className={`profile-role-badge role-${user?.role}`}>
            {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="profile-card">
          <h2>👤 Personal Information</h2>
          {profileError && <div className="error-text">{profileError}</div>}
          {profileSuccessMessage && <div className="success-text">{profileSuccessMessage}</div>}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                id="name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                disabled={!isEditMode || profileIsLoading}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                disabled={!isEditMode || profileIsLoading}
                placeholder="Enter your email address"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio (Optional)</label>
              <input 
                id="bio" 
                type="text" 
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
                disabled={!isEditMode || profileIsLoading}
                placeholder="Tell us a bit about yourself"
              />
            </div>
            
            <div className="form-group">
              <label>Account Role</label>
              <input 
                type="text" 
                value={user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)} 
                disabled 
                style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>

            <div className="profile-actions">
              {isEditMode ? (
                <>
                  <button type="submit" className="btn-save" disabled={profileIsLoading}>
                    {profileIsLoading ? '💾 Saving...' : '💾 Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => setIsEditMode(false)} 
                    disabled={profileIsLoading}
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <button type="button" className="btn-edit" onClick={() => setIsEditMode(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Password Change Card */}
        <div className="profile-card">
          <h2>🔐 Change Password</h2>
          {passwordError && <div className="error-text">{passwordError}</div>}
          {passwordSuccessMessage && <div className="success-text">{passwordSuccessMessage}</div>}
          
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input 
                id="currentPassword" 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
                required 
                disabled={passwordIsLoading}
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input 
                id="newPassword" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                disabled={passwordIsLoading}
                placeholder="Enter a new password (min 6 characters)"
                minLength="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input 
                id="confirmNewPassword" 
                type="password" 
                value={confirmNewPassword} 
                onChange={(e) => setConfirmNewPassword(e.target.value)} 
                required 
                disabled={passwordIsLoading}
                placeholder="Confirm your new password"
                minLength="6"
              />
            </div>
            
            <div className="profile-actions">
              <button type="submit" className="btn-save" disabled={passwordIsLoading}>
                {passwordIsLoading ? '🔄 Changing...' : '🔐 Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
