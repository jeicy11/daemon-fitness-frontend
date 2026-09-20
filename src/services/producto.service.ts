import { api } from './api';

export interface Categoria {
  categoriaId: number;
  categoriaNombre: string;
  categoriaUbicacion: string | null;
}

export interface Producto {
  productoId: number;
  productoCodigo: string;
  productoNombre: string;
  productoPrecio: string;
  productoStock: number;
  estadoConservacion: number;
  productoFoto: string | null;
  categoriaId: number;
  categoria?: Categoria;
  usuarioId: number;
  activo: boolean;
}

export interface CreateProductoPayload {
  productoCodigo: string;
  productoNombre: string;
  productoPrecio: number;
  productoStock: number;
  estadoConservacion: number;
  categoriaId: number;
  usuarioId: number;
}

export async function listarProductos(): Promise<Producto[]> {
  const { data } = await api.get<Producto[]>('/productos');
  return data;
}

export async function crearProducto(payload: CreateProductoPayload): Promise<Producto> {
  const { data } = await api.post<Producto>('/productos', payload);
  return data;
}

export async function actualizarProducto(
  id: number,
  payload: Partial<CreateProductoPayload>,
): Promise<Producto> {
  const { data } = await api.patch<Producto>(`/productos/${id}`, payload);
  return data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}