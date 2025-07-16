import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useAuth } from './useAuth';

export const useMyLibrary = () => {
  const { token, isAuthenticated, isSpeaker, isAdmin } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in, do nothing. The component will handle this.
      setLoading(false);
      return;
    }

    if (isSpeaker || isAdmin) {
      setError('This feature is available for learners only.');
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/api/bookmarks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
        setError('Failed to load your library. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [isAuthenticated, token, isSpeaker, isAdmin]);

  return { videos, loading, error };
};