import { useState } from 'react';
import { Users, Search, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const initialCustomers = [
  { id: 'C001', name: 'Carlos Torres', phone: '987654321', totalBookings: 15, lastBooking: '03 Jul 2026', status: 'Frecuente' },
  { id: 'C002', name: 'Luis Fernández', phone: '912345678', totalBookings: 2, lastBooking: '01 Jul 2026', status: 'Ocasional' },
  { id: 'C003', name: 'Equipo Los Galácticos', phone: '999888777', totalBookings: 24, lastBooking: '28 Jun 2026', status: 'VIP' },
  { id: 'C004', name: 'María López', phone: '955444333', totalBookings: 1, lastBooking: '15 Jun 2026', status: 'Nuevo' },
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const openNewModal = () => {
    setEditingId(null);
    setCustomerForm({ name: '', phone: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer.id);
    setCustomerForm({ name: customer.name, phone: customer.phone });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm('¿Estás seguro de que deseas eliminar a este cliente?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerForm.name) return;
    
    if (editingId) {
      // Update
      setCustomers(customers.map(c => 
        c.id === editingId ? { ...c, name: customerForm.name, phone: customerForm.phone } : c
      ));
    } else {
      // Create
      const newCustomer = {
        id: `C00${customers.length + 1}`,
        name: customerForm.name,
        phone: customerForm.phone,
        totalBookings: 0,
        lastBooking: '-',
        status: 'Nuevo'
      };
      setCustomers([newCustomer, ...customers]);
    }
    
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'VIP': return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' };
      case 'Frecuente': return { bg: 'rgba(34, 197, 94, 0.2)', color: '#86efac', border: 'rgba(34, 197, 94, 0.3)' };
      case 'Nuevo': return { bg: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: 'rgba(59, 130, 246, 0.3)' };
      default: return { bg: 'var(--bg-card)', color: 'var(--text-main)', border: 'var(--border-light)' };
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Directorio de Clientes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestiona tu base de datos y fideliza a tus jugadores.</p>
        </div>
        <button className="btn btn-primary" onClick={openNewModal}>
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="input-group" style={{ marginBottom: 0, width: '300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Buscar por nombre o teléfono..." 
              style={{ paddingLeft: '2.75rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            onClick={() => alert("Generando archivo Excel con los datos de los clientes...")}
          >
            Exportar a Excel
          </button>
        </div>
        
        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Nombre / Equipo</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Teléfono (WhatsApp)</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Total Reservas</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Última Reserva</th>
                <th style={{ padding: '1rem', fontWeight: 500 }}>Categoría</th>
                <th style={{ padding: '1rem', fontWeight: 500, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => {
                const statusStyle = getStatusColor(customer.status);
                return (
                  <tr key={customer.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {customer.name.charAt(0)}
                        </div>
                        {customer.name}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>{customer.phone}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{customer.totalBookings}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{customer.lastBooking}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge" style={{ 
                        background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`
                      }}>
                        {customer.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div className="flex justify-center gap-2">
                        <button className="btn-icon" style={{ width: 32, height: 32, padding: 0 }} title="Editar" onClick={() => openEditModal(customer)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="btn-icon" style={{ width: 32, height: 32, padding: 0, color: '#ef4444' }} title="Eliminar" onClick={() => handleDelete(customer.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron clientes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ margin: 0 }}>{editingId ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Nombre del Cliente o Equipo</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label className="input-label">Teléfono (WhatsApp)</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
