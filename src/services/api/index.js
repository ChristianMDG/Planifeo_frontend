import axios from 'axios';
import { API_CONFIG } from './config';
import { setupInterceptors } from './interceptors';

// Créer une instance Axios avec la configuration de base
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Configurer les intercepteurs pour gérer les requêtes et réponses
setupInterceptors(api);

export default api;