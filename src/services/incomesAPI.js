import api from './api';
// Services pour les revenus
export const incomesAPI = {
  getAll: (params) => api.get('/incomes', { params }),
  getById: (id) => api.get(`/incomes/${id}`),
  create: (data) => api.post('/incomes', data),
  update: (id, data) => api.put(`/incomes/${id}`, data),
  delete: (id) => api.delete(`/incomes/${id}`)
};