import React, { useState } from 'react';

export default function SummaryResult({ summary, sourceUrl, onReset }) {
  const [copied, setCopied] = useState(false);

  // Split raw bullet text into an array of clean points
  const points = summary
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter((line) => line.length > 0);

  console.log("points", points)
  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="summary-result-card">
      <div className="card-top-bar">
        <div className="source-badge">
          <span className="source-badge-label">Source Webpage:</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="source-badge-link"
            title={sourceUrl}
          >
            {sourceUrl} <span className="link-arrow">↗</span>
          </a>
        </div>
        <button
          onClick={handleCopy}
          className={`copy-button-ui ${copied ? 'copy-success' : ''}`}
          aria-label="Copy summary to clipboard"
        >
          {copied ? '✓ Copied!' : '📋 Copy Summary'}
        </button>
      </div>

      <div className="summary-body">
        <h2 className="summary-body-title">Webpage Summary</h2>
        <ul className="summary-points-list">
          {points.map((point, index) => (
            <li key={index} className="summary-point-item">
              <span className="point-spark">✦</span>
              <span className="point-text">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-bottom-actions">
        <button onClick={onReset} className="secondary-action-button">
          Summarize Another Webpage
        </button>
      </div>
    </div>
  );
}
