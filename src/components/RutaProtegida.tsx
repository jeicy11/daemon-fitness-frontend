import { Navigate, Outlet } from 'react-router-dom';
import { estaAutenticado } from '../services/auth.service';

// Envuelve las rutas que exigen sesión iniciada. Si no hay token,
// manda directo al login.
export default function RutaProtegida() {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
