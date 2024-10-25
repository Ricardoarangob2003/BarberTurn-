// src/axiosConfig.js
import axios from 'axios';

// Crear la instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090/api',  // URL base de tu API
  timeout: 10000, // Tiempo máximo de espera para una petición
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las cabeceras si existe
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Obtiene el token desde el almacenamiento local
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Añadir token a los headers
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores globalmente
axiosInstance.interceptors.response.use(
  response => response,  // Si la respuesta es exitosa, simplemente la retornamos
  error => {
    const { response } = error;

    if (response) {
      // Manejo de errores según el código de estado
      switch (response.status) {
        case 401:
          // Si el token expira o la autenticación falla, redirigir al login
          window.location.href = '/iniciar-sesion';
          break;
        case 403:
          // Acceso denegado
          alert('No tienes permisos para realizar esta acción.');
          break;
        case 404:
          // Recurso no encontrado
          alert('Recurso no encontrado.');
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor:', response.data);
          alert('Ocurrió un error en el servidor, por favor intenta más tarde.');
          break;
        default:
          console.error(`Error no manejado (${response.status}):`, response.data);
          alert('Ocurrió un error inesperado.');
      }
    } else {
      console.error('Error sin respuesta del servidor:', error);
      alert('Error de conexión, por favor revisa tu red.');
    }

    return Promise.reject(error);
  }
);

// Funciones CRUD reutilizables para usar en cualquier componente
export const api = {
  get: (url, params = {}) => axiosInstance.get(url, { params }),
  post: (url, data) => axiosInstance.post(url, data),
  put: (url, data) => axiosInstance.put(url, data),
  delete: (url) => axiosInstance.delete(url),
};

export default axiosInstance;
