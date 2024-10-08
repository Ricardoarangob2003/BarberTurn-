// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090/api',  // URL base de tu API
  timeout: 10000, // Tiempo máximo de espera para una petición
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta para manejar errores globalmente
axiosInstance.interceptors.response.use(
  response => response,  // Si la respuesta es exitosa, simplemente la retornamos
  error => {
    if (error.response) {
      // Manejo de errores específicos según el código de estado
      if (error.response.status === 401) {
        // Redirigir al login o mostrar un mensaje de sesión expirada
        window.location.href = '/iniciar-sesion';
      } else if (error.response.status === 500) {
        console.error('Error del servidor:', error.response.data);
        // Mostrar una alerta o notificación global (puedes usar una librería como Toast para esto)
        alert('Ocurrió un error en el servidor, por favor intenta más tarde.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
