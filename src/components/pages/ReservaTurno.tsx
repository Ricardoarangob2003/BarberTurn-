import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, X } from 'lucide-react';

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
  const [barberName, setBarberName] = useState(''); // Guardar el nombre del barbero
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar el barbero seleccionado del localStorage
    const storedBarber = localStorage.getItem('selectedBarber');
    
    if (storedBarber) {
      const barber = JSON.parse(storedBarber);
      setReservation(prev => ({
        ...prev,
        barberId: barber.id, // Asignar el id del barbero
      }));
      setBarberName(barber.name); // Asignar el nombre del barbero
    }

    // Recuperar los datos del usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setReservation(prev => ({
      ...prev,
      serviciosAdicionales: checked
        ? [...prev.serviciosAdicionales, value]
        : prev.serviciosAdicionales.filter(service => service !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSummary(true);
  };

  const handleConfirmReservation = async () => {
    setIsLoading(true);
    try {
      console.log('Reservación confirmada:', reservation);
      navigate('/reserva-confirmada');
    } catch (error) {
      console.error('Error creando la reserva:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
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
              value={barberName} // Usamos el nombre del barbero recuperado
              readOnly
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Servicios adicionales:</label>
            <div style={styles.checkboxGroup}>
              {['Afeitado', 'Tinte', 'Mascarilla'].map(service => (
                <label key={service} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="serviciosAdicionales"
                    value={service}
                    checked={reservation.serviciosAdicionales.includes(service)}
                    onChange={handleCheckboxChange}
                  />
                  {service}
                </label>
              ))}
            </div>
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
            <p><strong>Barbero:</strong> {barberName}</p> {/* Mostramos el nombre del barbero aquí */}
            <p><strong>Fecha:</strong> {reservation.fecha}</p>
            <p><strong>Hora:</strong> {reservation.hora}</p>
            <p><strong>Servicios adicionales:</strong> {reservation.serviciosAdicionales.join(', ') || 'Ninguno'}</p>
            <div style={styles.modalButtons}>
              <button onClick={() => setShowSummary(false)} style={styles.editButton}>
                Editar
              </button>
              <button onClick={handleConfirmReservation} style={styles.confirmButton} disabled={isLoading}>
                {isLoading ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
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
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
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
};

export default ReservaTurno;