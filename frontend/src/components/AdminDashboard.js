import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [notAdmin, setNotAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') {
        setNotAdmin(true);
        return;
      }
    } catch (e) {
      setError('Invalid token');
      return;
    }
    axios
      .get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setStats(res.data))
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to fetch stats');
      });
  }, []);

  const handleApproval = async (id, approved) => {
    const token = localStorage.getItem('token');
    try {
      if (approved) {
        await axios.patch(
          `/api/admin/videos/${id}/approval`,
          { approved: true },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.delete(`/api/admin/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setStats((prev) => ({
        ...prev,
        pendingVideos: prev.pendingVideos.filter((v) => v.id !== id),
      }));
    } catch (err) {
      console.error('Failed to update video status', err);
    }
  };

  if (notAdmin) {
    return <p>Admin access required.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stats) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Users by Role</h3>
      <ul>
        {stats.usersByRole.map((u) => (
          <li key={u.role}>{u.role}: {u.count}</li>
        ))}
      </ul>
      <h3>Subscription Status</h3>
      <ul>
        {stats.subscriptionStats.map((s) => (
          <li key={s.status}>{s.status}: {s.count}</li>
        ))}
      </ul>
      <h3>Pending Videos</h3>
      {stats.pendingVideos.length === 0 ? (
        <p>No pending videos.</p>
      ) : (
        <ul>
          {stats.pendingVideos.map((v) => (
            <li key={v.id}>
              {v.title}{' '}
              <button onClick={() => handleApproval(v.id, true)}>Approve</button>{' '}
              <button onClick={() => handleApproval(v.id, false)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
