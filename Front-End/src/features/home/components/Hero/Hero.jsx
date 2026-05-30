import React from 'react';
import { useNavigate } from 'react-router-dom';
import vrImage from '../../../../assets/hero-vr.png'; 
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero-section-wrapper">
      <div className="hero-main-container">
        
        {/* Left Side: Content block */}
        <div className="hero-text-content">
          <h1 className="hero-title">
            See the World <br className="hidden sm:block" /> Through the Eyes
          </h1>
          
          <p className="hero-paragraph">
            Through the eye bridges the gap between medical knowledge and 
            patient experience by creating realistic, interactive simulations 
            of vision impairments. This innovative platform enables individuals 
            to truly understand patients' perspective.
          </p>
          
          <div className="hero-btn-group">
            <button className="hero-action-btn" onClick={() => navigate('/simulation')}> 
              Simulation 
            </button>
            <button className="hero-action-btn" onClick={() => navigate('/chatbot')}> 
              Chatbot 
            </button>
          </div>
        </div>

        {/* Right Side Visual: Image with Hover Effect */}
        <div className="hero-visual-block group"> 
          <div className="hero-bg-card"></div>
          <img 
            src={vrImage} 
            alt="VR Visual" 
            className="hero-img-responsive" 
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;