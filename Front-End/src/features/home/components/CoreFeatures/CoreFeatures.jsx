import React from 'react';
import './CoreFeatures.css';

// Asset imports - replace with your actual file paths
import feature1 from '../../../../assets/feature1.png';
import feature2 from '../../../../assets/feature2.png';
import feature3 from '../../../../assets/feature3.jpg';

const CoreFeatures = () => {
  // Array containing feature card details
  const features = [
    { 
      id: 1, 
      title: "VR / 360 Simulation", 
      img: feature1, 
      desc: "Experience how retinal diseases affect vision through immersive 3D and 360° environments." 
    },
    { 
      id: 2, 
      title: "AI Chatbot", 
      img: feature2, 
      desc: "Ask at any time and receive clear, easy-to-understand explanations about diseases and symptoms." 
    },
    { 
      id: 3, 
      title: "Educational Info", 
      img: feature3, 
      desc: "Learn about retinal conditions through simple explanations and information." 
    }
  ];

  return (
    <section className="features-section">
      <div className="features-wrapper">
        
        {/* Header Section: Reduced title size for sleek look */}
        <div className="features-header-container">
          <h2 className="features-main-title">Core Features</h2>
          <p className="features-sub-text">
            Discover the key features that make Through the Eye an immersive and 
            accessible platform for understanding retinal diseases.
          </p>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f) => (
            /* feature-card-outer handles the colored spinning border effect */
            <div key={f.id} className="feature-card-outer">
              
              <div className="feature-card">
                {/* Visual Area */}
                <div className="card-image-area">
                  <img src={f.img} alt={f.title} />
                </div>
                
                {/* Information Area: Light gray background for contrast */}
                <div className="card-body">
                  <h3 className="card-title">{f.title}</h3>
                  <p className="card-description">{f.desc}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreFeatures;