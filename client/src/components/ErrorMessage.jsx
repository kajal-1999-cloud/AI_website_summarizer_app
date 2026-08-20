import React from 'react';

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-alert-banner" role="alert">
      <span className="error-alert-icon">⚠️</span>
      <p className="error-alert-text">{message}</p>
    </div>
  );
}
