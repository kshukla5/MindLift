import React, { useEffect, useState } from 'react';
import UserList from './components/UserList';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import VideoGrid from './components/VideoGrid';
import MyLibrary from './components/MyLibrary';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
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
    </div>
  );
}

export default App;
