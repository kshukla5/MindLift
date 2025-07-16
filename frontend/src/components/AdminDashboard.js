import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdminDashboard } from '../hooks/useAdminDashboard';

function AdminDashboard() {
  const { token, isAdmin } = useAuth();
  const { stats, loading, error, handleApproval } = useAdminDashboard(token);

  if (!isAdmin) {
    return <p>Admin access required.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!stats) {
    return <p>No stats available.</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
              {v.title}
              <button onClick={() => handleApproval(v.id, true)}>Approve</button>
              <button onClick={() => handleApproval(v.id, false)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
