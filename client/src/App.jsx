import React, { useState } from 'react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import LoadingSkeleton from './components/LoadingSkeleton';
import SummaryResult from './components/SummaryResult';
import ErrorMessage from './components/ErrorMessage';
import { fetchSummary } from './services/api';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleUrlSubmit = async (url) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await fetchSummary(url);
      setResult(data);
    } catch (err) {
      setError(err.message || 'AI summarisation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="glass-panel">
        {loading && <LoadingSkeleton />}
        
        {!loading && !result && (
          <UrlInput onSubmit={handleUrlSubmit} loading={loading} />
        )}
        
        {!loading && error && <ErrorMessage message={error} />}
        
        {!loading && result && (
          <SummaryResult
            summary={result.summary}
            sourceUrl={result.sourceUrl}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
