import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Users, Settings, LogOut, Gift } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', name: 'Calendario Maestro', icon: CalendarDays },
    { path: '/dashboard', name: 'Resumen Financiero', icon: LayoutDashboard },
    { path: '/clientes', name: 'Clientes', icon: Users },
    { path: '/bonos', name: 'Bonos', icon: Gift },
  ];

  return (
    <aside className="glass-panel" style={{
      width: '280px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      zIndex: 50,
      borderRadius: '0',
      borderRight: 'var(--glass-border)',
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{ 
          width: '40px', height: '40px', 
          borderRadius: 'var(--radius-md)', 
          background: 'linear-gradient(135deg, var(--primary), #10b981)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--bg-darker)'
        }}>
          <CalendarDays size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>LA GAMBETA</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Panel de Gestión</span>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all var(--transition-fast)'
              }}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', fontWeight: 500, textAlign: 'left', borderRadius: 'var(--radius-md)'
        }} onClick={() => alert('Módulo de Configuración estará disponible próximamente.')}>
          <Settings size={20} /> Configuración
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem',
          background: 'transparent', border: 'none', color: '#ef4444',
          cursor: 'pointer', fontWeight: 500, textAlign: 'left', borderRadius: 'var(--radius-md)'
        }} onClick={() => { if(window.confirm('¿Estás seguro de que deseas cerrar sesión?')) { alert('Sesión cerrada.'); } }}>
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
