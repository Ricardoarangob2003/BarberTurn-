import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Menu, User, Calendar } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface Barbershop {
  id: string;
  local: string;
  direccion: string;
  telefono: string;
  calificacion: number;
}

const BarberiasDisponibles: React.FC = () => {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const response = await axiosInstance.get('local');
        setBarbershops(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching barbershops:', err);
        setError('Error al cargar las barberías. Por favor, intente de nuevo más tarde.');
        setIsLoading(false);
      }
    };

    fetchBarbershops();
  }, []);

  const handleBarbershopSelect = (id: string, name: string) => {
    localStorage.setItem('selectedLocal', name);
    localStorage.setItem('selectedLocalId', id);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Obtener la imagen de perfil desde localStorage
  const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
  const userImage = userInfo.imagen || ''; // Si no hay imagen, se usará el string vacío

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>BarberTurn</h1>
          <p style={styles.loadingText}>Cargando barberías...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>BarberTurn</h1>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>BarberTurn</h1>
          <button onClick={toggleMenu} style={styles.menuButton}>
            <Menu size={24} />
          </button>
          {isMenuOpen && (
            <div style={styles.menuDropdown}>
              <button onClick={() => navigateTo('/mi-perfil')} style={styles.menuItem}>
                <User size={18} />
                <span>Mi Perfil</span>
              </button>
              <button onClick={() => navigateTo('/mis-turnos')} style={styles.menuItem}>
                <Calendar size={18} />
                <span>Mis Turnos</span>
              </button>
            </div>
          )}
        </div>
        <h2 style={styles.subtitle}>Barberías Disponibles</h2>
        <div style={styles.barberList}>
          {barbershops.map((shop) => (
            <Link
              key={shop.id}
              to={`/barberos-disponibles/${encodeURIComponent(shop.local)}`}
              style={styles.barberLink}
              onClick={() => handleBarbershopSelect(shop.id, shop.local)}
            >
              <div style={styles.barberItem}>
                <div style={styles.profilePicture}>
                  {/* Mostrar la imagen de perfil si existe, sino mostrar el placeholder */}
                  {userImage ? (
                    <img src={userImage} alt="Profile" style={styles.profileImage} />
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
                      <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  )}
                </div>
                <div style={styles.barberInfo}>
                  <h3 style={styles.barberName}>{shop.local}</h3>
                  <p style={styles.barberSlogan}>{shop.direccion}</p>
                  <div style={styles.stars}>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={12}
                        fill={index < shop.calificacion ? 'gold' : 'none'}
                        stroke={index < shop.calificacion ? 'gold' : 'gray'}
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
    position: 'relative' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.5em',
    color: '#333',
    margin: 0,
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
  },
  menuDropdown: {
    position: 'absolute' as const,
    top: '60px',
    right: '20px',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f0f0f0',
    },
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
    cursor: 'pointer',
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
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover' as 'cover', // Aquí aseguramos que sea un valor válido
  },
  barberInfo: {
    textAlign: 'center' as const,
  },
  barberName: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#333',
    margin: '5px 0',
  },
  barberSlogan: {
    fontSize: '0.9em',
    color: '#777',
    marginBottom: '10px',
  },
  stars: {
    display: 'flex',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '10px',
    fontSize: '0.9em',
    color: '#777',
    marginTop: '20px',
  },
  loadingText: {
    fontSize: '1.2em',
    color: '#555',
  },
  errorText: {
    color: 'red',
    fontSize: '1.2em',
  },
};

export default BarberiasDisponibles