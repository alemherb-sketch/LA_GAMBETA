import { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CustomDatePicker = ({ selectedDate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const popoverRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const weekDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  return (
    <div style={{ position: 'relative' }} ref={popoverRef}>
      <div 
        className="flex items-center gap-2" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '0 1rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}
      >
        <CalendarIcon size={18} />
        <span style={{ textTransform: 'capitalize' }}>{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</span>
      </div>

      {isOpen && (
        <div className="glass-panel" style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: '0.5rem', padding: '1.25rem', width: '300px', zIndex: 100,
          background: 'var(--bg-dark)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="btn-icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ width: 32, height: 32, padding: 0 }}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontWeight: 700, textTransform: 'capitalize', fontSize: '1rem' }}>
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </div>
            <button className="btn-icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ width: 32, height: 32, padding: 0 }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekdays */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '0.75rem', textAlign: 'center' }}>
            {weekDays.map(d => (
              <div key={d} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {days.map((day, idx) => {
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => { onChange(day); setIsOpen(false); }}
                  style={{
                    padding: '0.5rem 0',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: isSelected ? 'var(--primary)' : isTodayDate ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: isSelected ? 'var(--bg-darker)' : isCurrentMonth ? 'var(--text-main)' : 'var(--text-muted)',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isCurrentMonth ? 1 : 0.3
                  }}
                  onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.background = isTodayDate ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
