import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import API_URL from '../api';

export const useAdminDashboard = (token) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchStats();
    } else {
      setLoading(false); // If no token, we are not loading.
    }
  }, [token, fetchStats]);

  const handleApproval = useCallback(async (videoId, approved) => {
    try {
      if (approved) {
        await axios.patch(`${API_URL}/api/admin/videos/${videoId}/approval`, { approved: true }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.delete(`${API_URL}/api/admin/videos/${videoId}`, { headers: { Authorization: `Bearer ${token}` } });
      }
      setStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          pendingVideos: prev.pendingVideos.filter((v) => v.id !== videoId),
        };
      });
    } catch (err) {
      console.error('Failed to update video status', err);
      setError(err.response?.data?.error || 'Failed to update video status.');
    }
  }, [token]);

  return { stats, loading, error, handleApproval };
};