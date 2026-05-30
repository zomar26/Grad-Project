import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    { id: "01", title: "Select a Disease", desc: "Start by selecting a retinal disease you want to explore. Each condition is presented clearly and does not require medical knowledge to understand." },
    { id: "02", title: "Decide How to Explore", desc: "Choose how you want to learn about the disease. You can explore the disease library for explanations or enter the VR / 3D mode to experience the vision changes." },
    { id: "03", title: "Enter the Experience", desc: "Choose the preferred mode and step into a realistic environment that reflects how vision is affected by the selected disease." },
    { id: "04", title: "Ask Questions Anytime", desc: "If something is unclear, the chatbot is always available to answer questions and guide you with more information." }
  ];

  return (
    <section className="how-it-works-section">
      <div className="w-full max-w-6xl flex flex-col items-center">
        
        {/* Title Section */}
        <div className="title-container">
          <h2 className="text-[#0b1c24] text-4xl font-extrabold mb-3">How It Works</h2>
          <div className="title-underline"></div>
        </div>

        {/* Steps Wrapper */}
        <div className="steps-wrapper">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className="step-card">
                <div className="step-circle">
                  <span className="text-xl font-bold">{step.id}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider">Step</span>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.desc}</p>
              </div>

              {/* Arrow logic: Hidden in mobile via CSS */}
              {index < steps.length - 1 && (
                <div className="arrow-container">
                  <svg width="35" height="25" viewBox="0 0 40 24" fill="none">
                    <path d="M2 12H38M38 12L28 2M38 12L28 22" stroke="#008080" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;