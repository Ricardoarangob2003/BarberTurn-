import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Scissors, X, CheckCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
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
  barbero: string;
  corte: string;
  adicional: string;
  estado: string | null;
  local: string;
  emailCliente: string;
}

const MisTurnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCanceledHistory, setShowCanceledHistory] = useState(false); // Added state for canceled appointments
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
        const response = await axiosInstance.get("http://localhost:8090/api/turno");
        const allTurnos = response.data;
        const userTurnos = allTurnos.filter((turno: Turno) => turno.emailCliente === parsedUser.email);
        setTurnos(userTurnos);
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

  const turnosPendientes = turnos.filter(turno => turno.estado && turno.estado.toLowerCase() !== 'completado');
  const turnosCompletados = turnos.filter(turno => turno.estado && turno.estado.toLowerCase() === 'completado');
  const turnosCancelados = turnos.filter(turno => turno.estado && turno.estado.toLowerCase() === 'cancelado');

  if (loading) {
    return <div style={styles.loading}>Cargando tus turnos...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>BarberTurn</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
      <div style={styles.content}>
        <h2 style={styles.subtitle}>Mis Turnos</h2>
        {user && <p style={styles.welcomeMessage}>Bienvenido, {user.nombre} {user.apellido}</p>}
        {turnos.length === 0 ? (
          <p style={styles.noTurnos}>No tienes turnos registrados.</p>
        ) : (
          <>
            <div style={styles.sectionContainer}>
              <h3 style={styles.sectionTitle}>
                <Clock size={20} />
                Turnos Pendientes
              </h3>
              <div style={styles.turnosList}>
                {turnosPendientes.map((turno) => (
                  <TurnoItem key={turno.id} turno={turno} />
                ))}
              </div>
              {turnosPendientes.length === 0 && (
                <p style={styles.noTurnos}>No tienes turnos pendientes.</p>
              )}
            </div>
            <div style={styles.sectionContainer}>
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                style={styles.historyButton}
              >
                {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                {showHistory ? 'Ocultar Historial' : 'Ver Historial de Turnos Completados'}
              </button>
              {showHistory && (
                <>
                  <h3 style={styles.sectionTitle}>
                    <CheckCircle size={20} />
                    Historial de Turnos Completados
                  </h3>
                  <div style={styles.turnosList}>
                    {turnosCompletados.map((turno) => (
                      <TurnoItem key={turno.id} turno={turno} />
                    ))}
                  </div>
                  {turnosCompletados.length === 0 && (
                    <p style={styles.noTurnos}>No tienes turnos completados.</p>
                  )}
                </>
              )}
            </div>
            <div style={styles.sectionContainer}> {/* Added section for canceled appointments */}
              <button 
                onClick={() => setShowCanceledHistory(!showCanceledHistory)} 
                style={styles.historyButton}
              >
                {showCanceledHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                {showCanceledHistory ? 'Ocultar Historial de Turnos Cancelados' : 'Ver Historial de Turnos Cancelados'}
              </button>
              {showCanceledHistory && (
                <>
                  <h3 style={styles.sectionTitle}>
                    <X size={20} />
                    Historial de Turnos Cancelados
                  </h3>
                  <div style={styles.turnosList}>
                    {turnosCancelados.map((turno) => (
                      <TurnoItem key={turno.id} turno={turno} />
                    ))}
                  </div>
                  {turnosCancelados.length === 0 && (
                    <p style={styles.noTurnos}>No tienes turnos cancelados.</p>
                  )}
                </>
              )}
            </div>
          </>
        )}
        <button onClick={() => navigate('/reserva-turno')} style={styles.newAppointmentButton}>
          Reservar Nuevo Turno
        </button>
      </div>
    </div>
  );
};

const TurnoItem: React.FC<{ turno: Turno }> = ({ turno }) => (
  <div style={styles.turnoItem}>
    <div style={styles.turnoHeader}>
      <Calendar size={20} />
      <span style={styles.turnoFecha}>{turno.fecha} - {turno.hora}</span>
    </div>
    <div style={styles.turnoDetails}>
      <p><strong>Barbería:</strong> {turno.local}</p>
      <p><strong>Barbero:</strong> {turno.barbero}</p>
      <p><strong>Corte:</strong> {turno.corte}</p>
      <p><strong>Servicios adicionales:</strong> {turno.adicional || 'Ninguno'}</p>
      <p><strong>Estado:</strong> <span style={getEstadoStyle(turno.estado)}>{turno.estado || 'No especificado'}</span></p>
    </div>
    <div style={styles.turnoIcon}>
      <Scissors size={30} />
    </div>
  </div>
);

const getEstadoStyle = (estado: string | null | undefined) => {
  if (!estado) {
    return {};
  }
  
  switch (estado.toLowerCase()) {
    case 'pendiente':
      return { color: '#ffa500', fontWeight: 'bold' };
    case 'confirmado':
      return { color: '#00ff00', fontWeight: 'bold' };
    case 'cancelado':
      return { color: '#ff0000', fontWeight: 'bold' };
    case 'completado':
      return { color: '#ffff00', fontWeight: 'bold' };
    default:
      return {};
  }
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
  subtitle: {
    fontSize: '1.5em',
    marginBottom: '20px',
  },
  welcomeMessage: {
    fontSize: '1.2em',
    marginBottom: '20px',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: '600px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.2em',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  turnosList: {
    width: '100%',
  },
  turnoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    position: 'relative' as const,
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
  turnoIcon: {
    position: 'absolute' as const,
    top: '15px',
    right: '15px',
  },
  noTurnos: {
    textAlign: 'center' as const,
    fontSize: '1.1em',
    marginTop: '20px',
  },
  newAppointmentButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
  },
  historyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    marginBottom: '20px',
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

export default MisTurnos;