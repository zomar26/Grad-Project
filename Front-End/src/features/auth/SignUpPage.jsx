import React from 'react';
import WelcomeSection from './components/WelcomeSection';
import SignUpForm from './components/SignUpForm';
import './SignUp.css';

const SignUpPage = () => {
  return (
    <div className="signup-page-container">
      <WelcomeSection />
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;