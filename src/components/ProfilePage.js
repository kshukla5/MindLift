import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import API_URL from '../api';
import './ProfilePage.css';

function ProfilePage() {
  const { user, token, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
        { name, email },
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
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content-wrapper">
        <div className="profile-card">
          <h2>My Profile</h2>
          {profileError && <p className="error-text">{profileError}</p>}
          {profileSuccessMessage && <p className="success-text">{profileSuccessMessage}</p>}

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditMode || profileIsLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditMode || profileIsLoading} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1)} disabled />
            </div>

            <div className="profile-actions">
              {isEditMode ? (
                <>
                  <button type="submit" className="btn-save" disabled={profileIsLoading}>
                    {profileIsLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={() => setIsEditMode(false)} disabled={profileIsLoading}>
                    Cancel
                  </button>
                </>
              ) : (
                <button type="button" className="btn-edit" onClick={() => setIsEditMode(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="profile-card">
          <h2>Change Password</h2>
          {passwordError && <p className="error-text">{passwordError}</p>}
          {passwordSuccessMessage && <p className="success-text">{passwordSuccessMessage}</p>}
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required disabled={passwordIsLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required disabled={passwordIsLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required disabled={passwordIsLoading} />
            </div>
            <div className="profile-actions">
              <button type="submit" className="btn-save" disabled={passwordIsLoading}>
                {passwordIsLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;