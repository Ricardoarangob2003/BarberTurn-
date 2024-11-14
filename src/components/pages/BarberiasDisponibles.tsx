import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Menu, User, Calendar, LogOut } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface Barbershop {
  id: string;
  local: string;
  direccion: string;
  telefono: string;
  calificacion: number;
  imagen: string | null;
}

interface UserInfo {
  imagen: string | null;
}

const BarberiasDisponibles: React.FC = () => {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ imagen: null });
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

    // Función para cargar la información del usuario desde localStorage
    const loadUserInfo = () => {
      const storedUserInfo = localStorage.getItem('user');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    };

    fetchBarbershops();
    loadUserInfo();

    // Escuchar cambios en localStorage para actualizar userInfo automáticamente
    window.addEventListener('storage', loadUserInfo);

    return () => {
      window.removeEventListener('storage', loadUserInfo);
    };
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/iniciar-sesion');
  };

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
          <div style={styles.userMenuContainer}>
            <button onClick={toggleMenu} style={styles.userMenuButton}>
              {userInfo.imagen ? (
                <img 
                  src={`data:image/jpeg;base64,${userInfo.imagen}`} 
                  alt="Profile" 
                  style={styles.userMenuImage} 
                />
              ) : (
                <User size={24} />
              )}
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
                <button onClick={handleLogout} style={styles.menuItem}>
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
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
                  {shop.imagen ? (
                    <img 
                      src={`data:image/jpeg;base64,${shop.imagen}`} 
                      alt={shop.local} 
                      style={styles.profileImage} 
                    />
                  ) : (
                    <User size={24} />
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
  userMenuContainer: {
    position: 'relative' as const,
  },
  userMenuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    overflow: 'hidden',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMenuImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    borderRadius: '50%',
  },
  menuDropdown: {
    position: 'absolute' as const,
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    minWidth: '150px',
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
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
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
    textAlign: 'center' as const,
  },
  errorText: {
    color: 'red',
    fontSize: '1.2em',
    textAlign: 'center' as const,
  },
};

export default BarberiasDisponibles;