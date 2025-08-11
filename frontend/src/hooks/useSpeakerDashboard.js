import { useEffect, useState, useCallback } from 'react';
import API_URL from '../api';

export default function useSpeakerDashboard(token) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/speaker/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load dashboard');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token, fetchDashboard]);

  return { data, loading, error, refresh: fetchDashboard };
}
