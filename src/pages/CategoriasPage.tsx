import { useEffect, useState } from 'react';
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  type Categoria,
  type CreateCategoriaPayload,
} from '../services/categoria.service';
import { getUsuarioActual } from '../services/auth.service';

const vacio: CreateCategoriaPayload = { categoriaNombre: '', categoriaUbicacion: '' };

export default function CategoriasPage() {
  const usuario = getUsuarioActual();
  const puedeEditar = usuario?.rol === 'Administrador' || usuario?.rol === 'Supervisor';

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<CreateCategoriaPayload>(vacio);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => setCategorias(await listarCategorias());

  useEffect(() => {
    cargar();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editandoId) {
        await actualizarCategoria(editandoId, form);
      } else {
        await crearCategoria(form);
      }
      setForm(vacio);
      setEditandoId(null);
      await cargar();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    }
  };

  const handleEditar = (c: Categoria) => {
    setEditandoId(c.categoriaId);
    setForm({
      categoriaNombre: c.categoriaNombre,
      categoriaUbicacion: c.categoriaUbicacion ?? '',
    });
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await eliminarCategoria(id);
      await cargar();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'No se pudo eliminar');
    }
  };

  return (
    <div>
      <h1>Categorías</h1>

      {puedeEditar && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, maxWidth: 400 }}>
          <h3>{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h3>

          <div style={{ marginBottom: 8 }}>
            <label>Nombre</label>
            <input
              value={form.categoriaNombre}
              onChange={(e) => setForm({ ...form, categoriaNombre: e.target.value })}
              required
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label>Ubicación</label>
            <input
              value={form.categoriaUbicacion}
              onChange={(e) => setForm({ ...form, categoriaUbicacion: e.target.value })}
              style={{ width: '100%', padding: 6 }}
            />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit">{editandoId ? 'Guardar cambios' : 'Crear categoría'}</button>
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
            <th>Nombre</th>
            <th>Ubicación</th>
            {puedeEditar && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.categoriaId}>
              <td>{c.categoriaNombre}</td>
              <td>{c.categoriaUbicacion}</td>
              {puedeEditar && (
                <td>
                  <button onClick={() => handleEditar(c)}>Editar</button>
                  <button onClick={() => handleEliminar(c.categoriaId)} style={{ marginLeft: 8 }}>
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
