import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Scissors, Check, X } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
}

interface Turno {
  id: string;
  fecha: string;
  hora: string;
  emailBarbero: string; // Cambiado a emailBarbero
  corte: string;
  adicional: string;
  estado: string;
  local: string;
  emailCliente: string;
}

const BarberDashboard: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/iniciar-sesion');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const fetchTurnos = async () => {
      try {
        // Obtener todos los turnos desde la API
        const response = await axiosInstance.get("http://localhost:8090/api/turno");
        const allTurnos = response.data;

        // Filtrar los turnos para mostrar solo los del barbero que ha iniciado sesión
        const barberTurnos = allTurnos.filter((turno: Turno) => 
          turno.emailBarbero === parsedUser.email && turno.estado.toLowerCase() === 'pendiente'  // Usar emailBarbero en lugar de barbero
        );

        setTurnos(barberTurnos);
        setLoading(false);
      } catch (err) {
        console.error('Error al obtener los turnos:', err);
        setError('Error al cargar los turnos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/iniciar-sesion');
  };

  const handleUpdateTurnoStatus = async (id: string, newStatus: string) => {
    try {
      await axiosInstance.put(`http://localhost:8090/api/turno/${id}`, { estado: newStatus });
      setTurnos(turnos.filter(turno => turno.id !== id));
    } catch (err) {
      console.error(`Error al actualizar el turno a ${newStatus}:`, err);
      setError(`Error al actualizar el turno a ${newStatus}. Por favor, intente nuevamente.`);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando tus turnos...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>BarberTurn - Dashboard de Barbero</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
      <div style={styles.content}>
        {user && <p style={styles.welcomeMessage}>Bienvenido, {user.nombre} {user.apellido}</p>}
        
        <h2 style={styles.subtitle}>Turnos Pendientes</h2>

        <div style={styles.turnosList}>
          {turnos.map((turno) => (
            <div key={turno.id} style={styles.turnoItem}>
              <div style={styles.turnoHeader}>
                <Calendar size={20} />
                <span style={styles.turnoFecha}>{turno.fecha} - {turno.hora}</span>
              </div>
              <div style={styles.turnoDetails}>
                <p><strong>Cliente:</strong> {turno.emailCliente}</p>
                <p><strong>Corte:</strong> {turno.corte}</p>
                <p><strong>Servicios adicionales:</strong> {turno.adicional || 'Ninguno'}</p>
                <p><strong>Local:</strong> {turno.local}</p>
              </div>
              <div style={styles.turnoActions}>
                <button 
                  onClick={() => handleUpdateTurnoStatus(turno.id, 'Completado')} 
                  style={styles.completeButton}
                >
                  <Check size={20} />
                  Completar
                </button>
                <button 
                  onClick={() => handleUpdateTurnoStatus(turno.id, 'Cancelado')} 
                  style={styles.cancelButton}
                >
                  <X size={20} />
                  Cancelar
                </button>
              </div>
            </div>
          ))}
          {turnos.length === 0 && (
            <p style={styles.noTurnos}>No hay turnos pendientes para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-Q7o6O7FB8cgz1SLHAEc9d2u9QM5Lsr.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '2em',
    margin: 0,
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px 15px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
  },
  welcomeMessage: {
    fontSize: '1.2em',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.5em',
    marginBottom: '20px',
  },
  turnosList: {
    width: '100%',
    maxWidth: '800px',
  },
  turnoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
  },
  turnoHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  turnoFecha: {
    marginLeft: '10px',
    fontSize: '1.1em',
    fontWeight: 'bold' as const,
  },
  turnoDetails: {
    fontSize: '0.9em',
  },
  turnoActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '10px',
    gap: '10px',
  },
  completeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 10px',
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  noTurnos: {
    textAlign: 'center' as const,
    fontSize: '1.1em',
    marginTop: '20px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2em',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2em',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
};

export default BarberDashboard;
