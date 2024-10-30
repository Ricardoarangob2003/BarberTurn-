import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Facebook } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* Enlace para barberías en la esquina superior derecha */}
      <div style={styles.topRightLink}>
        <Link to="/iniciar-sesion-barberia" style={styles.barberLink}>
          ¿Eres una barbería? Ingresa aquí
        </Link>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>BarberTurn</h1>
        <img src="/assets/imgs/logo.png" alt="BarberTurn Logo" style={styles.logo} />
        <p style={styles.tagline}>
          EL FUTURO DEL CORTE: SIN FILAS, SIN ESPERAS...
        </p>
        
        <div style={styles.buttonGrid}>
          <Link to="/premium" style={styles.button}>
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
        <a href="https://www.instagram.com/barber_turn/" style={styles.socialIcon} aria-label="Instagram" target='_blank' rel="noreferrer noopener">
          <Instagram />
        </a>
        <a href="https://facebook.com" style={styles.socialIcon} aria-label="Facebook" target='_blank' rel="noreferrer noopener">
          <Facebook />
        </a>
        <a href="https://www.whatsapp.com" style={styles.socialIcon} aria-label="WhatsApp" target='_blank' rel="noreferrer noopener">
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
  topRightLink: {
    position: 'absolute' as const,
    top: '1rem',
    right: '1rem',
  },
  barberLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
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
    width: '250px',
    height: '250px',
    marginBottom: '1rem',
  },
  tagline: {
    fontSize: '1.4rem',
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
