import { api } from './api';

export interface Categoria {
  categoriaId: number;
  categoriaNombre: string;
  categoriaUbicacion: string | null;
}

export interface CreateCategoriaPayload {
  categoriaNombre: string;
  categoriaUbicacion?: string;
}

export async function listarCategorias(): Promise<Categoria[]> {
  const { data } = await api.get<Categoria[]>('/categorias');
  return data;
}

export async function crearCategoria(payload: CreateCategoriaPayload): Promise<Categoria> {
  const { data } = await api.post<Categoria>('/categorias', payload);
  return data;
}

export async function actualizarCategoria(
  id: number,
  payload: Partial<CreateCategoriaPayload>,
): Promise<Categoria> {
  const { data } = await api.patch<Categoria>(`/categorias/${id}`, payload);
  return data;
}

export async function eliminarCategoria(id: number): Promise<void> {
  await api.delete(`/categorias/${id}`);
}