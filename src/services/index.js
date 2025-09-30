// frontend/src/services/index.js
// Point d'entrée unique pour tous les services API
// Permet d'importer facilement les services dans d'autres parties de l'application
export { expensesAPI } from './expensesAPI';
export { incomesAPI } from './incomesAPI';
export { categoriesAPI } from './categoriesAPI';
export { summaryAPI } from './summaryAPI';
export { userAPI } from './userAPI';
export { receiptsAPI } from './receiptsAPI';
export { default as api } from './api';