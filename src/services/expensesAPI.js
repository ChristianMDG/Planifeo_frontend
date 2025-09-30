import api from './api';
// Services pour les dépenses avec gestion des fichiers (reçus)
const buildFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
      formData.append(key, data[key]);
    }
  });
  return formData;
};
// Services pour les dépenses
export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => {
    const formData = buildFormData(data);
    return api.post('/expenses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => {
    const formData = buildFormData(data);
    return api.put(`/expenses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/expenses/${id}`)
};