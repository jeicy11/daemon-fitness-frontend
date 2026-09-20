import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getUsuarioActual, logout } from '../services/auth.service';

export default function Layout() {
  const navigate = useNavigate();
  const usuario = getUsuarioActual();
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const cerrarSidebar = () => setSidebarAbierto(false);

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    marginBottom: 6,
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 15,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#ffffff' : '#94a3b8',
    background: isActive
      ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
      : 'transparent',
    boxShadow: isActive ? '0 8px 20px rgba(37, 99, 235, 0.25)' : 'none',
    transition: 'all 0.2s ease',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#0f172a',
        color: '#e2e8f0',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* Fondo oscuro detrás del sidebar cuando está abierto en móvil */}
      {sidebarAbierto && (
        <div className="sidebar-overlay" onClick={cerrarSidebar} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar-daemon ${sidebarAbierto ? 'sidebar-abierto' : ''}`}
        style={{
          width: 250,
          minHeight: '100vh',
          background: '#111827',
          borderRight: '1px solid #1e293b',
          padding: '24px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            padding: '0 10px 30px',
            borderBottom: '1px solid #1e293b',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 21,
                fontWeight: 800,
                color: '#fff',
                boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)',
              }}
            >
              D
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                DAEMON
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: 2 }}>
                FITNESS
                <br />
                Univ. M.Jeicy Avilés
              </div>
            </div>
          </div>

          {/* Botón cerrar: solo visible en móvil, dentro del panel */}
          <button
            className="boton-cerrar-sidebar"
            onClick={cerrarSidebar}
            aria-label="Cerrar menú"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: 22,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* MENU */}
        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1.5, padding: '0 12px', marginBottom: 10 }}>
          MENÚ PRINCIPAL
        </div>

        <nav>
          <NavLink to="/" style={linkStyle} end onClick={cerrarSidebar}>
            <span>📊</span>
            <span>Panel</span>
          </NavLink>

          <NavLink to="/productos" style={linkStyle} onClick={cerrarSidebar}>
            <span>🏋️</span>
            <span>Equipamiento</span>
          </NavLink>

          <NavLink to="/categorias" style={linkStyle} onClick={cerrarSidebar}>
            <span>📁</span>
            <span>Categorías</span>
          </NavLink>

          {usuario?.rol === 'Administrador' && (
            <NavLink to="/usuarios" style={linkStyle} onClick={cerrarSidebar}>
              <span>👥</span>
              <span>Usuarios</span>
            </NavLink>
          )}

          <NavLink to="/creditos" style={linkStyle} onClick={cerrarSidebar}>
            <span>💳</span>
            <span>Créditos</span>
          </NavLink>
        </nav>

        {/* PARTE INFERIOR */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid #1e293b', paddingTop: 20 }}>
          <div style={{ background: '#1e293b', borderRadius: 12, padding: 14, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 5 }}>SESIÓN ACTIVA</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{usuario?.nombre || 'Usuario'}</div>
            <div style={{ fontSize: 12, color: '#60a5fa', marginTop: 3 }}>{usuario?.rol || 'Usuario'}</div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid #334155',
              borderRadius: 10,
              background: 'transparent',
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* HEADER */}
        <header
          style={{
            height: 72,
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#111827',
            borderBottom: '1px solid #1e293b',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Botón hamburguesa: solo visible en móvil */}
            <button
              className="boton-hamburguesa"
              onClick={() => setSidebarAbierto(true)}
              aria-label="Abrir menú"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: 24,
                cursor: 'pointer',
              }}
            >
              ☰
            </button>

            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 3 }}>Bienvenido de nuevo</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>{usuario?.nombre || 'Usuario'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
              }}
            >
              {usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main
          style={{
            flex: 1,
            padding: 32,
            background: 'radial-gradient(circle at top right, rgba(37,99,235,0.08), transparent 30%), #0f172a',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ maxWidth: 1500, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
