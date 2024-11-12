import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Scissors, Check, X, AlertTriangle, Menu, User } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  imagen?: string;
}

interface Turno {
  id: string;
  fecha: string;
  hora: string;
  emailBarbero: string;
  corte: string;
  adicional: string;
  estado: string;
  local: string;
  emailCliente: string;
}

const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
} | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/iniciar-sesion');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const getImageUrl = (imageBlob: string) => {
  return `data:image/jpeg;base64,${imageBlob}`;
};

const BarberDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [allTurnos, setAllTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'pendientes' | 'completados' | 'cancelados'>('pendientes');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/iniciar-sesion');
      return;
    }

    const fetchTurnos = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:8090/api/turno");
        const fetchedTurnos = response.data;
        if (!Array.isArray(fetchedTurnos)) {
          setError('Error: Los datos recibidos no tienen el formato esperado.');
          setLoading(false);
          return;
        }
        const barberTurnos = fetchedTurnos.filter((turno: Turno) => turno.emailBarbero === user.email);
        setAllTurnos(barberTurnos);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los turnos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [user, navigate]);

  const handleUpdateTurnoStatus = async (id: string, newStatus: string) => {
    try {
      const turnoToUpdate = allTurnos.find(turno => turno.id === id);
      if (!turnoToUpdate) return;
      const updatedTurno = { ...turnoToUpdate, estado: newStatus };
      await axiosInstance.put(`http://localhost:8090/api/turno/${id}`, updatedTurno);
      setAllTurnos(allTurnos.map(turno => turno.id === id ? { ...turno, estado: newStatus } : turno));
    } catch {
      setError(`Error al actualizar el turno a ${newStatus}. Por favor, intente nuevamente.`);
    }
  };

  const filteredTurnos = allTurnos.filter(turno => {
    if (activeTab === 'pendientes') return turno.estado.toLowerCase() === 'pendiente';
    if (activeTab === 'completados') return turno.estado.toLowerCase() === 'completado';
    if (activeTab === 'cancelados') return turno.estado.toLowerCase() === 'cancelado';
    return false;
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigateToProfile = () => navigate('/perfil-barbero');

  if (loading) {
    return <div style={styles.loading}>Cargando tus turnos...</div>;
  }

  if (error) {
    return (
      <div style={styles.error}>
        <AlertTriangle size={24} />
        <p>{error}</p>
        <button onClick={() => window.location.reload()} style={styles.reloadButton}>Intentar de nuevo</button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>BarberTurn - Dashboard de Barbero</h1>
        <div style={styles.headerButtons}>
          <button onClick={toggleMenu} style={styles.menuButton}>
            {user.imagen ? (
              <img src={getImageUrl(user.imagen)} alt="Perfil" style={styles.profileImage} />
            ) : (
              <User size={20} />
            )}
          </button>
          {isMenuOpen && (
            <div style={styles.menuDropdown}>
              <button onClick={navigateToProfile} style={styles.menuItem}>
                <User size={20} />
                Mi Perfil
              </button>
              <button onClick={logout} style={styles.menuItem}>
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={styles.content}>
        <p style={styles.welcomeMessage}>Bienvenido, {user.nombre} {user.apellido}</p>
        <div style={styles.tabContainer}>
          <button style={activeTab === 'pendientes' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} onClick={() => setActiveTab('pendientes')}>Turnos Pendientes ({allTurnos.filter(t => t.estado.toLowerCase() === 'pendiente').length})</button>
          <button style={activeTab === 'completados' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} onClick={() => setActiveTab('completados')}>Turnos Completados ({allTurnos.filter(t => t.estado.toLowerCase() === 'completado').length})</button>
          <button style={activeTab === 'cancelados' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} onClick={() => setActiveTab('cancelados')}>Turnos Cancelados ({allTurnos.filter(t => t.estado.toLowerCase() === 'cancelado').length})</button>
        </div>
        <div style={styles.turnosList}>
          {filteredTurnos.map((turno) => (
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
                <p><strong>Estado:</strong> {turno.estado}</p>
              </div>
              {activeTab === 'pendientes' && (
                <div style={styles.turnoActions}>
                  <button onClick={() => handleUpdateTurnoStatus(turno.id, 'Completado')} style={styles.completeButton}><Check size={20} />Completar</button>
                  <button onClick={() => handleUpdateTurnoStatus(turno.id, 'Cancelado')} style={styles.cancelButton}><X size={20} />Cancelar</button>
                </div>
              )}
            </div>
          ))}
          {filteredTurnos.length === 0 && (
            <p style={styles.noTurnos}>No hay turnos {activeTab} para mostrar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// styles remain unchanged

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
  headerButtons: {
    position: 'relative' as const,
  },
  menuButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px 15px',
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  menuDropdown: {
    position: 'absolute' as const,
    top: '100%',
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '5px',
    padding: '10px',
    zIndex: 1000,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left' as const,
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
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  tabButton: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '0 5px',
    borderRadius: '5px',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  profileImage: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
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
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2em',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center' as const,
  },
  reloadButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
  },
};

export default function BarberDashboardWithAuth() {
  return (
    <AuthProvider>
      <BarberDashboard />
    </AuthProvider>
  );
}