# AI-Driven Website Summariser

A complete, clean, and modern single-page web application that extracts the visible text content of any public webpage, cleans out scripts, styling, navigation boilerplate, and uses an abstracted AI Service to generate a concise, factual summary.

Designed with a swappable AI provider architecture, the application initially integrates the **Google Gemini API**, but can easily be configured to work with other platforms like OpenAI, Groq, or local LLMs (Ollama) without altering the scraping, routing, or frontend code.

---

## Architecture Flow

```text
User Input (URL)
       │
       ▼
┌──────────────┐
│   React UI   │
└──────┬───────┘
       │ HTTP POST (url)
       ▼
┌──────────────────────────────────────┐
│             Backend API              │
│       (URL & Scraping layer)         │
└──────┬───────────────────────────────┘
       │ 1. Fetches webpage (Axios)
       │ 2. Extracts visible text (Cheerio)
       ▼
┌──────────────────────────────────────┐
│         AI Service Router            │
│          (aiService.js)              │
└──────┬───────────────────────────────┘
       │ Resolves provider dynamically
       │ (e.g., via process.env.AI_PROVIDER)
       ▼
┌──────────────────────────────────────┐
│          Gemini Provider             │
│        (geminiProvider.js)           │
└──────┬───────────────────────────────┘
       │ Sends prompt + cleaned content
       │ to model (e.g. gemini-2.5-flash)
       ▼
┌──────────────┐
│  Gemini API  │
└──────┬───────┘
       │ Returns plain text bullets
       ▼
┌──────────────┐
│   React UI   │
│ (Renders UI) │
└──────────────┘
```

---

## Features

* **High-Fidelity UI**: Designed with a futuristic dark-theme using glassmorphism, animated glowing background gradients, and interactive hover states.
* **Smart Content Scraper**: Fetches HTML page sources with customized headers and timeouts, and cleans tags like `<script>`, `<style>`, `<nav>`, `<footer>`, and `<aside>` to target body readable text.
* **AI Provider Abstraction**: A central `aiService` that dynamically loads providers. Swapping providers requires no changes to API endpoints or components.
* **Visual Loading States**: Display of premium skeleton loader bars while content is processing.
* **Dynamic Results & Utilities**: Renders summary bullet points nicely and includes a copy-to-clipboard function.
* **Robust Error Management**: Maps server errors, bad URLs, scrapers blocks, and rate-limits to neat user-facing alerts.

---

## Tech Stack

* **Frontend**: React (Vite-powered, ES6 Javascript), Vanilla CSS (custom design system and animations).
* **Backend**: Node.js, Express.js.
* **Scraping Utilities**: Axios (http agent) & Cheerio (DOM extraction).
* **AI Integration**: Google Gen AI Node.js SDK (`@google/generative-ai`).

---

## AI Usage & Design Strategy

### Why AI?
Unlike traditional regex-based scrapers or simple word count extractors, an AI model excels at distilling long, complex articles into high-level main points, extracting the core arguments, and maintaining readability.

### Generation & Prompt Safety
We instruct the Gemini model to behave strictly as an accurate content summarizer. Prompt rules enforce that it:
1. Summarizes **only** the provided context.
2. Formats output as **5 to 8 bullet points**.
3. Does **not** invent facts or hallucinate external context.
4. Uses lower model temperatures (`0.1`) to ensure high factual alignment.

---

## Environment Variables

Configure configurations in `/server/.env` (or copy from `.env.example` at the root):

```env
# Server Configurations
PORT=5000

# Centralized AI Configuration (e.g., gemini)
AI_PROVIDER=gemini

# Google Gemini Configurations
# Obtain key: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

## Setup Instructions

### Prerequisites
* Node.js (v18.0.0 or higher recommended)
* npm (v9.0.0 or higher)

### 1. Initialize and Install Dependencies
In the root directory, run the concurrent installation command:
```bash
npm run install:all
```
This automatically runs npm installs for the **root**, the **client**, and the **server**.

### 2. Configure environment variables
1. Open the `server/` directory.
2. Locate the `.env` file (or duplicate `.env.example` into a new `.env` file).
3. Replace the `GEMINI_API_KEY` placeholder with your actual Gemini API key from Google AI Studio.

### 3. Start the application
Run the following command in the project root to start both Express and React servers simultaneously:
```bash
npm run dev
```

* **Backend server** runs on [http://localhost:5000](http://localhost:5000)
* **Frontend React client** runs on [http://localhost:5173](http://localhost:5173)

Open your browser to [http://localhost:5173](http://localhost:5173) to run the application.

---

## Swapping AI Providers (How It Works)

The application separates code dependencies strictly. To replace Gemini with another provider (e.g. OpenAI or Groq):

1. **Create the Provider Class**: Add a new provider file inside `server/services/ai/providers/` (e.g. `openaiProvider.js`):
   ```javascript
   class OpenAIProvider {
     async summarize(text) {
       // Call OpenAI SDK here and return text summary
     }
   }
   module.exports = OpenAIProvider;
   ```
2. **Update the Router**: Open `server/services/ai/aiService.js`, import your new provider, and add it to the initialization block:
   ```javascript
   const OpenAIProvider = require('./providers/openaiProvider');
   
   // In initProvider():
   case 'openai':
     this.provider = new OpenAIProvider();
     break;
   ```
3. **Change the Environment Variable**: In `server/.env`, modify:
   ```env
   AI_PROVIDER=openai
   ```

No other files (API endpoints, components, or client services) will need to be touched.
