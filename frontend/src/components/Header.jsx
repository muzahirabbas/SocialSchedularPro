
import React from 'react';

function Header({ user }) {
  return (
    <header className="app-header">
      <h1>Scheduler</h1>
      <div className="auth-buttons">
        {user ? (
          <span>Welcome, {user.name}</span>
        ) : (
          <a href="/api/auth/google">Login</a> // Example login link
        )}
        {/* Links to initiate OAuth flow handled by the worker */}
        <a href="/api/auth/twitter" title="Connect Twitter">Connect X</a>
        <a href="/api/auth/linkedin" title="Connect LinkedIn">Connect LinkedIn</a>
      </div>
    </header>
  );
}

export default Header;
