const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiProvider {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Standard default to gemini-2.5-flash
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  /**
   * Generates a concise webpage summary using Google Gemini API.
   * @param {string} text - The cleaned webpage text content.
   * @returns {Promise<string>} Summary in the form of plain text bullet points.
   */
  async summarize(text) {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.modelName });
      
      const prompt = `
You are an expert content summarizer. Your task is to analyze the text scraped from a webpage and provide a clean, highly readable, and professional summary that helps a reader understand the website's core purpose.

Analyze the webpage text and extract exactly 5 to 8 bullet points. Each bullet point must:
1. Be a complete sentence.
2. Be highly informative and specific, explaining what the company/website is, its main purpose, its products/services, target users, or key capabilities. Avoid generic statements.
3. Contain approximately 15 to 30 words.
4. Start with a dash and space ("- ") followed by the sentence.
5. Use plain text only. Do not use bold (**), italics (*), headers (#), or any markdown formatting.
6. Only use information directly stated in the webpage content below. Do not invent details or assume anything not present. Do not repeat information across bullets.

Webpage content to summarize:
---
${text}
---
`;

      // We omit maxOutputTokens from generationConfig because some API gateways/proxies 
      // misinterpret or scale down maxOutputTokens (e.g. capping at 30-76 tokens), causing 
      // premature truncation. Leaving it to the model's default limit and enforcing length 
      // via the prompt constraints (5-8 sentences, 15-30 words each) results in complete, 
      // high-quality summaries.
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Low temperature for high factual accuracy
        }
      });
      
      const response = result.response;
      const responseText = response.text();
      
      // Log diagnostic details as requested by the user
      console.log('Gemini API finishReason:', response.candidates?.[0]?.finishReason);
      console.log('Gemini API candidatesTokenCount:', response.usageMetadata?.candidatesTokenCount);
      console.log('Gemini API raw response.text():\n', responseText);
      
      if (!responseText) {
        throw new Error('Gemini API returned an empty response.');
      }
      
      return responseText.trim();
    } catch (error) {
      console.error('Gemini Provider Error:', error);
      throw new Error(`Gemini AI service error: ${error.message}`);
    }
  }
}
console.log("gemini model", process.env.GEMINI_MODEL)

module.exports = GeminiProvider;
