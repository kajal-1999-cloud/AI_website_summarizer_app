require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { isValidUrl } = require('./utils/urlValidator');
const { scrapeWebpage } = require('./services/scraperService');
const aiService = require('./services/ai/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Main Summarization API Endpoint
app.post('/api/summarize', async (req, res) => {
  const { url } = req.body;

  console.log(`[API Request] POST /api/summarize - URL: ${url}`);

  // 1. Basic input validation
  if (!url) {
    return res.status(400).json({ error: 'Please enter a URL.' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Please enter a valid URL.' });
  }

  try {
    // 2. Fetch and extract text content from webpage
    console.log(`[Scraper] Scraping content from: ${url}`);
    const cleanedText = await scrapeWebpage(url);
    console.log(`[Scraper] Successfully extracted ${cleanedText.length} characters of readable text.`);

    // 3. Generate summary via centralized AI Service
    console.log(`[AI Service] Generating summary...`);
    const summary = await aiService.summarize(cleanedText);
    console.log(`[AI Service] Summary generated successfully.`);

    // 4. Return response
    return res.status(200).json({
      summary,
      sourceUrl: url
    });

  } catch (error) {
    console.error(`[API Error] Summarization failed for URL "${url}":`, error.message);

    // Determine appropriate error response status code
    let statusCode = 500;
    let userFriendlyMessage = 'An unexpected error occurred. Please try again.';

    if (error.message.includes('insufficient readable text') || error.message.includes('insufficient readable content')) {
      statusCode = 400;
      userFriendlyMessage = 'The webpage contains insufficient readable content.';
    } else if (error.message.includes('timed out') || error.message.includes('taking too long')) {
      statusCode = 504;
      userFriendlyMessage = 'Unable to fetch this webpage.';
    } else if (error.message.includes('blocks automated requests') || error.message.includes('Access denied')) {
      statusCode = 403;
      userFriendlyMessage = 'Unable to fetch this webpage. The website blocks automated requests.';
    } else if (error.message.includes('not found') || error.message.includes('404')) {
      statusCode = 404;
      userFriendlyMessage = 'Unable to fetch this webpage.';
    } else if (error.message.includes('reach the website')) {
      statusCode = 502;
      userFriendlyMessage = 'Unable to fetch this webpage.';
    } else if (error.message.includes('AI summarisation failed') || error.message.includes('Gemini AI service error')) {
      statusCode = 502;
      userFriendlyMessage = 'AI summarisation failed. Please try again.';
    }

    return res.status(statusCode).json({ error: userFriendlyMessage });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', provider: process.env.AI_PROVIDER || 'gemini' });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  AI Web Summariser Backend is active!`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Active Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
  console.log(`==================================================`);
});
