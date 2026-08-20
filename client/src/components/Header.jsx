import React from 'react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <span className="logo-spark">✨</span>
        <h1 className="app-title">AI Website Summariser</h1>
      </div>
      <p className="app-description">
        Enter any public URL and get a concise AI-generated summary.
      </p>
    </header>
  );
}
