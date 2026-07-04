import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MasterCalendar from './pages/MasterCalendar';
import AdminDashboard from './pages/AdminDashboard';
import Customers from './pages/Customers';
import Bonos from './pages/Bonos';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-darker)' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '280px', padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<MasterCalendar />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/clientes" element={<Customers />} />
          <Route path="/bonos" element={<Bonos />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
