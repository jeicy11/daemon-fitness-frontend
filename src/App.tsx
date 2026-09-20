import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RutaProtegida from './components/RutaProtegida';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductosPage from './pages/ProductosPage';
import CategoriasPage from './pages/CategoriasPage';
import UsuariosPage from './pages/UsuariosPage';
import CreditosPage from './pages/CreditosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/olvide-clave" element={<ForgotPasswordPage />} />
        <Route path="/restablecer-clave" element={<ResetPasswordPage />} />

        <Route element={<RutaProtegida />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/categorias" element={<CategoriasPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/creditos" element={<CreditosPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
