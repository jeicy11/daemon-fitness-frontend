import { useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarRecuperacion } from '../services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    setCargando(true);
    try {
      const msg = await solicitarRecuperacion(email);
      setMensaje(msg);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ocurrió un error, intenta de nuevo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Daemon Fitness</h1>
      <p style={{ color: '#666', marginTop: -8 }}>Recuperar contraseña</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        {mensaje && <p style={{ color: 'green', marginBottom: 12 }}>{mensaje}</p>}
        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}

        <button type="submit" disabled={cargando} style={{ width: '100%', padding: 10 }}>
          {cargando ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </div>
  );
}
