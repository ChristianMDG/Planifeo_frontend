import api from './api';
// Services pour les résumés
export const summaryAPI = {
  getMonthly: (params) => api.get('/summary/monthly', { params }),
  getCustom: (params) => api.get('/summary', { params }),
  getAlerts: () => api.get('/summary/alerts'),
  getMonthlyTrend: () => api.get('/summary/monthly-trend'),
};