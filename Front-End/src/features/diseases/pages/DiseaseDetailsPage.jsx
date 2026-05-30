import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Layout/Navbar/Navbar';
import Footer from '../../../components/Layout/Footer/Footer';
import { diseaseService } from '../services/diseaseService';
import './DiseaseDetails.css'; 

const DiseaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDiseaseDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await diseaseService.getDiseaseById(id);
        setDisease(data);
      } catch (err) {
        if (err.status === 401) {
          navigate('/login');
          return;
        }
        setError(err.message || 'Failed to load disease details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiseaseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading-screen">
        <div className="spinner"></div>
        <p>Fetching clinical records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="details-view-main">
          <div className="details-view-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#dc2626', fontSize: '16px', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={() => navigate('/diseases')}
              style={{
                padding: '10px 24px',
                backgroundColor: '#008080',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Back to Diseases
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="details-view-main">
        <div className="details-view-container">
          
          {/* Top Return Anchor */}
          <button className="details-back-anchor" onClick={() => navigate('/diseases')}>
            <span className="arrow-icon">←</span> Back to Retinal Diseases
          </button>

          <article className="medical-profile-card">
            <header className="profile-header-strip">
              <h1>{disease.name}</h1>
              <div className="accent-bar-indicator"></div>
            </header>

            <div className="profile-grid-metrics">
              <section className="metric-info-block">
                <h3>Clinical Symptoms</h3>
                <p>{disease.symptoms}</p>
              </section>

              <section className="metric-info-block">
                <h3>Description</h3>
                <p>{disease.description}</p>
              </section>
            </div>

            {/* Immersive CTA Action Node */}
            <footer className="profile-action-footer">
              <button 
                className="vr-immersion-trigger" 
                onClick={() => navigate(`/simulation?scene=${disease.name}`)}
              >
                Launch Immersive VR Simulation
              </button>
            </footer>
          </article>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default DiseaseDetailsPage;