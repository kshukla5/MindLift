import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useAuth } from './useAuth';

export const useLearnerDashboard = () => {
  const { token, user } = useAuth();
  const [learnerStats, setLearnerStats] = useState(null);
  const [platformStats, setPlatformStats] = useState(null);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLearnerData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setError('');
      const [learnerResponse, platformResponse] = await Promise.all([
        axios.get(`${API_URL}/api/bookmarks/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/learner/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setLearnerStats(learnerResponse.data.stats);
      setRecentBookmarks(learnerResponse.data.recentBookmarks || []);
      setCategoryBreakdown(learnerResponse.data.categoryBreakdown || []);
      
      setPlatformStats(platformResponse.data.platformStats);
      setPopularCategories(platformResponse.data.popularCategories || []);
      setRecentVideos(platformResponse.data.recentVideos || []);
    } catch (err) {
      console.error('Learner dashboard fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchLearnerData();
  };

  const addBookmark = async (videoId) => {
    try {
      await axios.post(`${API_URL}/api/bookmarks`, { videoId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh data to get updated stats
      await refreshData();
      
      return { success: true };
    } catch (err) {
      console.error('Add bookmark error:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to add bookmark' 
      };
    }
  };

  const removeBookmark = async (videoId) => {
    try {
      await axios.delete(`${API_URL}/api/bookmarks/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setRecentBookmarks(prev => prev.filter(bookmark => bookmark.id !== videoId));
      
      // Refresh data to get updated stats
      await refreshData();
      
      return { success: true };
    } catch (err) {
      console.error('Remove bookmark error:', err);
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to remove bookmark' 
      };
    }
  };

  useEffect(() => {
    fetchLearnerData();
  }, [token]);

  return {
    learnerStats,
    platformStats,
    recentBookmarks,
    categoryBreakdown,
    popularCategories,
    recentVideos,
    loading,
    error,
    refreshing,
    refreshData,
    addBookmark,
    removeBookmark
  };
};
