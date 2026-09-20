import { api } from './api';

export interface Usuario {
  usuarioId: number;
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioUsuario: string;
  usuarioEmail: string | null;
  usuarioRol: 'Administrador' | 'Supervisor' | 'Técnico de Mantenimiento';
  activo: boolean;
}

export interface CreateUsuarioPayload {
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioUsuario: string;
  clave: string;
  usuarioEmail?: string;
  usuarioRol: 'Administrador' | 'Supervisor' | 'Técnico de Mantenimiento';
}

export type FortalezaClave = 'debil' | 'intermedia' | 'fuerte';

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>('/usuarios');
  return data;
}

export async function crearUsuario(payload: CreateUsuarioPayload): Promise<Usuario> {
  const { data } = await api.post<Usuario>('/usuarios', payload);
  return data;
}

export async function actualizarUsuario(
  id: number,
  payload: Partial<Omit<CreateUsuarioPayload, 'clave'>>,
): Promise<Usuario> {
  const { data } = await api.patch<Usuario>(`/usuarios/${id}`, payload);
  return data;
}

export async function eliminarUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}

export async function verificarFortaleza(clave: string): Promise<FortalezaClave> {
  const { data } = await api.post<{ fortaleza: FortalezaClave }>(
    '/usuarios/verificar-clave',
    { clave },
  );
  return data.fortaleza;
}