import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import API_URL from '../api';
import { useAuth } from './useAuth';

export const useVideoGrid = () => {
  const { token, isAuthenticated, isSpeaker, isAdmin } = useAuth();
  const [allVideos, setAllVideos] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all data in parallel
      const videosPromise = axios.get(`${API_URL}/api/videos`);
      const bookmarksPromise =
        isAuthenticated && token && !isSpeaker && !isAdmin
          ? axios.get(`${API_URL}/api/bookmarks`, { headers: { Authorization: `Bearer ${token}` } })
          : Promise.resolve({ data: [] });

      const [videosRes, bookmarksRes] = await Promise.all([videosPromise, bookmarksPromise]);

      setAllVideos(videosRes.data.filter((v) => v.approved));
      setBookmarkedIds(new Set(bookmarksRes.data.map((v) => v.id)));
    } catch (err) {
      console.error('Failed to fetch videos or bookmarks', err);
      setError('Failed to load video content. Please try again later.');
    } finally {
      setLoading(false);
    }
    };
    fetchInitialData();
  }, [isAuthenticated, token, isSpeaker, isAdmin]);

  // Derived state: Filter and group videos based on searchTerm
  const videosByCategory = useMemo(() => {
    const filtered = allVideos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.category && video.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.reduce((acc, video) => {
        const cat = video.category || 'Uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(video);
        return acc;
    }, {});
  }, [allVideos, searchTerm]);

  const handleBookmark = useCallback(async (videoId, isBookmarked) => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark videos');
      return;
    }
    if (isSpeaker || isAdmin) {
      alert('This feature is for learners only.');
      return;
    }
    try {
      const newBookmarkedIds = new Set(bookmarkedIds);
      if (isBookmarked) {
        await axios.delete(`${API_URL}/api/bookmarks/${videoId}`, { headers: { Authorization: `Bearer ${token}` } });
        newBookmarkedIds.delete(videoId);
      } else {
        await axios.post(`${API_URL}/api/bookmarks`, { videoId }, { headers: { Authorization: `Bearer ${token}` } });
        newBookmarkedIds.add(videoId);
      }
      setBookmarkedIds(newBookmarkedIds);
    } catch (err) {
      console.error('Bookmark error', err);
    }
  }, [isAuthenticated, token, bookmarkedIds, isSpeaker, isAdmin]);

  return { videosByCategory, bookmarkedIds, handleBookmark, loading, error, searchTerm, setSearchTerm };
};