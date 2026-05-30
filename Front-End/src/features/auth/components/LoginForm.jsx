import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../../components/UI/Input/Input';
import { authService } from '../services/authService';
import { useAuth } from '../../../context/AuthContext';
import GoogleLoginButton from '../../../components/UI/GoogleLoginButton/GoogleLoginButton';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to the page the user was trying to access, or home
  const from = location.state?.from?.pathname || '/';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(credentials);

      if (response.token) {
        login(response.token); // Save token via AuthContext
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-side">
      <div className="form-container">
        <h2 className="form-title">Welcome Back!</h2>
        <p style={{ color: '#64748b', marginBottom: '30px', marginTop: '-25px', fontSize: '14px' }}>
          Log into your account to continue from where you left off.
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit}>
          <Input 
            type="email" 
            placeholder="Your Email Address" 
            onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            Icon={FiLock} 
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          />

          <div className="login-options" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#ef4444', fontWeight: '600', textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="divider-container">
          <span className="divider-line"></span>
          <span className="divider-text">Or with</span>
          <span className="divider-line"></span>
        </div>

        <GoogleLoginButton onFailure={(msg) => setError(msg)} />

        <p className="login-prompt">
          Don't have an account? <Link to="/register" style={{ textDecoration: 'none' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;