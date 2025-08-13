import { useCallback, useEffect, useState } from 'react';
import API_URL from '../api';

// Stable speaker dashboard hook with proper dependency management
const useSpeakerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const mapStats = (apiStats) => ({
    total_videos: apiStats?.totalVideos ?? apiStats?.total_videos ?? 0,
    approved_videos: apiStats?.approvedVideos ?? apiStats?.approved_videos ?? 0,
    pending_videos: apiStats?.pendingVideos ?? apiStats?.pending_videos ?? 0,
    total_views: apiStats?.totalViews ?? apiStats?.total_views ?? 0,
    videos_this_week: apiStats?.videos_this_week ?? 0,
    videos_this_month: apiStats?.videos_this_month ?? 0,
  });

  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      setError('');
      const res = await fetch(`${API_URL}/api/speaker/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error(`Dashboard request failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      setStats(mapStats(json?.stats || {}));
      setRecentActivity(Array.isArray(json?.recentVideos) ? json.recentVideos : []);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
      setError(e.message || 'Failed to load dashboard');
    }
  }, []); // No dependencies to prevent infinite loops

  const fetchVideos = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/speaker/videos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        // Don't throw error for videos - just log it
        console.warn(`Videos request failed: ${res.status} ${res.statusText}`);
        setVideos([]);
        return;
      }
      
      const json = await res.json();
      setVideos(Array.isArray(json?.videos) ? json.videos : Array.isArray(json) ? json : []);
    } catch (e) {
      console.error('Videos fetch error:', e);
      // Don't set error state for videos, just log
      setVideos([]);
    }
  }, []); // No dependencies to prevent infinite loops

  const loadAll = useCallback(async () => {
    setLoading(true);
    
    // Fetch dashboard first, then videos
    await fetchDashboard();
    await fetchVideos();
    
    setLoading(false);
  }, [fetchDashboard, fetchVideos]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    
    await fetchDashboard();
    await fetchVideos();
    
    setRefreshing(false);
  }, [fetchDashboard, fetchVideos]);

  const deleteVideo = useCallback(async (videoId) => {
    const token = localStorage.getItem('token');
    if (!token) return { success: false, error: 'No token' };

    try {
      const res = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error('Failed to delete video');
      
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      setStats((s) => (s ? { ...s, total_videos: Math.max(0, (s.total_videos || 0) - 1) } : s));
      
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, []);

  // Single effect with stable dependencies
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadAll();
    } else {
      setLoading(false);
      setError('Please log in to view dashboard');
    }
  }, []); // Empty dependency array - only run once on mount

  return {
    stats,
    videos,
    recentActivity,
    loading,
    refreshing,
    error,
    refresh: refreshData,
    deleteVideo,
    fetchStats: fetchDashboard,
  };
};

export default useSpeakerDashboard;
