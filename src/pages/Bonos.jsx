import { useState } from 'react';
import { Gift, Plus, Trophy, Star, Target, CheckCircle2, Award, Settings } from 'lucide-react';

const initialBonuses = [
  { id: 'B1', name: 'Bronce', target: 5, reward: '1 Bebida Rehidratante Gratis', color: '#cd7f32', icon: Star },
  { id: 'B2', name: 'Plata', target: 10, reward: '50% Dcto en Reserva', color: '#9ca3af', icon: Target },
  { id: 'B3', name: 'Oro', target: 15, reward: '1 Hora Gratis (Cualquier Cancha)', color: '#f59e0b', icon: Trophy }
];

const mockClients = [
  { id: 'C2', name: 'Equipo Los Galácticos', visits: 14, redeemed: ['B1', 'B2'] },
  { id: 'C1', name: 'Carlos Torres', visits: 10, redeemed: ['B1'] },
  { id: 'C5', name: 'Liga Sabatina', visits: 6, redeemed: [] },
  { id: 'C3', name: 'Luis Fernández', visits: 4, redeemed: [] },
  { id: 'C4', name: 'María López', visits: 1, redeemed: [] },
];

const Bonos = () => {
  const [bonuses, setBonuses] = useState(initialBonuses);
  const [clients, setClients] = useState(mockClients);

  const maxTarget = Math.max(...bonuses.map(b => b.target), 1);

  const handleRedeem = (clientId, bonusId) => {
    if (window.confirm('¿Confirmar canje de este bono para el cliente?')) {
      setClients(clients.map(c => {
        if (c.id === clientId) {
          return { ...c, redeemed: [...c.redeemed, bonusId] };
        }
        return c;
      }));
    }
  };

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Gift size={32} color="var(--primary)" /> Programa de Fidelización
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Configura metas y premia a tus clientes más frecuentes.</p>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="flex justify-between items-center mb-6">
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={20}/> Niveles de Recompensa</h3>
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => alert('Abrir modal para configurar bonos')}>
            <Plus size={16} /> Añadir Nivel
          </button>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {bonuses.map(bonus => (
            <div key={bonus.id} style={{ 
              background: 'var(--bg-darker)', padding: '1.25rem', borderRadius: 'var(--radius-md)',
              border: `1px solid ${bonus.color}40`, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: bonus.color }}>
                <bonus.icon size={100} />
              </div>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div style={{ background: `${bonus.color}20`, color: bonus.color, padding: '0.5rem', borderRadius: '50%' }}>
                  <bonus.icon size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.125rem' }}>Nivel {bonus.name}</h4>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Meta: {bonus.target} reservas</div>
                </div>
              </div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }} className="relative z-10">
                <Gift size={16} color={bonus.color} /> {bonus.reward}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} /> Progreso de Clientes
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem', fontWeight: 500, width: '25%' }}>Cliente / Equipo</th>
                <th style={{ padding: '1rem', fontWeight: 500, width: '50%' }}>Progreso (Reservas)</th>
                <th style={{ padding: '1rem', fontWeight: 500, width: '25%', textAlign: 'center' }}>Acciones (Canje)</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{client.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span>{client.visits} reservas totales</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div style={{ height: '24px', background: 'var(--bg-darker)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                      {/* Fill */}
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(100, (client.visits / maxTarget) * 100)}%`, 
                        background: 'linear-gradient(90deg, var(--primary-dark) 0%, var(--primary) 100%)',
                        transition: 'width 1s ease-out'
                      }}></div>
                      
                      {/* Milestones */}
                      {bonuses.map(bonus => {
                        const positionPct = (bonus.target / maxTarget) * 100;
                        const hasReached = client.visits >= bonus.target;
                        
                        return (
                          <div key={bonus.id} style={{ 
                            position: 'absolute', top: 0, bottom: 0, left: `${positionPct}%`,
                            width: '2px', background: 'var(--bg-dark)', transform: 'translateX(-50%)',
                            zIndex: 10
                          }}>
                            {/* Marker Icon */}
                            <div style={{ 
                              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                              width: 16, height: 16, borderRadius: '50%', 
                              background: hasReached ? bonus.color : 'var(--bg-card)',
                              border: `2px solid ${hasReached ? 'transparent' : 'var(--border-light)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {hasReached && <CheckCircle2 size={10} color="#fff" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                      {bonuses.map(bonus => {
                        const isEligible = client.visits >= bonus.target;
                        const isRedeemed = client.redeemed.includes(bonus.id);
                        
                        if (!isEligible) return null;
                        
                        return (
                          <button 
                            key={bonus.id}
                            disabled={isRedeemed}
                            onClick={() => handleRedeem(client.id, bonus.id)}
                            style={{ 
                              padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 600,
                              background: isRedeemed ? 'var(--bg-darker)' : `${bonus.color}20`,
                              color: isRedeemed ? 'var(--text-muted)' : bonus.color,
                              border: `1px solid ${isRedeemed ? 'var(--border-light)' : bonus.color}`,
                              cursor: isRedeemed ? 'default' : 'pointer',
                              display: 'flex', alignItems: 'center', gap: '0.25rem', width: 'fit-content'
                            }}
                          >
                            <Gift size={12} /> {isRedeemed ? `Canjeado (${bonus.name})` : `Canjear ${bonus.name}`}
                          </button>
                        );
                      })}
                      {client.visits < bonuses[0].target && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Sin bonos aún</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bonos;
