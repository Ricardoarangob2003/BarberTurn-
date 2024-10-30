import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig';

const LoginRegister: React.FC = () => {
  const [esLogin, setEsLogin] = useState(true);
  const [paso, setPaso] = useState(1);
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [local, setLocal] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuesta = await api.get('/adminbarberia');
      const adminEncontrado = respuesta.data.find((admin: any) => 
        admin.correo === correo && admin.contrasena === contrasena
      );

      if (adminEncontrado) {
        localStorage.setItem('user', JSON.stringify({
          id: adminEncontrado.id,
          correo: adminEncontrado.correo,
          nombre: adminEncontrado.nombre,
          apellido: adminEncontrado.apellido,
          local: adminEncontrado.local,
        }));
        
        navigate('/Dashboard-Barberia');
      } else {
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error en el servidor. Por favor, intenta más tarde.');
    }
  };

  const manejarRegistroPaso1 = (e: React.FormEvent) => {
    e.preventDefault();
    setPaso(2);
  };

  const manejarRegistroPaso2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const respuestaAdmin = await api.post('/adminbarberia/post', {
        correo,
        nombre,
        apellido,
        local,
        contrasena,
        telefono,
        direccion,
      });

      if (respuestaAdmin.data && respuestaAdmin.data.id) {
        await api.post('/local/post', {
          adminId: respuestaAdmin.data.id,
          nombre: local,
          direccion,
          telefono,
          local
        });

        alert('Registro exitoso. Por favor, inicia sesión.');
        setEsLogin(true);
        setCorreo('');
        setContrasena('');
      } else {
        alert('Error en el registro. Por favor, intenta de nuevo.');
      }
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
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Nombre del Local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
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
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="tel"
                placeholder="Teléfono del Local"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
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