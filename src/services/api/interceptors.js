export const setupInterceptors = (apiInstance) => {
  // ajout d'un intercepteur de requête pour ajouter le token d'authentification
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.error('No token found in localStorage');
        window.location.href = '/login';
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // intercepteur de réponse pour gérer les erreurs globales
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};