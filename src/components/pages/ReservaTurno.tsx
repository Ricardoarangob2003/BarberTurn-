import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, X, ChevronDown, ChevronUp, Check } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
}

interface Reservation {
  fecha: string;
  hora: string;
  barberoId: string;
  serviciosAdicionales: string[];
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const ReservaTurno: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reservation, setReservation] = useState<Reservation>({
    fecha: '',
    hora: '',
    barberoId: '',
    serviciosAdicionales: [],
  });
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [barberName, setBarberName] = useState('');
  const [barberEmail, setBarberEmail] = useState('');
  const [showServices, setShowServices] = useState(false);
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const serviciosAdicionales = [ 'Tinte', 'Mascarilla',  'Depilación de cejas'];

  useEffect(() => {
    const storedBarberName = localStorage.getItem('selectedBarberName');
    const storedBarberEmail = localStorage.getItem('selectedBarberEmail');
    
    
    if (storedBarberName && storedBarberEmail ) {
      setBarberName(storedBarberName);
      setBarberEmail(storedBarberEmail);
      setReservation(prev => ({
        ...prev,
        
      }));
    } else {
      navigate('/barberos-disponibles/barbafina');
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/iniciar-sesion');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setReservation(prev => ({
      ...prev,
      serviciosAdicionales: prev.serviciosAdicionales.includes(service)
        ? prev.serviciosAdicionales.filter(s => s !== service)
        : [...prev.serviciosAdicionales, service],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const confirmReservation = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/reservations', reservation);
      setNotification({ show: true, message: '¡Reserva confirmada con éxito!', type: 'success' });
      setTimeout(() => navigate('/mis-turnos'), 2000);
    } catch (error) {
      setNotification({ show: true, message: 'Error al confirmar la reserva. Intente nuevamente.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/iniciar-sesion');
  };

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
        <h2 style={styles.subtitle}>Reserva tu Turno</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="fecha">Fecha:</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={reservation.fecha}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="hora">Hora:</label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={reservation.hora}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="barbero">Barbero:</label>
            <input
              type="text"
              id="barbero"
              value={barberName}
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <button 
              type="button" 
              onClick={() => setShowServices(!showServices)}
              style={styles.servicesToggle}
            >
              Servicios adicionales {showServices ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showServices && (
              <div style={styles.servicesList}>
                {serviciosAdicionales.map(service => (
                  <div 
                    key={service} 
                    onClick={() => handleServiceToggle(service)}
                    style={styles.serviceItem}
                  >
                    <span>{service}</span>
                    {reservation.serviciosAdicionales.includes(service) && <Check size={20} color="green" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" style={styles.button}>Reservar Turno</button>
        </form>

        <button onClick={() => navigate('/mis-turnos')} style={styles.viewAppointmentsButton}>
          <Calendar size={20} />
          Ver Mis Turnos
        </button>
      </div>

      {showSummary && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowSummary(false)} style={styles.closeButton}>
              <X size={24} />
            </button>
            <h3 style={styles.modalTitle}>Resumen de la Reserva</h3>
            <p><strong>Cliente:</strong> {user?.nombre} {user?.apellido}</p>
            <p><strong>Email del cliente:</strong> {user?.email}</p>
            <p><strong>Barbero:</strong> {barberName}</p>
            <p><strong>Email del barbero:</strong> {barberEmail}</p>
            <p><strong>Fecha:</strong> {reservation.fecha}</p>
            <p><strong>Hora:</strong> {reservation.hora}</p>
            <p><strong>Servicios adicionales:</strong> {reservation.serviciosAdicionales.join(', ') || 'Ninguno'}</p>
            <div style={styles.modalButtons}>
              <button onClick={() => setShowSummary(false)} style={styles.editButton}>
                Editar
              </button>
              <button onClick={confirmReservation} style={styles.confirmButton} disabled={isLoading}>
                {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.show && (
        <div style={notification.type === 'success' ? styles.successNotification : styles.errorNotification}>
          {notification.message}
        </div>
      )}
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
  subtitle: {
    fontSize: '1.5em',
    marginBottom: '20px',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '20px',
    borderRadius: '10px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  viewAppointmentsButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '90%',
    color: '#333',
    position: 'relative' as const,
  },
  closeButton: {
    position: 'absolute' as const,
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  modalTitle: {
    fontSize: '1.5em',
    marginBottom: '15px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  editButton: {
    padding: '10px 15px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  confirmButton: {
    padding: '10px 15px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  servicesToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
  },
  servicesList: {
    marginTop: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '5px',
    padding: '10px',
  },
  serviceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 0',
    cursor: 'pointer',
  },
  successNotification: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000,
  },
  errorNotification: {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: 1000,
  },
};

export default ReservaTurno;