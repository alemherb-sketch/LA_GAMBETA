import { useState } from 'react';
import { X, User, Phone, Plus, List } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock customers for the dropdown
const existingCustomers = [
  { id: 'C001', name: 'Carlos Torres', phone: '987654321' },
  { id: 'C002', name: 'Luis Fernández', phone: '912345678' },
  { id: 'C003', name: 'Equipo Los Galácticos', phone: '999888777' },
  { id: 'C004', name: 'María López', phone: '955444333' },
];

const ReservationModal = ({ date, timeSlot, field, onClose, onSave, existingReservation }) => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [formData, setFormData] = useState({
    customerName: existingReservation?.customerName || '',
    phone: '',
    status: existingReservation?.status || 'Pendiente',
    total: existingReservation?.total || timeSlot.price || 100,
    advancePayment: existingReservation?.advancePayment || 0,
    notes: ''
  });

  const handleSelectCustomer = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setFormData({...formData, customerName: '', phone: ''});
      return;
    }
    const customer = existingCustomers.find(c => c.id === selectedId);
    if (customer) {
      setFormData({...formData, customerName: customer.name, phone: customer.phone});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, timeSlot, field, date });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        maxHeight: '90vh', /* Limit height to 90% of screen */
        display: 'flex', 
        flexDirection: 'column', /* Flex column to separate header, body, footer */
        position: 'relative' 
      }}>
        
        {/* Header - Fixed */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-light)', flexShrink: 0 }}>
          <h3 style={{ margin: 0 }}>{existingReservation ? 'Editar Reserva' : 'Nueva Reserva'}</h3>
          <button className="btn-icon" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        
        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Scrollable Content Body */}
          <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
            
            {/* Reservation Summary */}
            <div style={{ background: 'var(--bg-darker)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div className="flex justify-between mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Cancha:</span>
                <span style={{ fontWeight: 600 }}>{field.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Fecha:</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                  {format(date, "EEEE d 'de' MMMM", { locale: es })}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Horario:</span>
                <span style={{ fontWeight: 600 }}>{timeSlot.time}</span>
              </div>
            </div>

            {/* Customer Selection / Creation */}
            <div className="input-group">
              <div className="flex justify-between items-center">
                <label className="input-label flex items-center gap-2"><User size={14} /> Cliente</label>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsNewCustomer(!isNewCustomer);
                    setFormData({...formData, customerName: '', phone: ''});
                  }}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--primary)', 
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.25rem'
                  }}
                >
                  {isNewCustomer ? <><List size={14}/> Usar existente</> : <><Plus size={14}/> Nuevo cliente</>}
                </button>
              </div>
              
              {isNewCustomer ? (
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Nombre del nuevo cliente o equipo" 
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  autoFocus
                />
              ) : (
                <select 
                  className="input-field" 
                  required 
                  onChange={handleSelectCustomer}
                  defaultValue=""
                  style={{ appearance: 'none' }}
                >
                  <option value="" disabled>-- Selecciona un cliente --</option>
                  {existingCustomers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="input-group">
              <label className="input-label flex items-center gap-2"><Phone size={14} /> Teléfono (WhatsApp)</label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="Ej. 987 654 321" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            {/* Payment Info */}
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="input-group">
                <label className="input-label">Monto Total (S/)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  min="0"
                  value={formData.total}
                  onChange={(e) => setFormData({...formData, total: Number(e.target.value)})}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Adelanto (Seña) (S/)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  min="0"
                  max={formData.total}
                  value={formData.advancePayment}
                  onChange={(e) => {
                    const advance = Number(e.target.value);
                    setFormData({
                      ...formData, 
                      advancePayment: advance,
                      status: advance === formData.total ? 'Pagado' : advance > 0 ? 'Adelanto' : 'Pendiente'
                    });
                  }}
                />
              </div>
            </div>

            <div className="input-group mt-4 mb-2">
              <label className="input-label">Estado de Pago</label>
              <select 
                className="input-field"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                style={{ appearance: 'none' }}
              >
                <option value="Pendiente">Pendiente (S/ 0.00)</option>
                <option value="Adelanto">Adelanto (S/ {formData.advancePayment}.00)</option>
                <option value="Pagado">Pagado Completo</option>
              </select>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex justify-end gap-4" style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-light)', flexShrink: 0, background: 'var(--glass-bg)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar Reserva</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
