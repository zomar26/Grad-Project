import React from 'react';

const SimulationCard = ({ image, title, isActive }) => {
  return (
    <div className={`simulation-card ${isActive ? 'active-card' : ''}`}>
      <div className="card-image-wrapper">
        <img src={image} alt={title} className="scan-image" />
      </div>
      {isActive && <h4 className="card-title">{title}</h4>}
    </div>
  );
};

export default SimulationCard;