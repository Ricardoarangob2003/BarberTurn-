import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Scissors } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface Barber {
  id: string;
  name: string;
  price: number;
  rating: number;
  local: string;
}

const placeholderBarbers: Barber[] = [
  { id: '1', name: 'Efrain', price: 55000, rating: 5, local: 'barbafina' },
  { id: '2', name: 'Carlos', price: 40000, rating: 4, local: 'tucorte' },
  { id: '3', name: 'Ramiro', price: 35000, rating: 3, local: 'barbershop' },
  { id: '4', name: 'Juan', price: 25000, rating: 2, local: 'urbanbarber' },
  { id: '5', name: 'Miguel', price: 30000, rating: 4, local: 'barbafina' },
];

const BarberosDisponibles: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>(placeholderBarbers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await axiosInstance.get('/barbers');
        setBarbers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching barbers:', err);
        setError('Error al cargar los barberos. Se muestran datos de ejemplo.');
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Barberos Disponibles</h2>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.barberList}>
          {barbers.map((barber) => (
            <Link
              key={barber.id}
              to={`/Reserva-Turno/${barber.id}`}
              style={styles.barberLink}
            >
              <div style={styles.barberItem}>
                <div style={styles.profilePicture}>
                  <Scissors size={30} color="white" />
                </div>
                <div style={styles.barberInfo}>
                  <h3 style={styles.barberName}>{barber.name}</h3>
                  <p style={styles.barberPrice}>{barber.price.toLocaleString()} COP</p>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill={index < barber.rating ? 'gold' : 'none'}
                        stroke={index < barber.rating ? 'gold' : 'gray'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={styles.footer}>
          © 2024 BarberTurn. Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-Q7o6O7FB8cgz1SLHAEc9d2u9QM5Lsr.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  content: {
    width: '90%',
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '2.5em',
    textAlign: 'center' as const,
    marginBottom: '10px',
    color: 'white',
  },
  subtitle: {
    fontSize: '1.5em',
    textAlign: 'center' as const,
    marginBottom: '20px',
    color: '#ccc',
  },
  barberList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  barberLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  barberItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(255,255,255,0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  profilePicture: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#444',
    marginRight: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barberInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
    marginBottom: '5px',
    color: 'white',
  },
  barberPrice: {
    fontSize: '1em',
    color: '#ccc',
    marginBottom: '5px',
  },
  stars: {
    display: 'flex',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center' as const,
    fontSize: '0.9em',
    color: '#ccc',
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    fontSize: '1em',
    padding: '10px',
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: '5px',
  },
};

export default BarberosDisponibles;