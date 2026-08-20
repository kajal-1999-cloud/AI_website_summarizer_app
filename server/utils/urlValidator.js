/**
 * Validates whether a given string is a valid HTTP/HTTPS URL.
 * @param {string} urlString - The URL string to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }
  try {
    const parsedUrl = new URL(urlString);
    // Only allow http and https protocols
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

module.exports = { isValidUrl };
