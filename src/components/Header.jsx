import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="glass-panel" style={{ position: 'sticky', top: '1rem', zIndex: 50, marginBottom: '2rem' }}>
      <div className="container flex items-center justify-between" style={{ padding: '1rem 1.5rem' }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '40px', height: '40px', 
            borderRadius: 'var(--radius-full)', 
            background: 'linear-gradient(135deg, var(--primary), #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--bg-darker)'
          }}>
            <CalendarDays size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            LA <span className="text-gradient">GAMBETA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none' }} className="md-flex items-center gap-6">
          <Link to="/" style={{ 
            color: location.pathname === '/' ? 'var(--primary)' : 'var(--text-main)', 
            textDecoration: 'none', fontWeight: 600, transition: 'color var(--transition-fast)'
          }}>Reservar</Link>
          <Link to="/admin" style={{ 
            color: location.pathname === '/admin' ? 'var(--primary)' : 'var(--text-main)', 
            textDecoration: 'none', fontWeight: 600, transition: 'color var(--transition-fast)'
          }}>Panel Admin</Link>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
            <User size={16} /> Iniciar Sesión
          </button>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="btn-icon" 
          style={{ display: 'flex', '@media (minWidth: 768px)': { display: 'none' } }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)' }} className="flex-col gap-4">
          <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, padding: '0.5rem 0' }}>Reservar Cancha</Link>
          <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, padding: '0.5rem 0' }}>Administración</Link>
          <button className="btn btn-primary w-full mt-4">Iniciar Sesión</button>
        </div>
      )}
    </header>
  );
};

export default Header;
