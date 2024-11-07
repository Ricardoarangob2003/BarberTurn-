import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface Notification {
  message: string;
  type: 'success' | 'error';
}

const RestablecerContrasena: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const response = await axiosInstance.post('/restablecer-contrasena', { email });
      setNotification({
        message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.',
        type: 'success'
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNotification({
          message: 'No se encontró una cuenta asociada a este correo electrónico.',
          type: 'error'
        });
      } else {
        setNotification({
          message: 'Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.',
          type: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <Link to="/iniciar-sesion" style={styles.backButton}>
          <ArrowLeft size={20} />
          Volver
        </Link>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Restablecer Contraseña</h2>
        {notification && (
          <div style={notification.type === 'error' ? styles.errorNotification : styles.successNotification}>
            {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{notification.message}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <Mail size={20} style={styles.inputIcon} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
        <p style={styles.loginLink}>
          ¿Recordaste tu contraseña? <Link to="/iniciar-sesion" style={styles.link}>Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-tVsfhFLAU6Jg8Wx0HZ0WN8YsxgZbMP.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    color: 'white',
    position: 'relative' as const,
  },
  backButton: {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.25rem',
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputGroup: {
    position: 'relative' as const,
    marginBottom: '20px',
  },
  inputIcon: {
    position: 'absolute' as const,
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666',
  },
  input: {
    width: '95%',
    padding: '10px 10px 10px 40px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  errorNotification: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'rgba(220, 53, 69, 0.8)',
    color: 'white',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  successNotification: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'rgba(40, 167, 69, 0.8)',
    color: 'white',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  loginLink: {
    marginTop: '20px',
    textAlign: 'center' as const,
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default RestablecerContrasena;