import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WelcomeSection from '../features/auth/components/WelcomeSection';
import Input from '../components/UI/Input/Input';
import { authService } from '../features/auth/services/authService';
import { FiMail, FiSend, FiCheckCircle, FiKey, FiLock } from 'react-icons/fi'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset_password' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgetPassword(email);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.verifyOtp(email, otpCode);
      setStep('reset_password');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.resetPassword(email, otpCode, newPassword);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <WelcomeSection />
      
      <div className="form-side">
        <div className="form-container">
          <h2 className="form-title">Reset Password</h2>

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
          
          {step === 'email' && (
            <>
              <p style={{ color: '#64748b', marginBottom: '25px', marginTop: '-20px' }}>
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              <form onSubmit={handleResetRequest}>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  Icon={FiMail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="signup-btn" disabled={loading} style={{marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                  {loading ? (
                    'Sending...'
                  ) : (
                    <><FiSend /> Send OTP</>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <p style={{ color: '#64748b', marginBottom: '25px', marginTop: '-20px' }}>
                We've sent a 6-digit OTP to <b style={{ color: '#1a1a1a' }}>{email}</b>. Enter it below to verify.
              </p>
              <form onSubmit={handleVerifyOtp}>
                <Input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  Icon={FiKey}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
                <button type="submit" className="signup-btn" disabled={loading} style={{marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
              <button 
                className="google-btn" 
                onClick={() => { setStep('email'); setError(''); }} 
                style={{marginTop: '15px', width: 'auto', padding: '10px 20px', margin: '15px auto 0'}}
              >
                Try another email
              </button>
            </>
          )}

          {step === 'reset_password' && (
            <>
              <p style={{ color: '#64748b', marginBottom: '25px', marginTop: '-20px' }}>
                OTP verified successfully! Now, enter your new password below.
              </p>
              <form onSubmit={handleResetPassword}>
                <Input 
                  type="password" 
                  placeholder="New Password" 
                  Icon={FiLock}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  Icon={FiLock}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit" className="signup-btn" disabled={loading} style={{marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
              <div style={{ 
                backgroundColor: '#e6fffa', 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 20px',
                color: '#008080'
              }}>
                <FiCheckCircle size={45} />
              </div>

              <h3 style={{ color: '#008080', margin: '15px 0' }}>Password Reset!</h3>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
                Your password has been changed successfully. <br />
                You can now log in with your new password.
              </p>
              
              <Link to="/login" className="signup-btn" style={{
                display: 'inline-block',
                marginTop: '25px',
                textDecoration: 'none',
                textAlign: 'center'
              }}>
                Back to Login
              </Link>
            </div>
          )}

          <p className="login-prompt" style={{ marginTop: '30px' }}>
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;