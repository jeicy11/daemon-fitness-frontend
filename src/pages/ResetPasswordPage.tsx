import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { restablecerClave } from '../services/auth.service';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [claveNueva, setClaveNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (claveNueva !== confirmar) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!token) {
      setError('El enlace no es válido: falta el token');
      return;
    }

    setCargando(true);
    try {
      const msg = await restablecerClave(token, claveNueva);
      setMensaje(msg);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'No se pudo actualizar la contraseña');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Daemon Fitness</h1>
      <p style={{ color: '#666', marginTop: -8 }}>Nueva contraseña</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={claveNueva}
            onChange={(e) => setClaveNueva(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {mensaje && <p style={{ color: 'green', marginBottom: 12 }}>{mensaje}</p>}
        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={cargando} style={{ width: '100%', padding: 10 }}>
          {cargando ? 'Guardando...' : 'Cambiar contraseña'}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </div>
  );
}
