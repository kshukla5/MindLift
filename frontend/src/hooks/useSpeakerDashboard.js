import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useAuth } from './useAuth';

export const useSpeakerDashboard = () => {
  const { token, isSpeaker } = useAuth();
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    if (!token || !isSpeaker) {
      setLoading(false);
      return;
    }

    try {
      setError('');
      const response = await axios.get(`${API_URL}/api/speaker/videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setVideos(response.data.videos || []);
      setStats(response.data.stats || null);
      setRecentActivity(response.data.recentActivity || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const deleteVideo = async (videoId) => {
    try {
      await axios.delete(`${API_URL}/api/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setVideos(prev => prev.filter(video => video.id !== videoId));
      
      // Refresh stats
      await refreshData();
      
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to delete video' 
      };
    }
  };

  const updateVideo = async (videoId, updates) => {
    try {
      const response = await axios.put(`${API_URL}/api/videos/${videoId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setVideos(prev => 
        prev.map(video => 
          video.id === videoId ? { ...video, ...response.data } : video
        )
      );
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Update error:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update video' 
      };
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token, isSpeaker]);

  return {
    stats,
    videos,
    recentActivity,
    loading,
    error,
    refreshing,
    refreshData,
    deleteVideo,
    updateVideo,
    fetchDashboardData
  };
};
