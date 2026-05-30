import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar/Navbar';
import Footer from '../components/Layout/Footer/Footer';
import DiseaseCard from '../features/diseases/components/DiseaseCard';
import { diseaseService } from '../features/diseases/services/diseaseService';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiX } from 'react-icons/fi';
import '../features/diseases/Diseases.css';

const DiseasesPage = () => {
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Admin Operations State
  const { user } = useAuth();
  const isAdmin = user && user.role === 'Admin';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedId, setSelectedId] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    symptoms: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchDiseases = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await diseaseService.getAllDiseases();
      setDiseases(data);
    } catch (err) {
      if (err.status === 401) {
        navigate('/login');
        return;
      }
      setError(err.message || 'Failed to load diseases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const openCreateModal = () => {
    setModalType('create');
    setSelectedId(null);
    setFormState({ name: '', description: '', symptoms: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (disease) => {
    setModalType('edit');
    setSelectedId(disease.id);
    setFormState({
      name: disease.name,
      description: disease.description,
      symptoms: disease.symptoms || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await diseaseService.deleteDisease(id);
        fetchDiseases();
      } catch (err) {
        alert(err.message || 'Failed to delete disease');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.description || !formState.symptoms) {
      alert('All fields are required');
      return;
    }

    try {
      setSubmitting(true);
      if (modalType === 'create') {
        await diseaseService.createDisease(formState);
      } else {
        await diseaseService.updateDisease(selectedId, formState);
      }
      setIsModalOpen(false);
      fetchDiseases();
    } catch (err) {
      alert(err.message || `Failed to ${modalType} disease`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar /> 
      <main className="diseases-main">
        <section className="diseases-hero">
          <h1>Retinal Diseases</h1>
          <p>Explore comprehensive information about various retinal diseases and their effects on vision</p>
          
          {isAdmin && (
            <button 
              onClick={openCreateModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: '#008080',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 128, 128, 0.25)',
                transition: 'all 0.3s ease-out',
                marginTop: '10px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 128, 128, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 128, 128, 0.25)';
              }}
            >
              <FiPlus size={18} /> Add New Disease
            </button>
          )}
        </section>

        {loading ? (
          <div className="loading-placeholder">Loading Retinal Data...</div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#dc2626'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={fetchDiseases}
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
              Try Again
            </button>
          </div>
        ) : (
          <div className="diseases-grid">
            {diseases.map((item) => (
              <DiseaseCard 
                key={item.id} 
                id={item.id} 
                title={item.name} 
                description={item.description} 
                isAdmin={isAdmin}
                onEdit={() => openEditModal(item)}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ADMIN MODAL DIALOG */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '550px',
            padding: '35px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                border: 'none',
                backgroundColor: '#f1f5f9',
                padding: '8px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiX size={16} />
            </button>

            <h2 style={{
              color: '#0f172a',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {modalType === 'create' ? 'Create Disease Profile' : 'Edit Disease Profile'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>
              Fill in the clinical information details for this retinal disease profile.
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                  Disease Name
                </label>
                <input 
                  type="text" 
                  value={formState.name}
                  onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Diabetic Retinopathy"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                  Clinical Symptoms
                </label>
                <input 
                  type="text" 
                  value={formState.symptoms}
                  onChange={(e) => setFormState(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="e.g. Blurred vision, floaters, dark areas, vision loss"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea 
                  value={formState.description}
                  onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a detailed medical description of the condition..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#fff',
                    color: '#64748b',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#008080',
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {submitting ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DiseasesPage;