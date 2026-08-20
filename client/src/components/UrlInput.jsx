import React, { useState } from 'react';

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateUrl = (value) => {
    if (!value.trim()) {
      return 'Please enter a valid URL.';
    }
    
    // Check basic structure
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!pattern.test(value.trim())) {
      return 'Please enter a valid URL.';
    }
    
    // Ensure it begins with http:// or https:// as per requirements
    if (!/^https?:\/\//i.test(value.trim())) {
      return 'Please enter a valid URL. It must begin with http:// or https://';
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const error = validateUrl(url);
    if (error) {
      setValidationError(error);
      return;
    }

    onSubmit(url.trim());
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit} noValidate>
      <div className="input-group">
        <div className="input-wrapper">
          <span className="input-icon">🔗</span>
          <input
            type="url"
            value={url}
            onChange={handleInputChange}
            placeholder="https://example.com/article"
            disabled={loading}
            className={`url-input ${validationError ? 'input-error-state' : ''}`}
            aria-label="Website URL"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (
            <span className="button-loading-content">
              <span className="spinner-mini"></span>
              Processing...
            </span>
          ) : (
            'Summarize'
          )}
        </button>
      </div>
      {validationError && (
        <div className="validation-message" role="alert">
          {validationError}
        </div>
      )}
    </form>
  );
}
