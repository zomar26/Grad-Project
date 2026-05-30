import React from 'react';
import WelcomeSection from '../features/auth/components/WelcomeSection';
import LoginForm from '../features/auth/components/LoginForm';
import '../features/auth/SignUp.css'; 

const LoginPage = () => {
  return (
    <div className="signup-page-container">
      <WelcomeSection />
      <LoginForm />
    </div>
  );
};

export default LoginPage;