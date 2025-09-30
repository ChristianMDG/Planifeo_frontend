import api from './api';
// Services pour les reçus

export const receiptsAPI = {
  getReceipt: (id) => api.get(`/receipts/${id}`, { responseType: 'blob' })
};