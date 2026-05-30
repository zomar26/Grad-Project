import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // 1. Added useNavigate hook
import vrImage from '../../../assets/vr-headset.png'; 

const WelcomeSection = () => {
  // 2. Initialize the navigate function
  const navigate = useNavigate();

  // 3. Logic to go back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="welcome-side">
      {/* 4. Attached the click handler to the button */}
      <button className="back-link" onClick={handleGoBack} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
        <FiArrowLeft /> Go back
      </button>

      <div className="welcome-content">
        <div className="text-group">
          <h1 className="main-title">
            Welcome to <br /> <span>Through The Eye</span>
          </h1>
          <p className="description">
            Enter an immersive VR simulation environment designed for medical learning, 
            disease visualization, and controlled experimentation — all in one secure platform.
          </p>
        </div>

        <img src={vrImage} alt="VR Headset" className="vr-image" />
      </div>
    </div>
  );
};

export default WelcomeSection;