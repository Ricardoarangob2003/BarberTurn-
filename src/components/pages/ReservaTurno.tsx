import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, X, ChevronDown, ChevronUp, Check, Clock } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
}

interface Reservation {
  barbero: string;
  local: string;
  fecha: string;
  estado: string;
  corte: string;
  adicional: string;
  emailBarbero: string;
  emailCliente: string;
  cliente: string;
  hora: string;
}

interface Notification {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const initialReservationState: Reservation = {
  barbero: '',
  local: '',
  fecha: '',
  estado: 'Pendiente',
  corte: '',
  adicional: '',
  emailBarbero: '',
  emailCliente: '',
  cliente: '',
  hora: ''
};

const ReservaTurno: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [reservation, setReservation] = useState<Reservation>(initialReservationState);
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [notification, setNotification] = useState<Notification>({ show: false, message: '', type: 'success' });
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const navigate = useNavigate();

  const serviciosAdicionales = ['Tinte', 'Mascarilla', 'Depilación de cejas'];

  useEffect(() => {
    const storedData = fetchStoredData();
    if (!storedData.user) {
      navigate('/iniciar-sesion');
    } else {
      initializeReservation(storedData);
    }
  }, [navigate]);

  const fetchStoredData = () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    barberName: localStorage.getItem('selectedBarberName') || '',
    barberEmail: localStorage.getItem('selectedBarberEmail') || '',
    corte: localStorage.getItem('corte') || '',
    local: localStorage.getItem('selectedLocal') || 'name'
  });

  const initializeReservation = (data: ReturnType<typeof fetchStoredData>) => {
    if (data.user) {
      setUser(data.user);
      setReservation((prev) => ({
        ...prev,
        barbero: data.barberName,
        emailBarbero: data.barberEmail,
        corte: data.corte,
        cliente: `${data.user.nombre} ${data.user.apellido}`,
        emailCliente: data.user.email,
        local: data.local
      }));
    }
  };

  const generateTimeSlots = (startHour: number, endHour: number, interval: number): string[] => {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const updateAvailableHours = (selectedDate: string) => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const isToday = selectedDateObj.getTime() === today.getTime();
    const currentHour = isToday ? new Date().getHours() : 9;
    const slots = generateTimeSlots(Math.max(9, currentHour), 21, 60);

    setAvailableHours(isToday ? filterCurrentDaySlots(slots) : slots);
  };

  const filterCurrentDaySlots = (slots: string[]): string[] => {
    const now = new Date();
    return slots.filter((time) => {
      const [hour, minute] = time.split(':').map(Number);
      return hour > now.getHours() || (hour === now.getHours() && minute > now.getMinutes());
    });
  };

 
   // Modificación en `handleInputChange`
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  if (name === 'fecha') {
      if (validateDate(value)) {
          updateAvailableHours(value);
      } else {
          alert('Por favor, seleccione una fecha válida (hoy o en el futuro).');
          return;
      }
  }
  setReservation((prev) => ({ ...prev, [name]: value }));
};

// Nueva implementación de `validateDate`:
const validateDate = (selectedDate: string) => {
  const today = new Date();
  const selectedDateObj = new Date(selectedDate);

  // Redondea el valor de hoy para que sólo cuente la fecha
  today.setHours(0, 0, 0, 0);
  selectedDateObj.setHours(0, 0, 0, 0);

  // Devuelve true si la fecha es hoy o posterior
  return selectedDateObj.getTime() >= today.getTime();
};


  const toggleService = (service: string) => {
    setReservation((prev) => {
      const services = prev.adicional ? prev.adicional.split(',') : [];
      const updatedServices = services.includes(service)
        ? services.filter((s) => s !== service)
        : [...services, service];
      return { ...prev, adicional: updatedServices.join(',') };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const confirmReservation = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('http://localhost:8090/api/turno/post', reservation);
      setNotification({
        show: true,
        message: response.status === 200 || response.status === 201 ? '¡Reserva confirmada con éxito!' : 'Error en el servidor.',
        type: response.status === 200 || response.status === 201 ? 'success' : 'error'
      });
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
            <label htmlFor="fecha" style={styles.label}>Fecha:</label>
            <div style={styles.inputWrapper}>
              
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={reservation.fecha}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
                style={styles.input}
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="hora" style={styles.label}>Hora:</label>
            <div style={styles.inputWrapper}>
              
              <select
                id="hora"
                name="hora"
                value={reservation.hora}
                onChange={handleInputChange}
                required
                style={styles.input}
              >
                <option value="">Seleccione una hora</option>
                {availableHours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="barbero" style={styles.label}>Barbero:</label>
            <input
              type="text"
              id="barbero"
              value={reservation.barbero}
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="corte" style={styles.label}>Corte seleccionado:</label>
            <input
              type="text"
              id="corte"
              value={reservation.corte}
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
                {serviciosAdicionales.map((service) => (
                  <div 
                    key={service} 
                    onClick={() => toggleService(service)}
                    style={styles.serviceItem}
                  >
                    <span>{service}</span>
                    {reservation.adicional.includes(service) && <Check size={20} color="green" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" style={styles.button}>Reservar Turno</button>
        </form>
        <button onClick={() => navigate('/mis-turnos')} style={styles.verTurnosButton}>
  Ver mis turnos
</button>
      </div>

      {showSummary && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowSummary(false)} style={styles.closeButton}>
              <X size={24} />
            </button>
            <h3 style={styles.modalTitle}>Resumen de la Reserva</h3>
            <p><strong>Cliente:</strong> {reservation.cliente}</p>
            <p><strong>Email del cliente:</strong> {reservation.emailCliente}</p>
            <p><strong>Barbero:</strong> {reservation.barbero}</p>
            <p><strong>Email del barbero:</strong> {reservation.emailBarbero}</p>
            <p><strong>Local:</strong> {reservation.local}</p>
            <p><strong>Fecha:</strong> {reservation.fecha}</p>
            <p><strong>Hora:</strong> {reservation.hora}</p>
            <p><strong>Corte seleccionado:</strong> {reservation.corte}</p>
            <p><strong>Servicios adicionales:</strong> {reservation.adicional || 'Ninguno'}</p>
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
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '0.9em',
    color: '#ddd',
  },
  inputWrapper: {
    position: 'relative' as const,
  },
  inputIcon: {
   
  },
  input: {
    width: '100%',
    padding: '10px 10px 10px 7px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '5px',
    color: 'black',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
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
    color: 'black',
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
  verTurnosButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px 15px',
    backgroundColor: '#2196F3', // Color diferente para identificarlo
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px', // Ajuste de separación con otros elementos
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