import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../../components/UI/Input/Input';
import { authService } from '../services/authService';
import GoogleLoginButton from '../../../components/UI/GoogleLoginButton/GoogleLoginButton';

const SignUpForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (loading) return;
    setLoading(true);

    // Internet check
    if (!navigator.onLine) {
      setError("No internet connection.");
      setLoading(false);
      return;
    }

    // Full name validation
    if (!formData.fullname.trim()) {
      setError("Full name is required.");
      setLoading(false);
      return; 
    }

    // Email validation
    if (!formData.email.trim()) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Password validation
    if (!formData.password.trim()) {
      setError("Password is required.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    
    if (!hasUppercase || !hasNumber) {
      setError("Password must contain at least one uppercase letter and one number.");
      setLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setError("You must accept the terms and guidelines.");
      setLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      if (err.message?.toLowerCase().includes("exists")){
      setError("An account with this email already exists.");
      } else {
      setError(err.message || 'Registration failed. Please try again.');
    }} finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-side">
      <div className="form-container">
        
        <h2 className="form-title">Create an Account</h2>
        <p style={{ color: '#64748b', marginBottom: '20px', marginTop: '-15px', fontSize: '14px' }}>
          Join us today and start your journey with through the eye.
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

        <form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Fullname" 
            onChange={(e) => setFormData(prev => ({ ...prev, fullname: e.target.value }))}
          />
          <Input 
            type="email" 
            placeholder="Your Email Address" 
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password"
            Icon={FiLock}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          />


          <div className="terms-check" style={{ marginBottom: '20px' }}>
            <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)}/>
            <label htmlFor="terms" style={{ fontSize: '13px', color: '#64748b', marginLeft: '8px' }}>
              I agree to the <b>platform's ethical use</b> and <b>guidelines</b>
            </label>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="divider-container">
          <span className="divider-line"></span>
          <span className="divider-text">Or with</span>
          <span className="divider-line"></span>
        </div>

        <GoogleLoginButton onFailure={(msg) => setError(msg)} />

        <p className="login-prompt">
          Already have an account? <Link to="/login" style={{ textDecoration: 'none', fontWeight: '600' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;