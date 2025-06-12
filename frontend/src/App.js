import React, { useEffect, useState } from 'react';
import UserList from './components/UserList';

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
      <UserList users={users} />
    </div>
  );
}

export default App;
