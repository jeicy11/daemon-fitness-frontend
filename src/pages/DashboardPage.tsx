import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getUsuarioActual } from '../services/auth.service';
import {
  obtenerStockPorCategoria,
  descargarReportePdf,
  type StockPorCategoria,
} from '../services/reportes.service';

export default function DashboardPage() {
  const usuario = getUsuarioActual();
  const [datos, setDatos] = useState<StockPorCategoria[]>([]);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    obtenerStockPorCategoria().then(setDatos);
  }, []);

  const handleDescargar = async () => {
    setDescargando(true);
    try {
      await descargarReportePdf();
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div>
      <h1>Panel</h1>
      <p>
        Hola, {usuario?.nombre} {usuario?.apellido} ({usuario?.rol})
      </p>

      <button onClick={handleDescargar} disabled={descargando} style={{ marginBottom: 24 }}>
        {descargando ? 'Generando PDF...' : 'Descargar reporte de inventario (PDF)'}
      </button>

      <h2>Stock por categoría</h2>
      {datos.length === 0 ? (
        <p>No hay datos todavía.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stock" fill="#a0522d" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
