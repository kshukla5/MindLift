import React, { useEffect, useState } from 'react';
import UserList from './components/UserList';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import VideoGrid from './components/VideoGrid';
import MyLibrary from './components/MyLibrary';
import AdminDashboard from './components/AdminDashboard';
import API_URL from './api';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>MindLift Users</h1>
      <SignupForm />
      <LoginForm />
      <UserList users={users} />
      <VideoGrid />
      <MyLibrary />
      <AdminDashboard />
    </div>
  );
}

export default App;
