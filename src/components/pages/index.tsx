import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, Phone } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>BarberTurn</h1>
        <img src="/assets/imgs/1.png" alt="BarberTurn Logo" style={styles.logo} />
        <p style={styles.tagline}>
          RESERVA TU CORTE DE CABELLO EN LA COMODIDAD DE TU HOGAR...
        </p>
        
        <div style={styles.buttonGrid}>
          <Link to="/premium" style={{...styles.button,}}>
            PREMIUM
          </Link>
          <Link to="/galeria" style={styles.button}>
            GALERIA
          </Link>
          <Link to="/turnos" style={styles.button}>
            TURNOS
          </Link>
          <Link to="/iniciar-sesion" style={styles.button}>
            INICIAR
          </Link>
        </div>
      </div>
      
      <footer style={styles.footer}>
        <a href="https://instagram.com" style={styles.socialIcon} aria-label="Instagram">
          <Instagram />
        </a>
        <a href="https://youtube.com" style={styles.socialIcon} aria-label="YouTube">
          <Youtube />
        </a>
        <a href="https://whatsapp.com" style={styles.socialIcon} aria-label="Llamar">
          <Phone />
        </a>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    textAlign: 'center' as const,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  logo: {
    width: '100px',
    height: '100px',
    marginBottom: '1rem',
  },
  tagline: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
    maxWidth: '600px',
  },
  buttonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    width: '100%',
    maxWidth: '400px',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: 'white',
    color: 'black',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  premiumButton: {
    gridColumn: '1 / -1',
    backgroundColor: '#FFD700',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  socialIcon: {
    color: 'white',
    margin: '0 0.5rem',
    transition: 'color 0.3s',
  },
};

export default Index;