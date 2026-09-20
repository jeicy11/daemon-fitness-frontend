import { useEffect, useState } from 'react';
import {
  listarUsuarios,
  crearUsuario,
  eliminarUsuario,
  verificarFortaleza,
  type Usuario,
  type CreateUsuarioPayload,
  type FortalezaClave,
} from '../services/usuario.service';

const vacio: CreateUsuarioPayload = {
  usuarioNombre: '',
  usuarioApellido: '',
  usuarioUsuario: '',
  clave: '',
  usuarioEmail: '',
  usuarioRol: 'Técnico de Mantenimiento',
};

const colorFortaleza: Record<FortalezaClave, string> = {
  debil: 'red',
  intermedia: 'orange',
  fuerte: 'green',
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState<CreateUsuarioPayload>(vacio);
  const [fortaleza, setFortaleza] = useState<FortalezaClave | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => setUsuarios(await listarUsuarios());

  useEffect(() => {
    cargar();
  }, []);

  // Consulta la fortaleza cada vez que cambia la clave escrita
  const handleClaveChange = async (clave: string) => {
    setForm({ ...form, clave });
    if (clave.length > 0) {
      setFortaleza(await verificarFortaleza(clave));
    } else {
      setFortaleza(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await crearUsuario(form);
      setForm(vacio);
      setFortaleza(null);
      await cargar();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al guardar');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    await eliminarUsuario(id);
    await cargar();
  };

  return (
    <div>
      <h1>Usuarios del sistema</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, maxWidth: 400 }}>
        <h3>Nuevo usuario</h3>

        <div style={{ marginBottom: 8 }}>
          <label>Nombre</label>
          <input
            value={form.usuarioNombre}
            onChange={(e) => setForm({ ...form, usuarioNombre: e.target.value })}
            required
            style={{ width: '100%', padding: 6 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Apellido</label>
          <input
            value={form.usuarioApellido}
            onChange={(e) => setForm({ ...form, usuarioApellido: e.target.value })}
            required
            style={{ width: '100%', padding: 6 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Usuario</label>
          <input
            value={form.usuarioUsuario}
            onChange={(e) => setForm({ ...form, usuarioUsuario: e.target.value })}
            required
            style={{ width: '100%', padding: 6 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Contraseña</label>
          <input
            type="password"
            value={form.clave}
            onChange={(e) => handleClaveChange(e.target.value)}
            required
            style={{ width: '100%', padding: 6 }}
          />
          {fortaleza && (
            <p style={{ color: colorFortaleza[fortaleza], margin: '4px 0' }}>
              Fortaleza: {fortaleza}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Rol</label>
          <select
            value={form.usuarioRol}
            onChange={(e) =>
              setForm({ ...form, usuarioRol: e.target.value as CreateUsuarioPayload['usuarioRol'] })
            }
            style={{ width: '100%', padding: 6 }}
          >
            <option value="Técnico de Mantenimiento">Técnico de Mantenimiento</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Crear usuario</button>
      </form>

      <div className="tabla-responsive"><table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.usuarioId}>
              <td>
                {u.usuarioNombre} {u.usuarioApellido}
              </td>
              <td>{u.usuarioUsuario}</td>
              <td>{u.usuarioRol}</td>
              <td>
                <button onClick={() => handleEliminar(u.usuarioId)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </div>
  );
}
