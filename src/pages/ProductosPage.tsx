import { useEffect, useState } from 'react';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  type Producto,
  type CreateProductoPayload,
} from '../services/producto.service';
import { listarCategorias } from '../services/categoria.service';
import type { Categoria } from '../services/producto.service';
import { getUsuarioActual } from '../services/auth.service';

const vacio: CreateProductoPayload = {
  productoCodigo: '',
  productoNombre: '',
  productoPrecio: 0,
  productoStock: 0,
  estadoConservacion: 5,
  categoriaId: 0,
  usuarioId: 0,
};

// Escala de estado de conservación para inventario de activos fijos
const ESTADOS: Record<number, { etiqueta: string; color: string }> = {
  5: { etiqueta: 'Excelente / Nuevo', color: '#16a34a' },
  4: { etiqueta: 'Bueno', color: '#65a30d' },
  3: { etiqueta: 'Regular', color: '#ca8a04' },
  2: { etiqueta: 'Malo', color: '#ea580c' },
  1: { etiqueta: 'Pésimo / Chatarra', color: '#dc2626' },
  0: { etiqueta: 'Dar de baja', color: '#7f1d1d' },
};

export default function ProductosPage() {
  const usuario = getUsuarioActual();
  const puedeEditar = usuario?.rol === 'Administrador' || usuario?.rol === 'Supervisor';

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<CreateProductoPayload>(vacio);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    const [p, c] = await Promise.all([listarProductos(), listarCategorias()]);
    setProductos(p);
    setCategorias(c);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      if (editandoId) {
        await actualizarProducto(editandoId, form);
      } else {
        await crearProducto({ ...form, usuarioId: usuario?.id });
      }
      setForm(vacio);
      setEditandoId(null);
      await cargarDatos();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    } finally {
      setCargando(false);
    }
  };

  const handleEditar = (p: Producto) => {
    setEditandoId(p.productoId);
    setForm({
      productoCodigo: p.productoCodigo,
      productoNombre: p.productoNombre,
      productoPrecio: Number(p.productoPrecio),
      productoStock: p.productoStock,
      estadoConservacion: p.estadoConservacion,
      categoriaId: p.categoriaId,
      usuarioId: p.usuarioId,
    });
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este equipo del inventario?')) return;
    await eliminarProducto(id);
    await cargarDatos();
  };

  return (
    <div>
      <h1>Equipamiento</h1>

      {puedeEditar && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, maxWidth: 420 }}>
          <h3>{editandoId ? 'Editar equipo' : 'Nuevo equipo'}</h3>

          <div style={{ marginBottom: 8 }}>
            <label>Código</label>
            <input
              value={form.productoCodigo}
              onChange={(e) => setForm({ ...form, productoCodigo: e.target.value })}
              required
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Nombre</label>
            <input
              value={form.productoNombre}
              onChange={(e) => setForm({ ...form, productoNombre: e.target.value })}
              required
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Valor de adquisición</label>
            <input
              type="number"
              step="0.01"
              value={form.productoPrecio}
              onChange={(e) =>
                setForm({ ...form, productoPrecio: Number(e.target.value) })
              }
              required
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Cantidad</label>
            <input
              type="number"
              value={form.productoStock}
              onChange={(e) =>
                setForm({ ...form, productoStock: Number(e.target.value) })
              }
              required
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Estado de conservación</label>
            <select
              value={form.estadoConservacion}
              onChange={(e) =>
                setForm({ ...form, estadoConservacion: Number(e.target.value) })
              }
              style={{ width: '100%', padding: 6 }}
            >
              {[5, 4, 3, 2, 1, 0].map((nivel) => (
                <option key={nivel} value={nivel}>
                  {nivel} - {ESTADOS[nivel].etiqueta}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Categoría</label>
            <select
              value={form.categoriaId}
              onChange={(e) =>
                setForm({ ...form, categoriaId: Number(e.target.value) })
              }
              required
              style={{ width: '100%', padding: 6 }}
            >
              <option value={0}>-- Selecciona --</option>
              {categorias.map((c) => (
                <option key={c.categoriaId} value={c.categoriaId}>
                  {c.categoriaNombre}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" disabled={cargando}>
            {editandoId ? 'Guardar cambios' : 'Registrar equipo'}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setForm(vacio);
              }}
              style={{ marginLeft: 8 }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      <div className="tabla-responsive"><table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Categoría</th>
            {puedeEditar && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.productoId}>
              <td>{p.productoCodigo}</td>
              <td>{p.productoNombre}</td>
              <td>Bs {p.productoPrecio}</td>
              <td>{p.productoStock}</td>
              <td style={{ color: ESTADOS[p.estadoConservacion]?.color, fontWeight: 'bold' }}>
                {p.estadoConservacion} - {ESTADOS[p.estadoConservacion]?.etiqueta}
              </td>
              <td>{p.categoria?.categoriaNombre}</td>
              {puedeEditar && (
                <td>
                  <button onClick={() => handleEditar(p)}>Editar</button>
                  <button
                    onClick={() => handleEliminar(p.productoId)}
                    style={{ marginLeft: 8 }}
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}
