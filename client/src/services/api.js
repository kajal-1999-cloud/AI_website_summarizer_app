const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Sends a URL to the backend to get a website summary.
 * @param {string} url - The target website URL.
 * @returns {Promise<{summary: string, sourceUrl: string}>} Response containing summary.
 */
export async function fetchSummary(url) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate summary.');
    }

    return data;
  } catch (error) {
    console.error('API Client Error:', error);
    throw error;
  }
}
