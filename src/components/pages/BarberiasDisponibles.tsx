import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Barbershop {
  id: string;
  name: string;
  slogan: string;
  rating: number;
}

const barbershops: Barbershop[] = [
  { id: 'barbafina', name: 'Barbafina', slogan: 'Slogan', rating: 5 },
  { id: 'tucorte', name: 'Tu Corte', slogan: 'Slogan', rating: 4 },
  { id: 'barbershop', name: 'Barbershop', slogan: 'Slogan', rating: 3 },
  { id: 'urbanbarber', name: 'Urban Barber', slogan: 'Slogan', rating: 2 },
];

const BarberiasDisponibles: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Barberías Disponibles</h2>
        <div style={styles.barberList}>
          {barbershops.map((shop) => (
            <Link
              key={shop.id}
              to={`/barberos-disponibles/${shop.id}`}
              style={styles.barberLink}
            >
              <div style={styles.barberItem}>
                <div style={styles.profilePicture}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.barberInfo}>
                  <h3 style={styles.barberName}>{shop.name}</h3>
                  <p style={styles.barberSlogan}>{shop.slogan}</p>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={12}
                        fill={index < shop.rating ? 'gold' : 'none'}
                        stroke={index < shop.rating ? 'gold' : 'gray'}
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
    backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-Q7o6O7FB8cgz1SLHAEc9d2u9QM5Lsr.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  content: {
    width: '90%',
    maxWidth: '800px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5em',
    textAlign: 'center' as const,
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '1.5em',
    textAlign: 'center' as const,
    marginBottom: '20px',
    color: '#666',
  },
  barberList: {
    display: 'flex',
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    gap: '20px',
  },
  barberLink: {
    textDecoration: 'none',
    color: 'inherit',
    flex: '1 1 200px',
    maxWidth: '250px',
  },
  barberItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'white',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
  },
  profilePicture: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
  },
  barberInfo: {
    textAlign: 'center' as const,
  },
  barberName: {
    fontSize: '1.2em',
    fontWeight: 'bold' as const,
    marginBottom: '5px',
    color: '#333',
  },
  barberSlogan: {
    fontSize: '0.9em',
    color: '#666',
    marginBottom: '5px',
  },
  stars: {
    display: 'flex',
    justifyContent: 'center',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center' as const,
    fontSize: '0.9em',
    color: '#666',
  },
};

export default BarberiasDisponibles;