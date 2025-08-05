// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  SINHALA_TEXT_PREDICT: `${API_BASE_URL}/sinhala-text-predict`,
  TEXT_PREDICT: `${API_BASE_URL}/text-predict`,
  IMAGE_PREDICT: `${API_BASE_URL}/image-predict`,
};

export default API_BASE_URL;
