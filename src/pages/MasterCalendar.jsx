import React, { useState, useRef } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import ReservationModal from '../components/ReservationModal';
import CustomDatePicker from '../components/CustomDatePicker';

const fieldsData = [
  { id: 1, name: 'Cancha 1 - Monumental (F7)' },
  { id: 2, name: 'Cancha 2 - Bombonera (F5)' },
  { id: 3, name: 'Cancha 3 - Principal (F11)' }
];

const timeSlots = [
  { time: '18:00', price: 100 },
  { time: '19:00', price: 120 },
  { time: '20:00', price: 150 },
  { time: '21:00', price: 150 },
  { time: '22:00', price: 120 },
  { time: '23:00', price: 100 },
];

// Mock existing reservations
const initialReservations = [
  { id: 'R1', fieldId: 1, time: '19:00', customerName: 'Carlos Torres', status: 'Pagado', advancePayment: 120, total: 120 },
  { id: 'R2', fieldId: 2, time: '20:00', customerName: 'Los Galácticos', status: 'Adelanto', advancePayment: 50, total: 150 },
  { id: 'R3', fieldId: 3, time: '18:00', customerName: 'Liga Sabatina', status: 'Pendiente', advancePayment: 0, total: 100 },
];

const MasterCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [reservations, setReservations] = useState(initialReservations);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState(null);
  const [draggedRes, setDraggedRes] = useState(null);
  const [editingRes, setEditingRes] = useState(null);
  
  const dateInputRef = useRef(null);

  const handleDragStart = (e, res) => {
    setDraggedRes(res);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, fieldId, time) => {
    e.preventDefault();
    if (!draggedRes) return;
    
    // Check if the target cell is already occupied by another reservation
    const existing = reservations.find(r => r.fieldId === fieldId && r.time === time && r.id !== draggedRes.id);
    if (existing) return; // Prevent overwriting

    // Update the dragged reservation's field and time
    setReservations(reservations.map(r => 
      r.id === draggedRes.id ? { ...r, fieldId, time } : r
    ));
    setDraggedRes(null);
  };

  const handleSlotClick = (field, slot) => {
    // Check if reserved
    const existing = reservations.find(r => r.fieldId === field.id && r.time === slot.time);
    if (!existing) {
      setActiveSlot({ field, timeSlot: slot });
      setModalOpen(true);
    }
  };

  const handleSaveReservation = (resData) => {
    if (editingRes) {
      setReservations(reservations.map(r => 
        r.id === editingRes.id 
          ? { ...r, ...resData } 
          : r
      ));
      setEditingRes(null);
    } else {
      const newRes = {
        id: `R${Date.now()}`,
        fieldId: resData.field.id,
        time: resData.timeSlot.time,
        customerName: resData.customerName,
        status: resData.status,
        advancePayment: resData.advancePayment,
        total: resData.total
      };
      setReservations([...reservations, newRes]);
    }
    setModalOpen(false);
  };

  const handleDeleteRes = (e, id) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      setReservations(reservations.filter(r => r.id !== id));
    }
  };

  const handleEditRes = (e, res, field, slot) => {
    e.stopPropagation();
    setActiveSlot({ field, timeSlot: slot });
    setEditingRes(res);
    setModalOpen(true);
  };

  const nextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const prevDay = () => setSelectedDate(addDays(selectedDate, -1));

  const openDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8" style={{ position: 'relative', zIndex: 50 }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Calendario Maestro</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestiona la disponibilidad de todas tus canchas.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass-panel" style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', position: 'relative', zIndex: 50 }}>
            <button className="btn-icon" onClick={prevDay}><ChevronLeft size={20} /></button>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <CustomDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
            </div>

            <button className="btn-icon" onClick={nextDay}><ChevronRight size={20} /></button>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Para registrar una reserva, por favor haz clic en cualquier recuadro vacío del calendario.')}>
            <Plus size={18} /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6" style={{ fontSize: '0.875rem' }}>
        <div className="flex items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}></div> Libre</div>
        <div className="flex items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.5)' }}></div> Pagado</div>
        <div className="flex items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.5)' }}></div> Adelanto (Seña)</div>
        <div className="flex items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)' }}></div> Pendiente</div>
      </div>

      {/* Grid */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `100px repeat(${fieldsData.length}, 1fr)` }}>
          {/* Header Row */}
          <div style={{ padding: '1rem', background: 'var(--bg-darker)', borderBottom: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Horario</span>
          </div>
          {fieldsData.map(field => (
            <div key={field.id} style={{ padding: '1rem', background: 'var(--bg-darker)', borderBottom: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', textAlign: 'center', fontWeight: 600 }}>
              {field.name}
            </div>
          ))}

          {/* Time Slots Rows */}
          {timeSlots.map(slot => (
            <React.Fragment key={slot.time}>
              {/* Time Column */}
              <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--text-muted)' }}>
                {slot.time}
              </div>
              
              {/* Field Columns for this time */}
              {fieldsData.map(field => {
                const res = reservations.find(r => r.fieldId === field.id && r.time === slot.time);
                
                let bg = 'transparent';
                let borderColor = 'var(--border-light)';
                
                if (res) {
                  if (res.status === 'Pagado') { bg = 'rgba(34, 197, 94, 0.15)'; borderColor = 'rgba(34, 197, 94, 0.4)'; }
                  if (res.status === 'Adelanto') { bg = 'rgba(59, 130, 246, 0.15)'; borderColor = 'rgba(59, 130, 246, 0.4)'; }
                  if (res.status === 'Pendiente') { bg = 'rgba(245, 158, 11, 0.15)'; borderColor = 'rgba(245, 158, 11, 0.4)'; }
                }

                return (
                  <div 
                    key={`${field.id}-${slot.time}`} 
                    style={{ 
                      padding: '0.5rem', 
                      borderBottom: '1px solid var(--border-light)', 
                      borderRight: '1px solid var(--border-light)',
                      background: bg,
                      cursor: res ? 'grab' : 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (!res) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!res) e.currentTarget.style.background = bg;
                    }}
                    onClick={() => handleSlotClick(field, slot)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, field.id, slot.time)}
                  >
                    {res ? (
                      <div 
                        draggable
                        onDragStart={(e) => handleDragStart(e, res)}
                        onDragEnd={() => setDraggedRes(null)}
                        style={{ 
                          border: `1px solid ${borderColor}`, borderRadius: 'var(--radius-sm)', padding: '0.5rem', height: '100%',
                          display: 'flex', flexDirection: 'column', gap: '0.25rem',
                          cursor: 'grab'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {res.customerName}
                          </div>
                          <div className="flex gap-2 opacity-0 hover-show-icons" style={{ transition: 'opacity 0.2s', marginRight: '-0.25rem', marginTop: '-0.25rem' }}>
                            <button className="btn-icon" style={{ width: 28, height: 28, padding: 0, background: 'rgba(255,255,255,0.1)' }} onClick={(e) => handleEditRes(e, res, field, slot)}>
                              <Edit2 size={16} />
                            </button>
                            <button className="btn-icon" style={{ width: 28, height: 28, padding: 0, color: '#ef4444', background: 'rgba(255,255,255,0.1)' }} onClick={(e) => handleDeleteRes(e, res.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>{res.status}</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>S/ {res.total}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0 }} className="hover-show">
                        <Plus size={20} color="var(--primary)" />
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-show { transition: opacity 0.2s; }
        div:hover > .hover-show { opacity: 0.5 !important; }
        div:hover > div > .hover-show-icons { opacity: 1 !important; }
      `}} />

      {/* Reservation Modal */}
      {modalOpen && activeSlot && (
        <ReservationModal 
          date={selectedDate}
          field={activeSlot.field}
          timeSlot={activeSlot.timeSlot}
          existingReservation={editingRes}
          onClose={() => { setModalOpen(false); setEditingRes(null); }}
          onSave={handleSaveReservation}
        />
      )}
    </div>
  );
};

export default MasterCalendar;
