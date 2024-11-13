import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig';

interface Barber {
  id: string;
  nombre: string;
  especialidad: string;
  local: string;
}

interface Turno {
  id: string;
  cliente: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'completado' | 'cancelado';
  emailBarbero: string;
  local: string;
}

interface UserData {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  local: string;
  imagen: string; // Añadido el campo de imagen en base64
}

const AdminBarber: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar el menú desplegable
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (!storedUserData) {
      setError('No se encontró información de usuario. Por favor, inicia sesión nuevamente.');
      setLoading(false);
      return;
    }

    try {
      const parsedUserData: UserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      fetchData(parsedUserData);
    } catch (error) {
      console.error('Error al parsear los datos del usuario:', error);
      setError('Error al cargar los datos del usuario. Por favor, inicia sesión nuevamente.');
      setLoading(false);
    }
  }, []);

  const fetchData = async (userData: UserData) => {
    try {
      const [barbersResponse, turnosResponse] = await Promise.all([
        api.get('/barberos'),
        api.get('/turno')
      ]);

      const filteredBarbers = barbersResponse.data.filter(
        (barber: Barber) => barber.local.toLowerCase() === userData.local.toLowerCase()
      );
      setBarbers(filteredBarbers);

      const filteredTurnos = turnosResponse.data.filter(
        (turno: Turno) => turno.local.toLowerCase() === userData.local.toLowerCase()
      );
      setTurnos(filteredTurnos);

      setLoading(false);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleTicketTurnosClick = () => {
    navigate('/ticket-turnos');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/iniciar-sesion-barberia');
  };

  const toggleCompletedTurnos = () => {
    setShowCompleted(!showCompleted);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  if (loading) return <div style={styles.loading}>Cargando...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!userData) return <div style={styles.error}>No se pudo cargar la información del usuario.</div>;

  const pendingTurnos = turnos.filter(turno => turno.estado === 'pendiente');
  const completedTurnos = turnos.filter(turno => turno.estado === 'completado');

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <img
          src={`data:image/jpeg;base64,${userData.imagen}`}
          alt="Perfil"
          style={styles.profileIcon}
          onClick={toggleMenu}
        />
        {menuVisible && (
          <div style={styles.menu}>
            <button onClick={() => navigate('/perfil-admin')} style={styles.menuItem}>Mi Perfil</button>
            <button onClick={handleLogout} style={styles.menuItem}>Cerrar Sesión</button>
          </div>
        )}
      </nav>

      <div style={styles.panel}>
        <h1 style={styles.title}>Panel de Administración - {userData.local}</h1>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Barberos</h2>
          <ul style={styles.list}>
            {barbers.map(barber => (
              <li key={barber.id} style={styles.listItem}>
                {barber.nombre} - {barber.especialidad}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Turnos</h2>
          <div style={styles.columns}>
            <div style={styles.column}>
              <h3 style={styles.columnTitle}>Pendientes</h3>
              <ul style={styles.list}>
                {pendingTurnos.map(turno => (
                  <li key={turno.id} style={styles.listItem}>
                    <div>Hora: {turno.hora}</div>
                    <div>Cliente: {turno.cliente}</div>
                    <div>Barbero: {turno.emailBarbero}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.column}>
              <h3 style={styles.columnTitle} onClick={toggleCompletedTurnos}>
                Completados {showCompleted ? '▲' : '▼'}
              </h3>
              {showCompleted && (
                <ul style={styles.list}>
                  {completedTurnos.map(turno => (
                    <li key={turno.id} style={styles.listItem}>
                      <div>Fecha: {turno.fecha}</div>
                      <div>Hora: {turno.hora}</div>
                      <div>Cliente: {turno.cliente}</div>
                      <div>Barbero: {turno.emailBarbero}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <button onClick={handleTicketTurnosClick} style={styles.button}>
          Ir a Ticket-Turnos
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative' as const,
  },
  nav: {
    position: 'absolute' as const,
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  profileIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  menu: {
    position: 'absolute' as const,
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  menuItem: {
    padding: '10px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    fontSize: '14px',
  },
  panel: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
    textAlign: 'center' as const,
    color: '#333',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  list: {
    listStyleType: 'none' as const,
    padding: 0,
  },
  listItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  columns: {
    display: 'flex',
    gap: '20px',
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    color: '#666',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'block',
    margin: '20px auto 0',
  },
  loading: {
    textAlign: 'center' as const,
    fontSize: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    fontSize: '20px',
  },
};

export default AdminBarber;
