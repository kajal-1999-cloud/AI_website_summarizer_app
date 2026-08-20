import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="skeleton-container">
      <div className="loading-message-wrapper">
        <span className="spinner-main"></span>
        <p className="loading-text">Fetching webpage and generating summary...</p>
      </div>
      <div className="skeleton-card">
        <div className="skeleton-line-title"></div>
        <div className="skeleton-line-item w-85"></div>
        <div className="skeleton-line-item w-90"></div>
        <div className="skeleton-line-item w-80"></div>
        <div className="skeleton-line-item w-70"></div>
        <div className="skeleton-line-item w-75"></div>
      </div>
    </div>
  );
}
