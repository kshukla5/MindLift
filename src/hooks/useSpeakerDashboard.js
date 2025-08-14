import { useCallback, useEffect, useMemo, useState } from 'react';
import API_URL from '../api';

// Provide both named and default export signatures expected by components
export const useSpeakerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const token = useMemo(() => localStorage.getItem('token'), []);
  const authHeaders = useMemo(() => token ? { Authorization: `Bearer ${token}` } : {}, [token]);

  const mapStats = (apiStats) => ({
    total_videos: Number(apiStats?.totalVideos ?? apiStats?.total_videos ?? 0),
    approved_videos: Number(apiStats?.approvedVideos ?? apiStats?.approved_videos ?? 0),
    pending_videos: Number(apiStats?.pendingVideos ?? apiStats?.pending_videos ?? 0),
    total_views: Number(apiStats?.totalViews ?? apiStats?.total_views ?? 0),
    videos_this_week: Number(apiStats?.videos_this_week ?? 0),
    videos_this_month: Number(apiStats?.videos_this_month ?? 0),
  });

  const fetchDashboard = useCallback(async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/speaker/dashboard`, { headers: authHeaders });
      if (!res.ok) throw new Error('Failed to load dashboard');
      const json = await res.json();
      setStats(mapStats(json?.stats || {}));
      setRecentActivity(Array.isArray(json?.recentVideos) ? json.recentVideos : []);
    } catch (e) {
      setError(e.message || 'Failed to load dashboard');
    }
  }, [authHeaders]);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/speaker/videos`, { headers: authHeaders });
      if (!res.ok) throw new Error('Failed to fetch videos');
      const json = await res.json();
      setVideos(Array.isArray(json?.videos) ? json.videos : Array.isArray(json) ? json : []);
    } catch (e) {
      // don't override error from dashboard if exists
      if (!error) setError(e.message || 'Failed to fetch videos');
    }
  }, [authHeaders, error]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchDashboard(), fetchVideos()]);
    setLoading(false);
  }, [fetchDashboard, fetchVideos]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboard(), fetchVideos()]);
    setRefreshing(false);
  }, [fetchDashboard, fetchVideos]);

  const deleteVideo = useCallback(async (videoId) => {
    try {
      const res = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to delete video');
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      // Optimistically update stats
      setStats((s) => (s ? { ...s, total_videos: Math.max(0, (s.total_videos || 0) - 1) } : s));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }, [authHeaders]);

  useEffect(() => {
    if (token) {
      loadAll();
    } else {
      setLoading(false);
      setError('Please log in to view your dashboard.');
    }
  }, [token, loadAll]);

  return { stats, videos, recentActivity, loading, error, refreshing, refreshData, deleteVideo };
};

export default function useSpeakerDashboardDefault() {
  return useSpeakerDashboard();
}
