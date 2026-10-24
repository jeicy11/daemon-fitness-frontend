import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { login } from '../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();

  const [usuarioUsuario, setUsuarioUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!captchaToken) {
      setError('Completa el CAPTCHA antes de continuar');
      return;
    }

    setCargando(true);
    try {
      await login({ usuarioUsuario, clave, captchaToken });
      navigate('/');
    } catch (err: any) {
      // El backend manda mensajes específicos: intentos restantes o
      // cuenta bloqueada -- se muestran tal cual llegan.
      const mensaje = err.response?.data?.message ?? 'No se pudo iniciar sesión';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>Daemon Fitness</h1>
      <p style={{ color: '#666', marginTop: -8 }}>Control de inventario</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Usuario</label>
          <input
            type="text"
            value={usuarioUsuario}
            onChange={(e) => setUsuarioUsuario(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Contraseña</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
          />
        </div>

        {error && (
          <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>
        )}

        <button type="submit" disabled={cargando} style={{ width: '100%', padding: 10 }}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/olvide-clave">¿Olvidaste tu contraseña?</Link>
      </p>
    </div>
  );
}
