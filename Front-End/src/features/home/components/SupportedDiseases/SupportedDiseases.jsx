import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SupportedDiseases.css';

const SupportedDiseases = () => {
  const navigate = useNavigate(); 

  const diseases = [
    { id: 1, title: "Cortical Cataract", desc: "Blurred and hazy vision caused by clouding in the eye's lens." },
    { id: 2, title: "Macular Pucker", desc: "Distorted central vision affecting fine detail and clarity." },
    { id: 3, title: "Retinitis Pigmentosa", desc: "Progressive loss of peripheral vision leading to tunnel vision." },
    { id: 4, title: "Pathologic Myopia", desc: "Severe nearsightedness causing retinal stretching and vision loss." }
  ];

  return (
    <section className="supported-section">
      <div className="section-container">
        
        {/* Header Section */}
        <div className="header-wrapper">
          <div>
            <h2 className="section-title text-[#0b1c24] font-extrabold">Supported Retinal Disease</h2>
            <p className="section-subtitle">
              Explore a range of simulations tailored to different retinal conditions,
              ensuring accurate representation of their distinct visual characteristics.
            </p>
          </div>
          {/* Added routing handler to View All button to jump to central directory */}
          <button 
            className="view-all-btn bg-brand-teal text-white transition-all duration-300 hover:bg-[#0b1c24] hover:scale-105"
            onClick={() => navigate('/diseases')}
          >
            VIEW ALL
          </button>
        </div>

        {/* Diseases Grid */}
        <div className="diseases-grid">
          {diseases.map((disease) => (
            <div key={disease.id} className="disease-card-outer">
              <div className="disease-card bg-[linear-gradient(135deg,#ffffff_30%,#e0f2f2_70%,#f3e8ff_100%)_!important] border border-brand-teal/20 hover:border-transparent transition-all duration-300">
                <div className="card-content">
                  <h3 className="disease-card-title">{disease.title}</h3>
                  <p className="disease-card-desc">{disease.desc}</p>
                </div>
                {/* Appended dynamic template literals to pass the ID parameter seamlessly into execution context */}
                <button 
                  className="learn-more-btn bg-[#1f2937] text-white transition-all duration-300 hover:bg-brand-teal hover:scale-110"
                  onClick={() => navigate(`/diseases/${disease.id}`)}
                >
                  Learn more
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SupportedDiseases;