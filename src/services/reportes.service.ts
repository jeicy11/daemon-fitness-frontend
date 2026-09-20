import { api } from './api';

export interface StockPorCategoria {
  categoria: string;
  stock: number;
}

export async function obtenerStockPorCategoria(): Promise<StockPorCategoria[]> {
  const { data } = await api.get<StockPorCategoria[]>('/reportes/stock-por-categoria');
  return data;
}

// Descarga el PDF forzando el diálogo "Guardar como" del navegador
export async function descargarReportePdf(): Promise<void> {
  const response = await api.get('/reportes/productos-pdf', {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'reporte-productos.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}