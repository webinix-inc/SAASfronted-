/**
 * API Configuration for SaaS Admin Frontend
 * Centralized configuration to ensure proper validation
 */

const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
  throw new Error(
    '❌ REACT_APP_API_URL environment variable is required.\n' +
    'Please create a .env file in the project root with:\n' +
    'REACT_APP_API_URL=http://localhost:5000'
  );
}

// Validate URL format
try {
  new URL(API_URL);
} catch (error) {
  throw new Error(
    `❌ REACT_APP_API_URL must be a valid URL.\n` +
    `Got: "${API_URL}"\n` +
    `Expected format: http://localhost:5000 or https://api.example.com`
  );
}

console.log('✅ SaaS Admin API Configuration loaded:', { API_URL });

export { API_URL };

