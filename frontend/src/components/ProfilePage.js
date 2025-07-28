import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import API_URL from '../api';
import './ProfilePage.css';

function ProfilePage() {
  const { user, token, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileIsLoading, setProfileIsLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordIsLoading, setPasswordIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Weak', color: '#ef4444' };
      case 2: return { text: 'Fair', color: '#f97316' };
      case 3: return { text: 'Good', color: '#eab308' };
      case 4:
      case 5: return { text: 'Strong', color: '#22c55e' };
      default: return { text: '', color: '' };
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileIsLoading(true);
    setProfileError('');
    setProfileSuccessMessage('');

    try {
      const res = await axios.patch(
        `${API_URL}/api/profile`,
        {
          name: profileData.name.trim(),
          email: profileData.email.trim(),
          bio: profileData.bio.trim(),
          location: profileData.location.trim(),
          website: profileData.website.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordStrength < 2) {
      setPasswordError('Please choose a stronger password.');
      return;
    }

    setPasswordIsLoading(true);

    try {
      await axios.patch(
        `${API_URL}/api/profile/password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setPasswordStrength(0);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password.');
    } finally {
      setPasswordIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return '👑';
      case 'speaker': return '🎤';
      case 'subscriber': return '🎧';
      default: return '👤';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#8b5cf6';
      case 'speaker': return '#10b981';
      case 'subscriber': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-wrapper">
        <div className="auth-required">
          <div className="auth-icon">🔒</div>
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile.</p>
          <a href="/login" className="btn btn-primary">Go to Login</a>
        </div>
      </div>
    );
  }

  const strengthIndicator = getPasswordStrengthText();

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">{getRoleIcon(user?.role)}</span>
          </div>
          <div className="profile-info">
            <h1>{profileData.name || 'Anonymous User'}</h1>
            <div 
              className="role-badge" 
              style={{ backgroundColor: getRoleColor(user?.role) }}
            >
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </div>
            <p className="profile-email">{profileData.email}</p>
          </div>
        </div>

        <div className="profile-content">
          {/* Profile Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>📝 Profile Information</h2>
              {!isEditMode && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditMode(true)}
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {profileError && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {profileError}
              </div>
            )}
            
            {profileSuccessMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {profileSuccessMessage}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-container">
                    <span className="input-icon">👤</span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditMode || profileIsLoading}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-container">
                    <span className="input-icon">📧</span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditMode || profileIsLoading}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <div className="input-container">
                    <span className="input-icon">📍</span>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      disabled={!isEditMode || profileIsLoading}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <div className="input-container">
                    <span className="input-icon">🌐</span>
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      disabled={!isEditMode || profileIsLoading}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <div className="input-container">
                  <span className="input-icon">✍️</span>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={!isEditMode || profileIsLoading}
                    placeholder="Tell us about yourself..."
                    rows="4"
                  />
                </div>
              </div>

              {isEditMode && (
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={profileIsLoading}
                  >
                    {profileIsLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>💾</span>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setIsEditMode(false)}
                    disabled={profileIsLoading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Password Change Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>🔐 Change Password</h2>
            </div>

            {passwordError && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {passwordError}
              </div>
            )}
            
            {passwordSuccessMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {passwordSuccessMessage}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={passwordIsLoading}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                    disabled={passwordIsLoading}
                  >
                    {showPasswords.current ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-container">
                  <span className="input-icon">🆕</span>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={passwordIsLoading}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={passwordIsLoading}
                  >
                    {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {passwordData.newPassword && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                          backgroundColor: strengthIndicator.color
                        }}
                      ></div>
                    </div>
                    <span style={{ color: strengthIndicator.color }}>
                      {strengthIndicator.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <div className="input-container">
                  <span className="input-icon">🔐</span>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                    disabled={passwordIsLoading}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={passwordIsLoading}
                  >
                    {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                  </button>
                  {passwordData.confirmNewPassword && (
                    <span className={`match-indicator ${passwordData.newPassword === passwordData.confirmNewPassword ? 'match' : 'no-match'}`}>
                      {passwordData.newPassword === passwordData.confirmNewPassword ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={passwordIsLoading}
                >
                  {passwordIsLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Changing...
                    </>
                  ) : (
                    <>
                      <span>🔄</span>
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
