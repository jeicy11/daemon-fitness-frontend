import { api } from './api';

export interface LoginPayload {
  usuarioUsuario: string;
  clave: string;
  captchaToken: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
    rol: 'Administrador' | 'Supervisor' | 'Técnico de Mantenimiento';
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
  }
}

export function getUsuarioActual() {
  const raw = localStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}

export function estaAutenticado(): boolean {
  return !!localStorage.getItem('access_token');
}

// Punto 12: recuperación de contraseña
export async function solicitarRecuperacion(email: string): Promise<string> {
  const { data } = await api.post<{ message: string }>('/auth/olvide-clave', { email });
  return data.message;
}

export async function restablecerClave(token: string, claveNueva: string): Promise<string> {
  const { data } = await api.post<{ message: string }>('/auth/restablecer-clave', {
    token,
    claveNueva,
  });
  return data.message;
}