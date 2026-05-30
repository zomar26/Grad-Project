import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const DiseaseCard = ({ id, title, description, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate(`/diseases/${id}`);
  };

  return (
    <div className="disease-card" onClick={handleLearnMore}>
      {isAdmin && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px',
          zIndex: 10
        }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{
              padding: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            title="Edit Disease"
            onMouseEnter={(e) => e.currentTarget.style.color = '#008080'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
          >
            <FiEdit size={14} />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              padding: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #fee2e2',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s'
            }}
            title="Delete Disease"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )}

      <h3>{title}</h3>
      <p>{description && description.length > 120 ? `${description.substring(0, 120)}...` : description}</p>
      <button className="learn-more-btn" onClick={(e) => {
        e.stopPropagation();
        handleLearnMore();
      }}>
        Learn more
      </button>
    </div>
  );
};

export default DiseaseCard;