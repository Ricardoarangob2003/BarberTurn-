import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Lock, ArrowLeft, Camera, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface BarberiaData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  imagen: string;
}

interface Credentials {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

const PerfilBarberia: React.FC = () => {
  const [barberiaData, setBarberiaData] = useState<BarberiaData | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('datos');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarberiaData = async () => {
      try {
        const response = await axiosInstance.get('/local');
        setBarberiaData(response.data);
        
      } catch (error) {
        setError('Error al cargar los datos de la barbería');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBarberiaData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBarberiaData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBarberiaData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (barberiaData) {
        await axiosInstance.put(`/barberia/${barberiaData.id}`, barberiaData);
        setSuccess('Datos de la barbería actualizados con éxito');
      }
    } catch (error) {
      setError('Error al actualizar los datos de la barbería');
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
      if (barberiaData) {
        if (credentials.newPassword !== credentials.confirmPassword) {
          throw new Error('Las contraseñas nuevas no coinciden');
        }
        await axiosInstance.put(`/local${barberiaData.id}`, credentials);
        setSuccess('Credenciales actualizadas con éxito');
        setCredentials(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && barberiaData) {
      const formData = new FormData();
      formData.append('imagen', file);
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await axiosInstance.put(`/barberia/imagen/${barberiaData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setBarberiaData(prev => prev ? { ...prev, imagen: response.data.imageUrl } : null);
        setSuccess('Imagen de la barbería actualizada con éxito');
      } catch (error) {
        setError('Error al actualizar la imagen de la barbería');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoading) {
    return <div style={styles.loading}>Cargando...</div>;
  }

  if (!barberiaData) {
    return <div style={styles.error}>No se pudo cargar la información de la barbería</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <Link to="/dashboard-barberia" style={styles.backButton}>
          <ArrowLeft size={20} />
          Volver al Dashboard
        </Link>
        <h1 style={styles.title}>Perfil de la Barbería</h1>
        
        <div style={styles.profileImageContainer}>
          <img 
            src={barberiaData.imagen || '/placeholder.svg?height=100&width=100'} 
            alt="Barbería" 
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
            style={activeTab === 'datos' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} 
            onClick={() => setActiveTab('datos')}
          >
            <Scissors size={20} />
            Datos de la Barbería
          </button>
          <button 
            style={activeTab === 'seguridad' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} 
            onClick={() => setActiveTab('seguridad')}
          >
            <Lock size={20} />
            Seguridad
          </button>
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>}
        {success && <p style={styles.successMessage}>{success}</p>}

        {activeTab === 'datos' && (
          <form onSubmit={handleSubmitBarberiaData} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="nombre" style={styles.label}>Nombre de la Barbería:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={barberiaData.nombre}
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
                value={barberiaData.telefono}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="direccion" style={styles.label}>Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={barberiaData.direccion}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Actualizar Datos de la Barbería'}
            </button>
          </form>
        )}

        {activeTab === 'seguridad' && (
          <form onSubmit={handleSubmitCredentials} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={barberiaData.email}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.inputGroup}>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="newPassword" style={styles.label}>Nueva Contraseña:</label>
              <div style={styles.passwordInputWrapper}>
                <input
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={credentials.newPassword}
                  onChange={handleCredentialsChange}
                  style={styles.input}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  style={styles.passwordToggle}
                >
                  {showPasswords.newPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirmar Nueva Contraseña:</label>
              <div style={styles.passwordInputWrapper}>
                <input
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={credentials.confirmPassword}
                  onChange={handleCredentialsChange}
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  style={styles.passwordToggle}
                >
                  {showPasswords.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Actualizando...' : 'Actualizar Credenciales'}
            </button>
          </form>
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
  passwordInputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  passwordToggle: {
    position: 'absolute' as const,
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
  },
};

export default PerfilBarberia;