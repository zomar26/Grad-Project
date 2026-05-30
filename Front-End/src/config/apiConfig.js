// Centralized API configuration
// Change this URL to match your .NET API launch profile
const API_BASE_URL = 'http://localhost:5284/api';
export const GOOGLE_CLIENT_ID = '625366091871-s796q2uj31hcs58s1490s89n6r2484jb.apps.googleusercontent.com';

/**
 * Authenticated fetch wrapper that auto-attaches JWT token
 * and handles common error response patterns.
 *
 * @param {string} endpoint - API endpoint path (e.g., '/auth/login')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Parse the response body (handles both JSON and plain text errors)
  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = { message: text };
  }

  if (!response.ok) {
    // Throw an error with the server's message for the UI to display
    const errorMessage = data.message || data.title || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default API_BASE_URL;
