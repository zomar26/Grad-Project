import React from 'react';
import './VisionMission.css';

const VisionMission = () => {
  return (
    <section className="vision-mission-section">
      
      <div className="vision-mission-wrapper flex flex-col gap-12">
        
        <div className="content-block self-start">
          <h2 className="custom-heading">
            Our Vision
          </h2>
          <p className="description-text">
            To create an accessible and immersive educational platform that enhances 
            understanding and empathy toward retinal diseases by accurately simulating 
            the visual experiences of affected individuals using web-based virtual 
            reality technologies.
          </p>
        </div>

        <div className="content-block self-end mission-block-uplift">
          <h2 className="custom-heading">
            Our Mission
          </h2>
          <p className="description-text">
            Our mission is to create a browser-based VR platform that simulates retinal 
            disease vision in realistic 3D environments, supported by an AI chatbot to 
            enhance medical education, public awareness, and empathy—without relying on 
            specialized hardware.
          </p>
        </div>

      </div>
    </section>
  );
};

export default VisionMission;