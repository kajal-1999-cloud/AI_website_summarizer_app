const axios = require('axios');
const cheerio = require('cheerio');
const dns = require('dns');

// Prefer IPv4 DNS resolution to prevent ENETUNREACH errors on machines without active IPv6 routing.
// Node will still fallback to IPv6 if IPv4 addresses are unavailable or do not connect.
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

/**
 * Scrapes a webpage and extracts visible text, removing boilerplate like scripts, styles, nav, and footers.
 * @param {string} url - The URL of the webpage to scrape.
 * @returns {Promise<string>} Cleaned visible text.
 */
async function scrapeWebpage(url) {
  try {
    // 1. Fetch webpage HTML with a timeout and user agent
    const response = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });

    if (!response.data || typeof response.data !== 'string') {
      throw new Error('No HTML content returned from the webpage.');
    }

    // 2. Load the HTML content with Cheerio
    const $ = cheerio.load(response.data);

    // 3. Remove non-visible or boiler-plate content
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    $('iframe').remove();
    $('svg').remove();
    $('canvas').remove();
    $('header').remove();
    $('footer').remove();
    $('nav').remove();
    $('aside').remove();
    $('.navigation').remove();
    $('.menu').remove();
    $('.footer').remove();
    $('.header').remove();
    $('.sidebar').remove();
    
    // 4. Extract raw text from the body (or HTML if no body)
    let bodyText = $('body').length > 0 ? $('body').text() : $.text();

    // 5. Clean whitespace: replace tabs, newlines, multiple spaces with a single space
    // and remove excessive line breaks.
    let cleanedText = bodyText
      .replace(/[\r\n\t]+/g, ' ')       // replace newlines and tabs with spaces
      .replace(/\s+/g, ' ')            // replace multiple spaces with a single space
      .trim();

    // 6. Validate extracted content
    if (!cleanedText || cleanedText.length < 100) {
      throw new Error('The webpage contains insufficient readable text (less than 100 characters).');
    }

    // 7. Truncate content to avoid overloading the AI model context limit
    // 12000 characters is about 2000-3000 words, which is a perfect length for a high-quality summary.
    const maxChars = 12000;
    if (cleanedText.length > maxChars) {
      cleanedText = cleanedText.substring(0, maxChars) + '... [Content Truncated for AI Summary]';
    }

    return cleanedText;
  } catch (error) {
    console.error(`Scraper Service Error for URL ${url}:`, error.message);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request to the website timed out. The webpage is taking too long to load.');
    }
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const status = error.response.status;
      if (status === 403 || status === 401) {
        throw new Error('Access denied. The website blocks automated requests.');
      }
      if (status === 404) {
        throw new Error('The requested webpage was not found (404 error).');
      }
      throw new Error(`The website returned an error status code: ${status}`);
    }
    if (error.request) {
      // The request was made but no response was received
      throw new Error('Unable to reach the website. Please check if the URL is active and try again.');
    }
    
    // Pass other specific errors along (like "insufficient readable text" or custom ones)
    throw error;
  }
}

module.exports = { scrapeWebpage };
