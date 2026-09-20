import axios from 'axios';

// Cliente HTTP central -- todos los servicios (usuarios, productos, etc.)
// lo importan en vez de usar axios directo.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Agrega automáticamente el token guardado a cada petición, si existe.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend responde 401 (token vencido/inválido), manda al login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);