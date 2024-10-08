import React, { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [registrationType, setRegistrationType] = useState('');
  const [gender, setGender] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    username: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8090/api/cliente/post', {
        ...formData,
        registrationType,
        gender
      });

      console.log('Registro exitoso:', response.data);
      // Aquí puedes manejar la respuesta exitosa, como redirigir al usuario o mostrar un mensaje de éxito
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Ocurrió un error durante el registro.');
      } else {
        setError('Ocurrió un error durante el registro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>BarberTurn</h1>
        <h2 style={styles.subtitle}>Registrarse</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tipo de Registro</label>
            <div style={styles.buttonGroup}>
              <button
                type="button"
                style={registrationType === 'Barbero' ? styles.activeButton : styles.button}
                onClick={() => setRegistrationType('Barbero')}
              >
                Barbero
              </button>
              <button
                type="button"
                style={registrationType === 'Cliente' ? styles.activeButton : styles.button}
                onClick={() => setRegistrationType('Cliente')}
              >
                Cliente
              </button>
            </div>
          </div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            style={styles.input}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            required
            style={styles.input}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            required
            style={styles.input}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            required
            style={styles.input}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="username"
            placeholder="Usuario"
            required
            style={styles.input}
            onChange={handleInputChange}
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            required
            style={styles.input}
            onChange={handleInputChange}
          />
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarme'}
            
          </button>
          
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.footer}>
          © 2024 BarberTurn. Todos los derechos reservados.
        </div>
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
    backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-gallery-tVsfhFLAU6Jg8Wx0HZ0WN8YsxgZbMP.jpg')`,
    backgroundSize: 'cover',
  },
  formContainer: {
    width: '400px',
    padding: '40px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '10px',
    color: 'white',
  },
  title: {
    fontSize: '2.5em',
    textAlign: 'center' as const,
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.5em',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '5px',
  },
  label: {
    fontSize: '0.9em',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
  },
  activeButton: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    background: 'white',
    color: 'black',
    cursor: 'pointer',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  submitButton: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    background: 'white',
    color: 'black',
    cursor: 'pointer',
    fontWeight: 'bold' as const,
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.8em',
    textAlign: 'center' as const,
  },
  error: {
    color: 'red',
    textAlign: 'center' as const,
    marginTop: '10px',
  },
};