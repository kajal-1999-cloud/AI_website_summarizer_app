const GeminiProvider = require('./providers/geminiProvider');

class AIService {
  constructor() {
    this.provider = null;
    this.initProvider();
  }

  /**
   * Initializes the AI Provider based on configuration.
   * To add a new provider, create a new provider class in the providers folder
   * and add it as a case in the switch block below.
   */
  initProvider() {
    const providerName = process.env.AI_PROVIDER || 'gemini';
    
    console.log(`[AI Service] Initializing with provider: ${providerName}`);

    switch (providerName.toLowerCase()) {
      case 'gemini':
        this.provider = new GeminiProvider();
        break;
      
      /* Example for future expansion (e.g. OpenAI):
      case 'openai':
        this.provider = new OpenAIProvider();
        break;
      */

      /* Example for future expansion (e.g. Groq):
      case 'groq':
        this.provider = new GroqProvider();
        break;
      */

      default:
        throw new Error(`Unsupported AI Provider configured: "${providerName}". Please check your AI_PROVIDER environment variable.`);
    }
  }

  /**
   * Summarizes the text content using the active AI provider.
   * @param {string} text - Cleaned visible webpage text.
   * @returns {Promise<string>} Concise summary content.
   */
  async summarize(text) {
    if (!this.provider) {
      throw new Error('AI Service has not been properly initialized with a provider.');
    }
    return await this.provider.summarize(text);
  }
}

// Export a singleton instance
module.exports = new AIService();
