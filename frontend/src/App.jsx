
import React from 'react';
import Header from './components/Header';
import Composer from './components/Composer';
import './App.css';

function App() {
  // A real app would have a more complex state management for user authentication
  const user = { id: 'user_123', name: 'Demo User' }; // Placeholder user

  return (
    <div className="app-container">
      <Header user={user} />
      <main>
        <Composer userId={user.id} />
      </main>
    </div>
  );
}

export default App;
