import api from './api';
// Services pour les utilisateurs
export const userAPI = {
  getProfile: () => api.get('/user/profile')
};