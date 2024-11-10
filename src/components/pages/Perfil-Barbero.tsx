import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft, Camera } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface BarberData {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string;
  imagenPerfil: string;
}

interface Credentials {
  username: string;
}

const PerfilBarbero: React.FC = () => {
  const [barberData, setBarberData] = useState<BarberData | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({ username: '' });
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarberData = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setBarberData(parsedUser);
        setCredentials({ username: parsedUser.username || '' });
      }
      setIsLoading(false);
    };

    fetchBarberData();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBarberData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitPersonalData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (barberData) {
        await axiosInstance.put(`/barbero/${barberData.id}`, barberData);
        setSuccess('Datos personales actualizados con éxito');
      }
    } catch (error) {
      setError('Error al actualizar los datos personales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (barberData) {
        await axiosInstance.put(`/user/barbero/${barberData.id}`, credentials);
        setSuccess('Credenciales actualizadas con éxito');
      }
    } catch (error) {
      setError('Error al actualizar las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && barberData) {
      const formData = new FormData();
      formData.append('image', file);
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await axiosInstance.post(`/user/profile-image/${barberData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setBarberData(prev => prev ? { ...prev, imagenPerfil: response.data.imageUrl } : null);
        setSuccess('Imagen de perfil actualizada con éxito');
      } catch (error) {
        setError('Error al actualizar la imagen de perfil');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  if (!barberData) {
    return <div style={styles.error}>No se pudo cargar la información del barbero</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <Link to="/dashboard-barbero" style={styles.backButton}>
          <ArrowLeft size={20} />
          Volver al Dashboard
        </Link>
        <h1 style={styles.title}>Mi Perfil</h1>
        
        <div style={styles.profileImageContainer}>
          <img 
            src={barberData.imagenPerfil || '/placeholder.svg?height=100&width=100'} 
            alt="Perfil" 
            style={styles.profileImage} 
          />
          <label htmlFor="imageUpload" style={styles.imageUploadLabel}>
            <Camera size={20} />
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              style={styles.imageUploadInput}
            />
          </label>
        </div>

        <div style={styles.tabContainer}>
          <button 
            style={activeTab === 'personal' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} 
            onClick={() => setActiveTab('personal')}
          >
            <User size={20} />
            Datos Personales
          </button>
          <button 
            style={activeTab === 'security' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} 
            onClick={() => setActiveTab('security')}
          >
            <Lock size={20} />
            Seguridad
          </button>
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        {activeTab === 'personal' && (
          <form onSubmit={handleSubmitPersonalData} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="nombre" style={styles.label}>Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={barberData.nombre}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="apellido" style={styles.label}>Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={barberData.apellido}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={barberData.email}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="telefono" style={styles.label}>Teléfono:</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={barberData.telefono}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              
            </div>
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Actualizar Datos Personales'}
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <div>
            <form onSubmit={handleSubmitCredentials} style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="username" style={styles.label}>Nombre de Usuario:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleCredentialsChange}
                  style={styles.input}
                  required
                />
              </div>
              <button type="submit" style={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Actualizando...' : 'Actualizar Nombre de Usuario'}
              </button>
            </form>
          </div>
        )}
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
    maxWidth: '600px',
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
    fontSize: '2rem',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  profileImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative' as const,
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
  },
  imageUploadLabel: {
    position: 'absolute' as const,
    bottom: '0',
    right: '0',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
  },
  imageUploadInput: {
    display: 'none',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  tabButton: {
    flex: '1',
    padding: '10px',
    backgroundColor: 'transparent',
    border: '1px solid #007bff',
    color: '#007bff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  activeTab: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  errorMessage: {
    color: '#ff4d4d',
    marginBottom: '10px',
  },
  successMessage: {
    color: '#4CAF50',
    marginBottom: '10px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2em',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  error: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2em',
    color: '#ff4d4d',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
};

export default PerfilBarbero;