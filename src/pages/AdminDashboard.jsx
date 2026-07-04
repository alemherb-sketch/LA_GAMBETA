import { LayoutDashboard, Users, CalendarDays, DollarSign, TrendingUp, Bell } from 'lucide-react';
import { useState } from 'react';

const AdminDashboard = () => {
  const [dateFilter, setDateFilter] = useState('Hoy');

  const getStats = () => {
    switch(dateFilter) {
      case 'Esta Semana':
        return [
          { title: 'Ingresos (Esta Sem)', value: 'S/ 8,450.00', icon: DollarSign, trend: '+12%' },
          { title: 'Reservas (Esta Sem)', value: '84', icon: CalendarDays, trend: '+10' },
          { title: 'Clientes Activos', value: '350', icon: Users, trend: '+8%' },
        ];
      case 'Este Mes':
        return [
          { title: 'Ingresos (Este Mes)', value: 'S/ 35,200.00', icon: DollarSign, trend: '+18%' },
          { title: 'Reservas (Este Mes)', value: '320', icon: CalendarDays, trend: '+45' },
          { title: 'Clientes Activos', value: '380', icon: Users, trend: '+12%' },
        ];
      case 'Este Año':
        return [
          { title: 'Ingresos (Este Año)', value: 'S/ 245,000.00', icon: DollarSign, trend: '+25%' },
          { title: 'Reservas (Este Año)', value: '2,450', icon: CalendarDays, trend: '+300' },
          { title: 'Clientes Activos', value: '520', icon: Users, trend: '+22%' },
        ];
      default:
        return [
          { title: 'Ingresos (Hoy)', value: 'S/ 1,250.00', icon: DollarSign, trend: '+15%' },
          { title: 'Reservas (Hoy)', value: '12', icon: CalendarDays, trend: '+2' },
          { title: 'Clientes Activos', value: '342', icon: Users, trend: '+5%' },
        ];
    }
  };

  const stats = getStats();

  const recentBookings = [
    { id: 'R-001', customer: 'Carlos Torres', field: 'El Monumental', time: '18:00 - 19:00', status: 'Pagado', amount: 100 },
    { id: 'R-002', customer: 'Luis Fernández', field: 'La Bombonera', time: '19:00 - 20:00', status: 'Pendiente', amount: 80 },
    { id: 'R-003', customer: 'Equipo Los Galácticos', field: 'Estadio Principal', time: '20:00 - 21:00', status: 'Adelanto', amount: 250 },
  ];

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Resumen Financiero</h1>
          <p style={{ color: 'var(--text-muted)' }}>Estadísticas y flujo de caja de tus canchas.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            className="input-field" 
            style={{ width: 'auto', marginBottom: 0, padding: '0.5rem 2rem 0.5rem 1rem' }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="Hoy">Hoy</option>
            <option value="Esta Semana">Esta Semana</option>
            <option value="Este Mes">Este Mes</option>
            <option value="Este Año">Este Año</option>
          </select>
          <button className="btn-icon" onClick={() => alert('No tienes notificaciones nuevas.')}>
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div className="flex justify-between items-start mb-4">
              <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                <stat.icon size={24} />
              </div>
              <span style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <TrendingUp size={14} /> {stat.trend}
              </span>
            </div>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 500 }}>{stat.title}</h4>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 style={{ margin: 0 }}>Flujo de Caja Reciente</h3>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => alert('Generando reporte completo PDF...')}>Ver Reporte Completo</button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>ID</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Cliente</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Cancha</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Estado</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'right' }}>Monto Cobrado (PEN)</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{booking.id}</td>
                  <td style={{ padding: '1rem' }}>{booking.customer}</td>
                  <td style={{ padding: '1rem' }}>{booking.field}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${booking.status === 'Pagado' ? 'badge-success' : ''}`} style={{ 
                      background: booking.status === 'Pendiente' ? 'rgba(245, 158, 11, 0.2)' : 
                                  booking.status === 'Adelanto' ? 'rgba(59, 130, 246, 0.2)' : '',
                      color: booking.status === 'Pendiente' ? '#fcd34d' : 
                             booking.status === 'Adelanto' ? '#93c5fd' : '',
                      borderColor: booking.status === 'Pendiente' ? 'rgba(245, 158, 11, 0.3)' : 
                                   booking.status === 'Adelanto' ? 'rgba(59, 130, 246, 0.3)' : ''
                    }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>S/ {booking.amount}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
