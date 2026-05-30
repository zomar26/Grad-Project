import React, { useEffect, useRef } from 'react';
import { authService } from '../../../features/auth/services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GOOGLE_CLIENT_ID } from '../../../config/apiConfig';

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              // Send the ID token to the backend
              const apiResponse = await authService.googleLogin(response.credential);
              if (apiResponse.token) {
                login(apiResponse.token);
                navigate('/');
                if (onSuccess) onSuccess();
              }
            } catch (error) {
              console.error('Google login backend validation failed:', error);
              if (onFailure) onFailure(error.message || 'Google validation failed.');
            }
          }
        });

        window.google.accounts.id.renderButton(
          buttonRef.current,
          { 
            theme: 'outline', 
            size: 'large', 
            width: buttonRef.current?.offsetWidth || 370,
            text: 'signin_with',
            shape: 'rectangular'
          }
        );
      }
    };

    // Initialize button
    initializeGoogleSignIn();

    // In case script takes a moment to run
    const interval = setInterval(() => {
      if (window.google) {
        initializeGoogleSignIn();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [login, navigate, onSuccess, onFailure]);

  return (
    <div 
      ref={buttonRef} 
      style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '10px',
        minHeight: '44px' 
      }} 
    />
  );
};

export default GoogleLoginButton;
