import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/login', { email, password });
      console.log('Login successful:', response.data);
      // Aquí puedes manejar la respuesta exitosa, por ejemplo:
      // - Guardar el token en localStorage
      // localStorage.setItem('token', response.data.token);
      // - Actualizar el estado global de la aplicación
      // - Redirigir al usuario a la página principal
      navigate('/barberias-disponibles');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
      } else {
        setError('Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            style={styles.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            style={styles.input}
            required
          />
          <Link to="/recuperarcontraseña" style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Link>
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <p style={styles.footer}>
          ¿No tienes cuenta? <Link to="/registro" style={styles.registerLink}>Regístrate aquí</Link>
        </p>
        <p style={styles.footer}>© 2024 BarberTurn. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
  },
  loginBox: {
    width: '300px',
    padding: '40px',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.5) 100%)',
    borderRadius: '10px',
    textAlign: 'center' as const,
    color: 'white',
  },
  title: {
    fontSize: '2.5em',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.5em',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
  },
  forgotPassword: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.8em',
    alignSelf: 'flex-end' as const,
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    background: 'white',
    color: 'black',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.8em',
  },
  registerLink: {
    color: 'white',
    textDecoration: 'none',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};