import { apiFetch } from '../../../config/apiConfig';

export const diseaseService = {
  /**
   * Fetches the complete list of retinal diseases for the main catalog grid
   * GET /api/disease (requires Authorization header)
   * @returns {Promise<Array>} Array of disease objects
   */
  getAllDiseases: async () => {
    return await apiFetch('/disease');
  },

  /**
   * Fetches complete clinical details for a single specific disease profile
   * GET /api/disease/:id (requires Authorization header)
   * @param {string|number} id - Unique database ID of the target disease
   * @returns {Promise<Object>} Detailed disease medical profile object
   */
  getDiseaseById: async (id) => {
    return await apiFetch(`/disease/${id}`);
  },

  /**
   * Creates a new disease profile (requires Admin role)
   * POST /api/disease
   */
  createDisease: async (diseaseData) => {
    return await apiFetch('/disease', {
      method: 'POST',
      body: JSON.stringify(diseaseData),
    });
  },

  /**
   * Updates an existing disease profile (requires Admin role)
   * PUT /api/disease/:id
   */
  updateDisease: async (id, diseaseData) => {
    return await apiFetch(`/disease/${id}`, {
      method: 'PUT',
      body: JSON.stringify(diseaseData),
    });
  },

  /**
   * Deletes a disease profile (requires Admin role)
   * DELETE /api/disease/:id
   */
  deleteDisease: async (id) => {
    return await apiFetch(`/disease/${id}`, {
      method: 'DELETE',
      // No body needed
    });
  },
};