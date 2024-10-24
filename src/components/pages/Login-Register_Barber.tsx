import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig';

const LoginRegister: React.FC = () => {
  const [esLogin, setEsLogin] = useState(true);
  const [paso, setPaso] = useState(1);
  const navigate = useNavigate();

  // Estado para login
  const [correoLogin, setCorreoLogin] = useState('');
  const [contrasenaLogin, setContrasenaLogin] = useState('');

  // Estado para registro
  const [correoRegistro, setCorreoRegistro] = useState('');
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [apellidoRegistro, setApellidoRegistro] = useState('');
  const [localRegistro, setLocalRegistro] = useState('');
  const [contrasenaRegistro, setContrasenaRegistro] = useState('');
  const [direccionRegistro, setDireccionRegistro] = useState('');
  const [telefonoRegistro, setTelefonoRegistro] = useState('');

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await api.get('/api/adminbarberia', { 
        params: { correo: correoLogin, contrasena: contrasenaLogin }
      });
      localStorage.setItem('adminData', JSON.stringify(respuesta.data));
      navigate('/Dashboard-Barberia');
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Login fallido. Por favor, verifica tus credenciales.');
    }
  };

  const manejarRegistroPaso1 = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(2);
  };

  const manejarRegistroPaso2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuestaAdmin = await api.post('/api/adminbarberia', {
        correo: correoRegistro,
        nombre: nombreRegistro,
        apellido: apellidoRegistro,
        local: localRegistro,
        contrasena: contrasenaRegistro
      });

      await api.post('/api/local', {
        adminId: respuestaAdmin.data.id,
        nombre: localRegistro,
        direccion: direccionRegistro,
        telefono: telefonoRegistro
      });

      localStorage.setItem('adminData', JSON.stringify({
        ...respuestaAdmin.data,
        local: {
          nombre: localRegistro,
          direccion: direccionRegistro,
          telefono: telefonoRegistro
        }
      }));

      navigate('/Dashboard-Barberia');
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Registro fallido. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>{esLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>
        <div style={styles.toggleContainer}>
          <button
            style={{...styles.toggleButton, ...(esLogin ? styles.activeToggle : {})}}
            onClick={() => setEsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button
            style={{...styles.toggleButton, ...(!esLogin ? styles.activeToggle : {})}}
            onClick={() => {setEsLogin(false); setPaso(1);}}
          >
            Registrarse
          </button>
        </div>

        {esLogin ? (
          <form onSubmit={manejarLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Correo"
              value={correoLogin}
              onChange={(e) => setCorreoLogin(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasenaLogin}
              onChange={(e) => setContrasenaLogin(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.submitButton}>Iniciar Sesión</button>
          </form>
        ) : (
          paso === 1 ? (
            <form onSubmit={manejarRegistroPaso1} style={styles.form}>
              <input
                type="email"
                placeholder="Correo"
                value={correoRegistro}
                onChange={(e) => setCorreoRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Nombre"
                value={nombreRegistro}
                onChange={(e) => setNombreRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellidoRegistro}
                onChange={(e) => setApellidoRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Nombre del Local"
                value={localRegistro}
                onChange={(e) => setLocalRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasenaRegistro}
                onChange={(e) => setContrasenaRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.submitButton}>Siguiente</button>
            </form>
          ) : (
            <form onSubmit={manejarRegistroPaso2} style={styles.form}>
              <input
                type="text"
                placeholder="Dirección del Local"
                value={direccionRegistro}
                onChange={(e) => setDireccionRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="tel"
                placeholder="Teléfono del Local"
                value={telefonoRegistro}
                onChange={(e) => setTelefonoRegistro(e.target.value)}
                style={styles.input}
                required
              />
              <button type="submit" style={styles.submitButton}>Registrarse</button>
            </form>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '1rem',
    color: '#fff',
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  toggleButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  activeToggle: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  input: {
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    color: 'white'
  },
  submitButton: {
    padding: '0.5rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
};

export default LoginRegister;