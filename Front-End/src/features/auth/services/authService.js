import { apiFetch } from '../../../config/apiConfig';

export const authService = {
  /**
   * Register a new user
   * POST /api/auth/register
   * Body: { Name, Email, Password }
   */
  register: async (userData) => {
    const payload = {
      Name: userData.fullname,
      Email: userData.email,
      Password: userData.password,
      Role: userData.role,
    };

    return await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Login with email and password
   * POST /api/auth/login
   * Body: { Email, Password }
   * Returns: { token, message }
   */
  login: async (credentials) => {
    return await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        Email: credentials.email,
        Password: credentials.password,
      }),
    });
  },

  /**
   * Request a password reset OTP
   * POST /api/auth/forget-password
   * Body: { Email }
   */
  forgetPassword: async (email) => {
    return await apiFetch('/auth/forget-password', {
      method: 'POST',
      body: JSON.stringify({ Email: email }),
    });
  },

  /**
   * Verify the OTP code sent to email
   * POST /api/auth/verify-otp
   * Body: { Email, OtpCode }
   */
  verifyOtp: async (email, otpCode) => {
    return await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ Email: email, OtpCode: otpCode }),
    });
  },

  /**
   * Reset user password using verified OTP
   * POST /api/auth/reset-password
   * Body: { Email, OtpCode, NewPassword }
   */
  resetPassword: async (email, otpCode, newPassword) => {
    return await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ Email: email, OtpCode: otpCode, NewPassword: newPassword }),
    });
  },

  /**
   * Login with Google ID token
   * POST /api/auth/google-login
   * Body: { IdToken }
   * Returns: { token, message, username }
   */
  googleLogin: async (idToken) => {
    return await apiFetch('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ IdToken: idToken }),
    });
  },
};