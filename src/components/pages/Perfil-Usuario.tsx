import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CreditCard, Lock, ArrowLeft, Camera, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../../axiosConfig';

interface UserData {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  imagenPerfil: string;
}

interface Credentials {
  username: string;
  
}

interface PaymentMethod {
  id: string;
  tipo: string;
  ultimosDigitos: string;
}

const PerfilCliente: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [credentials, setCredentials] = useState<Credentials>({ username: '' });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      setCredentials({ username: parsedUser.username || '' });
      
      const storedPaymentMethods = localStorage.getItem('paymentMethods');
      if (storedPaymentMethods) {
        setPaymentMethods(JSON.parse(storedPaymentMethods));
      }
    } else {
      navigate('/iniciar-sesion');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => prev ? { ...prev, [name]: value } : null);
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
      if (userData) {
        await axiosInstance.put(`cliente/${userData.id}`, userData);
        localStorage.setItem('user', JSON.stringify(userData));
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
      if (userData) {
        await axiosInstance.put(`/user/cliente/${userData.id}`, credentials);
        const updatedUser = { ...userData, username: credentials.username };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setSuccess('Credenciales actualizadas con éxito');
      }
    } catch (error) {
      setError('Error al actualizar las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value; // Confirmar contraseña

    // Verifica si la nueva contraseña y la confirmación coinciden
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      if (userData) {
        // Enviar solo la nueva contraseña
        await axiosInstance.put(`/user/cliente/${userData.id}`, { password: newPassword });
        setSuccess('Contraseña cambiada con éxito');
        form.reset();
      }
    } catch (error: any) {
      setError('Error al cambiar la contraseña. Por favor, intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
};

  const handleAddPaymentMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const cardNumber = (form.elements.namedItem('cardNumber') as HTMLInputElement).value;
    const expiryDate = (form.elements.namedItem('expiryDate') as HTMLInputElement).value;
    const cvv = (form.elements.namedItem('cvv') as HTMLInputElement).value;

    try {
      if (userData) {
        const response = await axiosInstance.put(`/user/cliente/${userData.id}`, { cardNumber, expiryDate, cvv });
        const newPaymentMethod = response.data;
        const updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
        setPaymentMethods(updatedPaymentMethods);
        localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
        setSuccess('Método de pago añadido con éxito');
        form.reset();
      }
    } catch (error) {
      setError('Error al añadir el método de pago');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (userData) {
        await axiosInstance.delete(`/user/payment-methods/${userData.id}/${id}`);
        const updatedPaymentMethods = paymentMethods.filter(method => method.id !== id);
        setPaymentMethods(updatedPaymentMethods);
        localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
        setSuccess('Método de pago eliminado con éxito');
      }
    } catch (error) {
      setError('Error al eliminar el método de pago');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userData) {
      const formData = new FormData();
      formData.append('imagen', file);
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        const response = await axiosInstance.put(`/cliente/imagen/${userData.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const updatedUser = { ...userData, imagenPerfil: response.data.imageUrl };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Imagen de perfil actualizada con éxito');
      } catch (error) {
        setError('Error al actualizar la imagen de perfil');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <Link to="/barberias-disponibles" style={styles.backButton}>
          <ArrowLeft size={20} />
          Volver
        </Link>
        <h1 style={styles.title}>Mi Perfil</h1>
        
        <div style={styles.profileImageContainer}>
          <img 
            src={userData.imagenPerfil || '/placeholder.svg?height=100&width=100'} 
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
          <button 
            style={activeTab === 'payment' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton} 
            onClick={() => setActiveTab('payment')}
          >
            <CreditCard size={20} />
            Métodos de Pago
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
                value={userData.nombre}
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
                value={userData.apellido}
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
                value={userData.email}
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
                value={userData.telefono}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
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
            <h3 style={styles.subtitle}>Cambiar Contraseña</h3>
            <form onSubmit={handlePasswordChange} style={styles.form}>
              <div style={styles.inputGroup}>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="newPassword" style={styles.label}>Nueva Contraseña:</label>
                <div style={styles.passwordInputWrapper}>
                  <input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    style={styles.input}
                    required
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
                    style={styles.input}
                    required
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
                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'payment' && (
          <div>
            <h3 style={styles.subtitle}>Métodos de Pago Actuales</h3>
            {paymentMethods.length > 0 ? (
              paymentMethods.map(method => (
                <div key={method.id} style={styles.paymentMethod}>
                  <CreditCard size={20} />
                  <span>{method.tipo} terminada en {method.ultimosDigitos}</span>
                  <button 
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    style={styles.deleteButton}
                    disabled={isLoading}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p>No tienes métodos de pago registrados.</p>
            )}
            <h3 style={styles.subtitle}>Añadir Nuevo Método de Pago</h3>
            <form onSubmit={handleAddPaymentMethod} style={styles.form}>
              <div style={styles.inputGroup}>
                <label htmlFor="cardNumber" style={styles.label}>Número de Tarjeta:</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="expiryDate" style={styles.label}>Fecha de Expiración:</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/AA"
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="cvv" style={styles.label}>CVV:</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  style={styles.input}
                  required
                />
              </div>
              <button type="submit" style={styles.submitButton} disabled={isLoading}>
                <Plus size={20} />
                {isLoading ? 'Añadiendo...' : 'Añadir Método de Pago'}
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
  subtitle: {
    fontSize: '1.2rem',
    marginTop: '20px',
    marginBottom: '10px',
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
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '10px',
    borderRadius: '4px',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ff4d4d',
    cursor: 'pointer',
    marginLeft: 'auto',
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

export default PerfilCliente;